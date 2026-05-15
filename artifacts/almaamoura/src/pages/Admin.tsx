import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search, Download, RefreshCw, Inbox, ArrowUpDown,
  Phone, Mail, Calendar, MessageSquare, Tag, Lock, Eye, EyeOff, LogOut
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Submission = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
};

type SortKey = "id" | "name" | "email" | "createdAt";
type SortDir = "asc" | "desc";

const TOKEN_KEY = "almaamoura_admin_token";

async function login(password: string): Promise<string> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error("Invalid password");
  const data = await res.json();
  return data.token as string;
}

async function fetchSubmissions(token: string): Promise<Submission[]> {
  const res = await fetch("/api/contact", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error("Failed to fetch submissions");
  return res.json();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function exportCSV(rows: Submission[]) {
  const headers = ["ID", "Name", "Email", "Phone", "Subject", "Message", "Date"];
  const csvRows = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        `"${r.email}"`,
        `"${(r.phone ?? "").replace(/"/g, '""')}"`,
        `"${(r.subject ?? "").replace(/"/g, '""')}"`,
        `"${r.message.replace(/"/g, '""')}"`,
        `"${formatDate(r.createdAt)}"`,
      ].join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `contact-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await login(password);
      localStorage.setItem(TOKEN_KEY, token);
      onLogin(token);
    } catch {
      setError("Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1B2E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-[#0D1B2E]" />
          </div>
          <h1 className="text-white font-bold text-xl">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">Al-Maamoura Advisory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPw ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border-white/15 text-white placeholder:text-white/30 pr-10 focus-visible:ring-amber-500 focus-visible:border-amber-500"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-amber-500 hover:bg-amber-400 text-[#0D1B2E] font-semibold py-5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Verifying…
              </span>
            ) : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Restricted access — authorised personnel only
        </p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "id", dir: "desc" });

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setSelected(null);
  };

  const { data, isLoading, isError, refetch, isFetching, error } = useQuery({
    queryKey: ["contact-submissions", token],
    queryFn: () => fetchSubmissions(token!),
    enabled: !!token,
    retry: false,
  });

  if ((error as Error)?.message === "UNAUTHORIZED") {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  if (!token) {
    return <LoginScreen onLogin={setToken} />;
  }

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "desc" }
    );
  };

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.toLowerCase();
    let rows = data.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.subject ?? "").toLowerCase().includes(q) ||
        r.message.toLowerCase().includes(q)
    );
    rows = [...rows].sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [data, search, sort]);

  const SortButton = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 hover:text-amber-400 transition-colors"
    >
      {label}
      <ArrowUpDown className="w-3 h-3 opacity-60" />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0D1B2E] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 flex items-center justify-center">
            <Inbox className="w-4 h-4 text-[#0D1B2E]" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Contact Inquiries</h1>
            <p className="text-white/40 text-xs">Al-Maamoura Advisory — Admin</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-white/20 text-white hover:bg-white/10 gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => filtered.length > 0 && exportCSV(filtered)}
            disabled={filtered.length === 0}
            className="bg-amber-500 hover:bg-amber-400 text-[#0D1B2E] font-semibold gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <a href="/" className="text-white/40 hover:text-white text-sm transition-colors ml-1">
            ← Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/30 hover:text-red-400 text-sm transition-colors ml-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-61px)]">
        {/* Left: Table */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-white/10 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                placeholder="Search by name, email, subject…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-amber-500 focus-visible:border-amber-500"
              />
            </div>
            <span className="text-white/40 text-sm">
              {isLoading ? "Loading…" : `${filtered.length} of ${data?.length ?? 0} inquiries`}
            </span>
          </div>

          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-white/40">
                <RefreshCw className="w-6 h-6 animate-spin mr-3" />
                Loading submissions…
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40">
                <p>Failed to load submissions.</p>
                <Button size="sm" variant="outline" onClick={() => refetch()} className="border-white/20 text-white hover:bg-white/10">
                  Try Again
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-white/40">
                <Inbox className="w-10 h-10" />
                <p>{search ? "No results match your search." : "No submissions yet."}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#0D1B2E] border-b border-white/10">
                  <tr className="text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-3 font-medium w-12">
                      <SortButton col="id" label="#" />
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      <SortButton col="name" label="Name" />
                    </th>
                    <th className="text-left px-4 py-3 font-medium">
                      <SortButton col="email" label="Email" />
                    </th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Subject</th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                      <SortButton col="createdAt" label="Date" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelected(row)}
                      className={`border-b border-white/5 cursor-pointer transition-colors ${
                        selected?.id === row.id
                          ? "bg-amber-500/10 border-l-2 border-l-amber-500"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className="px-6 py-3 text-white/30 tabular-nums">{row.id}</td>
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-white/60">{row.email}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {row.subject ? (
                          <Badge className="bg-white/10 text-white/70 border-0 text-xs font-normal">
                            {row.subject}
                          </Badge>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white/40 hidden lg:table-cell whitespace-nowrap">
                        {formatDate(row.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right: Detail Panel */}
        <div className={`w-96 border-l border-white/10 flex flex-col transition-all ${selected ? "" : "opacity-50"}`}>
          {selected ? (
            <>
              <div className="px-6 py-4 border-b border-white/10 flex items-start justify-between">
                <div>
                  <h2 className="font-bold text-base">{selected.name}</h2>
                  <p className="text-white/40 text-sm mt-0.5">Inquiry #{selected.id}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-white/30 hover:text-white transition-colors text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-auto px-6 py-5 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <a href={`mailto:${selected.email}`} className="text-white/80 hover:text-amber-400 transition-colors break-all">
                      {selected.email}
                    </a>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                      <a href={`tel:${selected.phone}`} className="text-white/80 hover:text-amber-400 transition-colors">
                        {selected.phone}
                      </a>
                    </div>
                  )}
                  {selected.subject && (
                    <div className="flex items-center gap-3 text-sm">
                      <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-white/80">{selected.subject}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-white/60">{formatDate(selected.createdAt)}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2 mb-3 text-white/40 text-xs uppercase tracking-wider">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/10">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject ?? "Your Inquiry")}`}
                  className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-[#0D1B2E] font-semibold py-2.5 text-sm transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/20 gap-2">
              <MessageSquare className="w-8 h-8" />
              <p className="text-sm">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

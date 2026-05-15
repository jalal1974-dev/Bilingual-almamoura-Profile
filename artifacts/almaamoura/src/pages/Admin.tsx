import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, RefreshCw, Inbox, ArrowUpDown, Phone, Mail, Calendar, MessageSquare, Tag } from "lucide-react";
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

async function fetchSubmissions(): Promise<Submission[]> {
  const res = await fetch("/api/contact");
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

export default function Admin() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "id", dir: "desc" });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: fetchSubmissions,
  });

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
          <a
            href="/"
            className="ml-2 text-white/40 hover:text-white text-sm transition-colors"
          >
            ← Back to Site
          </a>
        </div>
      </div>

      <div className="flex h-[calc(100vh-61px)]">
        {/* Left: Table */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search + Stats bar */}
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

          {/* Table */}
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

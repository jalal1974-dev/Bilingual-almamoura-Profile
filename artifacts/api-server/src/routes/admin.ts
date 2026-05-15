import { Router, type IRouter } from "express";
import { createHash } from "crypto";

const router: IRouter = Router();

function hashPassword(pw: string) {
  return createHash("sha256").update(pw).digest("hex");
}

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD environment variable is required.");
}

const VALID_TOKEN = hashPassword(ADMIN_PASSWORD + "almaamoura-admin-salt");

router.post("/admin/login", (req, res) => {
  const { password } = req.body as { password?: string };
  if (!password || hashPassword(password + "almaamoura-admin-salt") !== VALID_TOKEN) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  res.json({ token: VALID_TOKEN });
});

export function requireAdminToken(
  req: Parameters<Parameters<typeof router.use>[0]>[0],
  res: Parameters<Parameters<typeof router.use>[0]>[1],
  next: Parameters<Parameters<typeof router.use>[0]>[2]
) {
  const auth = req.headers["authorization"];
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || token !== VALID_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export default router;

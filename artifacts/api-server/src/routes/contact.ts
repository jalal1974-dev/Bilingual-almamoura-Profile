import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactSubmissionsTable, insertContactSubmissionSchema } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  try {
    const parsed = insertContactSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
      return;
    }

    const [submission] = await db
      .insert(contactSubmissionsTable)
      .values(parsed.data)
      .returning();

    res.status(201).json({ success: true, id: submission.id });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Failed to save submission" });
  }
});

router.get("/contact", async (_req, res) => {
  try {
    const submissions = await db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.createdAt));

    res.json(submissions);
  } catch (err) {
    console.error("Fetch submissions error:", err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

export default router;

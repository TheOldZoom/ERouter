import { Router } from "../../structures/Router";
import { Request, Response } from "express";

const router = new Router();

// GET /users
router.get((req, res) => {
  res.json({ message: "Fetching all users" });
});

// POST /users
router.post((req: Request, res: Response) => {
  if (!req.body?.name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  const { name } = req.body;

  res.json({ message: `User ${name} created` });
});

export default router;

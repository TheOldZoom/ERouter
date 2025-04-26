import { Router } from "../../structures/Router";

const router = new Router();

// GET /users/:id
router.get((req, res) => {
  const { id } = req.params;
  res.json({ message: `User ID: ${id}` });
});

export default router;

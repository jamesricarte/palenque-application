import express from "express";
import { getAuth } from "../../controllers/v1/auth";

const router = express.Router();

router.get("/auth", getAuth);

export default router;

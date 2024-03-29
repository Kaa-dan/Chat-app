import express from "express";
const router = express.Router();
import { createGroup ,getGroupData } from "../controllers/user.controller.js";

router.post("/creategroup", createGroup);
router.get('/groupdata/:id',getGroupData)

export default router;

import express from "express";
const router = express.Router();
import { createGroup ,getGroupData, getMessages,search,allSearch ,joinGroup } from "../controllers/user.controller.js";

router.post("/creategroup", createGroup);
router.get('/groupdata/:id',getGroupData)
router.get('/getmessages/:id',getMessages)
router.get('/search/:regi',search)
router.get('/allsearch',allSearch)
router.post('/joingroup',joinGroup)

export default router;

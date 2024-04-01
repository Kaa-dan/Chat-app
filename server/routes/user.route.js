import express from "express";
const router = express.Router();
import {
  createGroup,
  getGroupData,
  getMessages,
  search,
  allSearch,
  joinGroup,
  updatProfile,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyUser.js";
router.post("/creategroup", verifyToken, createGroup);
router.get("/groupdata/:id", verifyToken, getGroupData);
router.get("/getmessages/:id", verifyToken, getMessages);
router.get("/search/:regi", verifyToken, search);
router.get("/allsearch", verifyToken, allSearch);
router.post("/joingroup", verifyToken, joinGroup);
router.post("/updateprofile", verifyToken, updatProfile);

export default router;

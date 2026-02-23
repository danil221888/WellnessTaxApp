import express from "express";
import multer from "multer";
import {
  createOrder,
  importOrders,
  getOrders,
} from "../controllers/order.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getOrders);
router.post("/", createOrder);
router.post("/import", upload.single("file"), importOrders);

export default router;
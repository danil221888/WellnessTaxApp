import express from "express";
import cors from "cors";
import ordersRoutes from "./routes/orders.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/orders", ordersRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
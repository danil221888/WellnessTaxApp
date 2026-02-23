import { Request, Response } from "express";
import fs from "fs";
import csv from "csv-parser";
import { orderService } from "../services/order.service";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, subtotal } = req.body;

    const order = await orderService.createOrder({
      latitude,
      longitude,
      subtotal,
      timestamp: new Date(),
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
};

export const importOrders = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const results: any[] = [];
    let importError: any = null;

    const stream = fs.createReadStream(req.file.path);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("error", (error) => {
        importError = error;
      })
      .on("end", async () => {
        try {
          if (importError) {
            throw importError;
          }

          if (results.length === 0) {
            if (req.file) {
              fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: "CSV file is empty" });
          }

          const created = [];
          const errors = [];

          for (let i = 0; i < results.length; i++) {
            try {
              const row = results[i];
              
              if (!row.latitude || !row.longitude || !row.subtotal) {
                errors.push(`Row ${i + 1}: Missing required fields (latitude, longitude, subtotal)`);
                continue;
              }

              const order = await orderService.createOrder({
                latitude: parseFloat(row.latitude),
                longitude: parseFloat(row.longitude),
                subtotal: parseFloat(row.subtotal),
                timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
              });

              created.push(order);
            } catch (rowError: any) {
              errors.push(`Row ${i + 1}: ${rowError.message}`);
            }
          }

          if (req.file) {
            fs.unlinkSync(req.file.path);
          }

          res.json({
            created: created.length,
            errors: errors.length > 0 ? errors : undefined,
          });
        } catch (error: any) {
          if (req.file) {
            try {
              fs.unlinkSync(req.file.path);
            } catch (e) {}
          }
          res.status(500).json({ message: `Failed to process CSV data: ${error.message}` });
        }
      });
  } catch (error: any) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    res.status(500).json({ message: `Import failed: ${error.message}` });
  }
};
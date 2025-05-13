import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { generateId } from "../client/src/lib/utils";
import * as csv from "csv-parser";
import { Readable } from "stream";

// Setup multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all campaigns
  app.get("/api/campaigns", async (req: Request, res: Response) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Create a new campaign
  app.post("/api/campaigns", async (req: Request, res: Response) => {
    try {
      const { name, type } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({ message: "Campaign name and type are required" });
      }
      
      const id = generateId();
      const campaign = await storage.createCampaign({
        id,
        name,
        type,
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      res.status(201).json(campaign);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Publish a campaign with CSV data
  app.post("/api/campaigns/publish", upload.single('csvFile'), async (req: Request, res: Response) => {
    try {
      const { name, type } = req.body;
      const burnRulesStr = req.body.burnRules;
      const csvFile = req.file;
      
      if (!name || !type) {
        return res.status(400).json({ message: "Campaign name and type are required" });
      }
      
      if (!burnRulesStr) {
        return res.status(400).json({ message: "Burn rules are required" });
      }
      
      if (!csvFile) {
        return res.status(400).json({ message: "CSV file is required" });
      }
      
      // Parse the burn rules
      const burnRules = JSON.parse(burnRulesStr);
      
      // Generate campaign ID
      const campaignId = generateId();
      
      // Create the campaign
      const campaign = await storage.createCampaign({
        id: campaignId,
        name,
        type,
        status: "Active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      // Create burn rules
      await storage.createBurnRules({
        campaignId,
        expiryDays: burnRules.expiryDays,
        expiryPeriod: burnRules.expiryPeriod,
        minimumOrderValue: burnRules.minimumOrderValue
      });
      
      // Process CSV file
      const results: any[] = [];
      const stream = Readable.from(csvFile.buffer);
      
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            try {
              // For each row in the CSV, create a customer record
              for (const row of results) {
                await storage.createCustomer({
                  campaignId,
                  partnerUserId: row.partner_user_id || null,
                  contact: row.contact || null
                });
              }
              resolve();
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => reject(error));
      });
      
      res.status(201).json(campaign);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

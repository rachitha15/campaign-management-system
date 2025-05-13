import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { generateId } from "../client/src/lib/utils";
import csvParser from "csv-parser";
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
      const { name, type, forceStatus } = req.body;
      
      if (!name || !type) {
        return res.status(400).json({ message: "Campaign name and type are required" });
      }
      
      // Determine status based on type and forceStatus flag
      let status;
      if (forceStatus) {
        // Use the forced status if provided
        status = forceStatus;
      } else {
        // Default status based on type
        status = type === "one-time" ? "Campaign Ended" : "Active";
      }
      
      const id = generateId();
      const campaign = await storage.createCampaign({
        id,
        name,
        type,
        status,
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
      const { name, type, forceStatus } = req.body;
      const burnRulesStr = req.body.burnRules;
      const walletActionStr = req.body.walletAction;
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
      
      // Parse the burn rules and wallet action
      const burnRules = JSON.parse(burnRulesStr);
      const walletAction = walletActionStr ? JSON.parse(walletActionStr) : null;
      
      // Generate campaign ID
      const campaignId = generateId();
      
      // Determine status based on type and forceStatus flag
      let status;
      if (forceStatus) {
        // Use the forced status if provided
        status = forceStatus;
      } else {
        // Default status based on type
        status = type === "one-time" ? "Campaign Ended" : "Active";
      }
      
      // Create the campaign
      const campaign = await storage.createCampaign({
        id: campaignId,
        name,
        type,
        status,
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
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            try {
              // For each row in the CSV, create a customer record
              for (const row of results) {
                const loadId = generateId(8);
                await storage.createCustomer({
                  campaignId,
                  partnerUserId: row.partner_user_id || null,
                  contact: row.contact || null,
                  amount: walletAction ? walletAction.creditAmount : 0,
                  loadId,
                  errorReason: null
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

  // Get campaign results
  app.get("/api/campaigns/:id/results", async (req: Request, res: Response) => {
    try {
      const campaignId = req.params.id;
      const campaign = await storage.getCampaign(campaignId);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      if (campaign.type !== "one-time") {
        return res.status(400).json({ message: "Results are only available for one-time campaigns" });
      }
      
      // Get customers for this campaign
      const customers = await storage.getCustomersByCampaign(campaignId);
      
      // Transform to expected result format
      const results = customers.map(customer => ({
        partner_user_id: customer.partnerUserId || "",
        contact: customer.contact || "",
        amount: customer.amount || 0,
        load_id: customer.loadId || generateId(8), // Use existing or generate a new one
        status: customer.processed ? "success" : "pending",
        error_reason: customer.errorReason || ""
      }));
      
      res.json(results);
    } catch (error) {
      console.error("Error fetching campaign results:", error);
      res.status(500).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

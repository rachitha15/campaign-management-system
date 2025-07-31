import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { generateId } from "../client/src/lib/utils";
import csvParser from "csv-parser";
import { Readable } from "stream";
import { calculateCreditAmount, generateWalletId } from "./utils/creditCalculator";

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
        programId: null,
        triggerEvent: null,
        createdAt: new Date(),
        updatedAt: new Date()
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
        programId: null,
        triggerEvent: null,
        createdAt: new Date(),
        updatedAt: new Date()
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
              // For each row in the CSV, create a customer record and wallet
              for (const row of results) {
                const loadId = generateId(8);
                const partnerUserId = row.partner_user_id || null;
                
                // Calculate credit amount based on wallet action
                const creditAmount = walletAction ? calculateCreditAmount(walletAction, row) : 0;
                
                console.log(`Processing user: ${partnerUserId}, credit: ${creditAmount}, type: ${type}`);
                
                await storage.createCustomer({
                  campaignId,
                  partnerUserId,
                  contact: row.contact || null,
                  amount: creditAmount,
                  loadId,
                  errorReason: null
                });
                
                // Create or update wallet for one-time campaigns
                if (type === "one-time" && partnerUserId) {
                  console.log(`Creating/updating wallet for user: ${partnerUserId}`);
                  
                  // Check if wallet already exists for this user
                  const existingWallet = await storage.getWalletByPartnerUserId(partnerUserId);
                  
                  if (existingWallet) {
                    console.log(`Existing wallet found, updating balance from ${existingWallet.balance} to ${existingWallet.balance + creditAmount}`);
                    // Update existing wallet balance (additive)
                    const newBalance = existingWallet.balance + creditAmount;
                    await storage.updateWalletBalance(existingWallet.id, newBalance);
                  } else {
                    console.log(`Creating new wallet with balance: ${creditAmount}`);
                    // Create new wallet
                    const walletId = generateWalletId();
                    await storage.createWallet({
                      id: walletId,
                      partnerUserId,
                      balance: creditAmount,
                      campaignId
                    });
                  }
                }
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

  // Program API routes
  
  // Get all programs
  app.get("/api/programs", async (req: Request, res: Response) => {
    try {
      const programs = await storage.getAllPrograms();
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Get available file formats (must be before parameterized routes)
  app.get("/api/programs/file-formats", async (req: Request, res: Response) => {
    try {
      // Sample file formats that merchants can use
      const formats = [
        {
          id: "format_1",
          name: "Transaction Based Format",
          description: "For transaction-based promotions",
          fields: [
            { name: "partner_user_id", type: "string", required: true, description: "Unique identifier for the user" },
            { name: "email", type: "string", required: false, description: "User email address" },
            { name: "phone", type: "string", required: false, description: "User phone number (10 digits)" },
            { name: "transaction_amount", type: "number", required: true, description: "Transaction amount in rupees" },
            { name: "transaction_type", type: "string", required: true, description: "Type of transaction (purchase, refund, etc.)" }
          ]
        }
      ];
      res.json(formats);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Download sample file for a format (must be before parameterized routes)
  app.get("/api/programs/sample-file/:formatId", async (req: Request, res: Response) => {
    try {
      const formatId = req.params.formatId;
      
      if (formatId === "format_1") {
        // Generate sample CSV content
        const csvContent = `partner_user_id,email,phone,transaction_amount,transaction_type
user123,john@example.com,9876543210,1500,purchase
user456,jane@example.com,9876543211,2000,purchase
user789,bob@example.com,9876543212,500,refund`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="sample_transaction_format.csv"');
        res.send(csvContent);
      } else {
        res.status(404).json({ message: "File format not found" });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Create a new program
  app.post("/api/programs", async (req: Request, res: Response) => {
    try {
      const { name, purpose, inputType, expiryDays, minimumOrderValue, fileFormatId } = req.body;
      
      if (!name || !purpose || !inputType || !expiryDays) {
        return res.status(400).json({ 
          message: "Program name, purpose, input type, and expiry days are required" 
        });
      }
      
      // Generate program ID with iprog_ prefix
      const id = `iprog_${generateId()}`;
      
      const program = await storage.createProgram({
        id,
        name,
        purpose,
        inputType,
        expiryDays,
        minimumOrderValue: minimumOrderValue || null,
        fileFormatId: fileFormatId || null,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      res.status(201).json(program);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Get a specific program
  app.get("/api/programs/:id", async (req: Request, res: Response) => {
    try {
      const program = await storage.getProgram(req.params.id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Update a program
  app.put("/api/programs/:id", async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const program = await storage.updateProgram(req.params.id, updates);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Delete a program
  app.delete("/api/programs/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteProgram(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Wallet API routes
  
  // Get all wallets
  app.get("/api/wallets", async (req: Request, res: Response) => {
    try {
      const wallets = await storage.getAllWallets();
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Get wallet transactions by wallet ID
  app.get("/api/wallets/:walletId/transactions", async (req: Request, res: Response) => {
    try {
      const { walletId } = req.params;
      
      // Get wallet to find the partner user ID
      const wallet = await storage.getWallet(walletId);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }

      // Get all transactions (customer records) for this user
      const transactions = await storage.getUserTransactions(wallet.partnerUserId);
      
      // Get all campaigns to add campaign names
      const campaigns = await storage.getAllCampaigns();
      const campaignMap = new Map(campaigns.map(c => [c.id, c]));

      // Transform to include campaign names and format for frontend
      const formattedTransactions = transactions.map(transaction => ({
        id: transaction.id,
        campaignId: transaction.campaignId,
        campaignName: campaignMap.get(transaction.campaignId)?.name || 'Unknown Campaign',
        amount: Number(transaction.amount) || 0,
        loadId: transaction.loadId || transaction.partnerUserId || 'N/A',
        createdAt: new Date().toISOString(), // Use current time as we don't store transaction dates
        type: 'credit' as const
      }));

      res.json(formattedTransactions);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Get wallets by campaign
  app.get("/api/campaigns/:id/wallets", async (req: Request, res: Response) => {
    try {
      const campaignId = req.params.id;
      const wallets = await storage.getWalletsByCampaign(campaignId);
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // Authentication routes
  
  // Logout endpoint
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      // Clear all session data by clearing the storage
      storage.clearAllData();
      
      // Destroy session if using express-session
      if ((req as any).session) {
        (req as any).session.destroy((err: any) => {
          if (err) {
            console.error('Session destruction error:', err);
          }
        });
      }
      
      // Clear session cookie
      res.clearCookie('connect.sid');
      
      res.json({ 
        success: true, 
        message: "Logged out successfully. All session data cleared." 
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

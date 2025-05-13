import { 
  users, 
  campaigns, 
  burnRules, 
  customers, 
  type User, 
  type InsertUser, 
  type Campaign, 
  type BurnRule, 
  type Customer 
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createCampaign(campaign: Campaign): Promise<Campaign>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  getAllCampaigns(): Promise<Campaign[]>;
  
  createBurnRules(burnRule: Omit<BurnRule, "id">): Promise<BurnRule>;
  getBurnRulesByCampaign(campaignId: string): Promise<BurnRule | undefined>;
  
  createCustomer(customer: Omit<Customer, "id" | "processed">): Promise<Customer>;
  getCustomersByCampaign(campaignId: string): Promise<Customer[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaignsMap: Map<string, Campaign>;
  private burnRulesMap: Map<string, BurnRule>;
  private customersMap: Map<number, Customer>;
  
  private currentUserId: number;
  private currentBurnRuleId: number;
  private currentCustomerId: number;

  constructor() {
    this.users = new Map();
    this.campaignsMap = new Map();
    this.burnRulesMap = new Map();
    this.customersMap = new Map();
    
    this.currentUserId = 1;
    this.currentBurnRuleId = 1;
    this.currentCustomerId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createCampaign(campaign: Campaign): Promise<Campaign> {
    this.campaignsMap.set(campaign.id, campaign);
    return campaign;
  }
  
  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaignsMap.get(id);
  }
  
  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaignsMap.values());
  }
  
  async createBurnRules(burnRule: Omit<BurnRule, "id">): Promise<BurnRule> {
    const id = this.currentBurnRuleId++;
    const newBurnRule: BurnRule = { ...burnRule, id };
    this.burnRulesMap.set(burnRule.campaignId, newBurnRule);
    return newBurnRule;
  }
  
  async getBurnRulesByCampaign(campaignId: string): Promise<BurnRule | undefined> {
    return this.burnRulesMap.get(campaignId);
  }
  
  async createCustomer(customer: Omit<Customer, "id" | "processed">): Promise<Customer> {
    const id = this.currentCustomerId++;
    const newCustomer: Customer = { ...customer, id, processed: false };
    this.customersMap.set(id, newCustomer);
    return newCustomer;
  }
  
  async getCustomersByCampaign(campaignId: string): Promise<Customer[]> {
    return Array.from(this.customersMap.values()).filter(
      (customer) => customer.campaignId === campaignId
    );
  }
}

export const storage = new MemStorage();

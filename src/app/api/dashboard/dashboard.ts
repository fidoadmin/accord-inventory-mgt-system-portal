import { DashboardDataInterface } from "@/types/DashboardInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const fetchDashboard = async (): Promise<DashboardDataInterface> => {
  const dashboardData: DashboardDataInterface = {
    CheckInOverview: [
      { CategoryName: "Asahi", CategoryQuantity: 20 },
      { CategoryName: "Bertin", CategoryQuantity: 25 },
      { CategoryName: "CarlZaiss", CategoryQuantity: 30 },
      { CategoryName: "Construction Wip", CategoryQuantity: 30 },
      { CategoryName: "Lab Medical Equipment", CategoryQuantity: 30 },
      { CategoryName: "Lab Part Mindray", CategoryQuantity: 30 },
    ],
    CheckoutOverview: {
      CheckoutTypes: [
        { CheckoutType: "ExternalTransfer", CheckoutCount: 5 },
        { CheckoutType: "BranchTransfer", CheckoutCount: 10 },
      ],
      CheckoutStatus: [
        { CheckoutStatus: "Cancelled", CheckoutCount: 5 },
        { CheckoutStatus: "Onhold", CheckoutCount: 11 },
        { CheckoutStatus: "Dispatched", CheckoutCount: 10 },
      ],
    },
    ProductDetails: [
      {
        InventoryStatus: "Already Expired",
        InventoryCount: 20,
      },
      {
        InventoryStatus: "Expiring Soon",
        InventoryCount: 15,
      },
      {
        InventoryStatus: "Total Stock",
        InventoryCount: 50,
      },
      {
        InventoryStatus: "Stock Destroyed",
        InventoryCount: 15,
      },
      {
        InventoryStatus: "Out of Stock",
        InventoryCount: 20,
      },
    ],
    CategoryChart: [
      { CategoryName: "Asahi", CategoryNameCount: 10 },
      { CategoryName: "Bertin", CategoryNameCount: 15 },
      { CategoryName: "CarlZaiss", CategoryNameCount: 20 },
      { CategoryName: "Lab1", CategoryNameCount: 25 },
      { CategoryName: "LabPart", CategoryNameCount: 30 },
      { CategoryName: "Lab", CategoryNameCount: 35 },
      { CategoryName: "Meighou", CategoryNameCount: 40 },
      { CategoryName: "Olyompus", CategoryNameCount: 45 },
      { CategoryName: "Philips", CategoryNameCount: 50 },
      { CategoryName: "Schiller", CategoryNameCount: 55 },
      { CategoryName: "Service", CategoryNameCount: 60 },
      { CategoryName: "Sorin", CategoryNameCount: 65 },
      { CategoryName: "System", CategoryNameCount: 70 },
    ],
  };

  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }

  const response = await fetch(`${baseURL}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard list");
  }

  return dashboardData;
};

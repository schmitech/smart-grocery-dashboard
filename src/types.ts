export interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  price: number;
  expiryDate?: string;
  salesVelocity: number;
  predictedDemand: number;
  reorderPoint: number;
  wastageRisk: 'low' | 'medium' | 'high';
}

export interface DemandForecast {
  date: string;
  predicted: number;
  actual?: number;
}

export interface CategoryInsight {
  category: string;
  totalStock: number;
  averageDemand: number;
  wastageRisk: number;
}
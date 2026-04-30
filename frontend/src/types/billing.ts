export interface BillingSummary {
  currentMonthTotal: number;
  projectedMonthEnd: number;
  vsLastMonthPercent: number; // e.g. 5.2 means 5.2% higher, -2.1 means 2.1% lower
}

export interface BillingServiceCost {
  service: string;
  cost: number;
  color: string;
}

export interface BillingDailySpend {
  date: string;
  cost: number;
}

export interface BillingSkuCost {
  id: string;
  service: string;
  sku: string;
  cost: number;
  percentOfTotal: number;
}

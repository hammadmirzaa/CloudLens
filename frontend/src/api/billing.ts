import type { BillingSummary, BillingServiceCost, BillingDailySpend, BillingSkuCost } from '../types/billing';

export const fetchBillingSummary = async (): Promise<BillingSummary> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    currentMonthTotal: 4250.75,
    projectedMonthEnd: 6100.00,
    vsLastMonthPercent: 12.4, // Over budget basically
  };
};

export const fetchBillingByService = async (): Promise<BillingServiceCost[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { service: 'Compute Engine', cost: 1850.50, color: '#3b82f6' },
    { service: 'Cloud SQL', cost: 1200.25, color: '#10b981' },
    { service: 'Google Kubernetes Engine', cost: 850.00, color: '#f59e0b' },
    { service: 'Cloud Run', cost: 250.00, color: '#8b5cf6' },
    { service: 'Cloud Storage', cost: 100.00, color: '#ec4899' },
  ];
};

export const fetchBillingDailySpend = async (): Promise<BillingDailySpend[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const data: BillingDailySpend[] = [];
  let currentSpend = 120;
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    currentSpend = currentSpend + (Math.random() * 40 - 15);
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      cost: Math.max(50, currentSpend),
    });
  }
  return data;
};

export const fetchBillingSkus = async (): Promise<BillingSkuCost[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const total = 4250.75;
  return [
    { id: 'sku-1', service: 'Compute Engine', sku: 'N2 Standard Ram running in Americas', cost: 1200.00, percentOfTotal: (1200/total)*100 },
    { id: 'sku-2', service: 'Compute Engine', sku: 'N2 Standard Core running in Americas', cost: 650.50, percentOfTotal: (650.5/total)*100 },
    { id: 'sku-3', service: 'Cloud SQL', sku: 'PostgreSQL DB RAM in Americas', cost: 800.00, percentOfTotal: (800/total)*100 },
    { id: 'sku-4', service: 'Cloud SQL', sku: 'PostgreSQL DB Core in Americas', cost: 400.25, percentOfTotal: (400.25/total)*100 },
    { id: 'sku-5', service: 'GKE', sku: 'Cluster Management Fee', cost: 850.00, percentOfTotal: (850/total)*100 },
    { id: 'sku-6', service: 'Cloud Run', sku: 'CPU Allocation Time', cost: 250.00, percentOfTotal: (250/total)*100 },
    { id: 'sku-7', service: 'Cloud Storage', sku: 'Standard Storage US Regional', cost: 100.00, percentOfTotal: (100/total)*100 },
  ].sort((a, b) => b.cost - a.cost);
};

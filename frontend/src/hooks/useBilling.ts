import { useQuery } from '@tanstack/react-query';
import { fetchBillingSummary, fetchBillingByService, fetchBillingDailySpend, fetchBillingSkus } from '../api/billing';
import type { BillingSummary, BillingServiceCost, BillingDailySpend, BillingSkuCost } from '../types/billing';

export const useBillingSummary = () => {
  return useQuery<BillingSummary, Error>({
    queryKey: ['billingSummary'],
    queryFn: fetchBillingSummary,
  });
};

export const useBillingByService = () => {
  return useQuery<BillingServiceCost[], Error>({
    queryKey: ['billingByService'],
    queryFn: fetchBillingByService,
  });
};

export const useBillingDailySpend = () => {
  return useQuery<BillingDailySpend[], Error>({
    queryKey: ['billingDailySpend'],
    queryFn: fetchBillingDailySpend,
  });
};

export const useBillingSkus = () => {
  return useQuery<BillingSkuCost[], Error>({
    queryKey: ['billingSkus'],
    queryFn: fetchBillingSkus,
  });
};

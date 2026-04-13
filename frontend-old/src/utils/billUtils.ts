import { Bill } from "../features/billing/billingSlice";
/**
 * Filters bills by billing ID and date.
 * @param bills - Array of bills
 * @param searchId - Search string for billing_id
 * @param searchDate - Search string for date (YYYY-MM-DD)
 * @returns Filtered bills
 */
export const filterBills = (
  bills: Bill[],
  searchId: string,
  searchDate: string
): Bill[] => {
  return bills.filter((bill: Bill) => {
    const matchesId = searchId ? bill.billing_id.includes(searchId) : true;
    const matchesDate = searchDate ? bill.date.startsWith(searchDate) : true;
    return matchesId && matchesDate;
  });
};

export const filterCompleteBills = (
  bills: Bill[],
  searchId: string,
  searchDate: string
): Bill[] => {
  return bills.filter((bill: Bill) => {
    // ✅ Match complete ID instead of partial
    const matchesId = searchId ? bill.billing_id === searchId : true;

    // ✅ Date still supports prefix match (YYYY-MM-DD)
    const matchesDate = searchDate ? bill.date.startsWith(searchDate) : true;

    return matchesId && matchesDate;
  });
};


import { AppDispatch } from "../store";
import { Bill, deleteBill, updateBill } from "../features/billing/billingSlice";

/**
 * Common delete handler
 */
export const handleDelete = async (
  dispatch: AppDispatch,
  billing_id: string,
  onSuccess?: () => void
) => {
  await dispatch(deleteBill(billing_id));
  if (onSuccess) onSuccess();
};

/**
 * Common save handler
 */
export const handleSave = async (
  dispatch: AppDispatch,
  billing_id: string,
  updates: Partial<Bill>,
  onSuccess?: () => void
) => {
  await dispatch(updateBill({ billing_id, updates }));
  if (onSuccess) onSuccess();
};


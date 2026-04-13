import { Investment } from "../features/auth/addInvestmentSlice";


type SortOrder = "asc" | "desc" | null;

export const sortedDataMethod = (
  filteredData: Investment[],
  sortOrder: SortOrder
): Investment[] => {
  if (!sortOrder) {
    // No sorting requested, return as-is
    return filteredData;
  }

  return [...filteredData].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
};
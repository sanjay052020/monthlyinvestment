// utils/formatAmount.ts
export const formatAmount = (amount: number | string): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) {
    return "0.00"; // fallback if invalid input
  }

  return num.toFixed(2); // ✅ always two decimal places
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Month names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const formatIndianAmount = (amount: number | string): string => {
  if (amount === null || amount === undefined) return "";

  const num = Number(amount);

  // Split integer and decimal parts
  let [integerPart, decimalPart] = num.toFixed(2).split(".");

  // Format integer part in Indian style (e.g., 1,03,450)
  let lastThree = integerPart.slice(-3);
  let otherNumbers = integerPart.slice(0, -3);

  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }

  const formattedInteger =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  // Combine with decimal part
  const formattedNumber = decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  // Add rupee symbol
  return `₹${formattedNumber}`;
};

export const rupeesIndianAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(amount);
};




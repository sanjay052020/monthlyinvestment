export const calculateTotalAmount = (
  amount: number,
  interestRate: number,
  months: number
): number => {
  if (isNaN(amount) || isNaN(interestRate) || isNaN(months)) {
    throw new Error("Invalid input: amount, interestRate, and months must be numbers");
  }

  // simple interest calculation
  const interestAmount = (amount * interestRate * months) / 100;
  const totalAmount = amount + interestAmount;

  return totalAmount; // ✅ return just the number
};

export const calculateInterestAmount = (
  amount: number,
  interestRate: number,
  months: number
): number => {
  if (isNaN(amount) || isNaN(interestRate) || isNaN(months)) {
    throw new Error("Invalid input: amount, interestRate, and months must be numbers");
  }

  // simple interest calculation
  const interestAmount = (amount * interestRate * months) / 100;

  return interestAmount; // ✅ return only interest
};


export interface Payment {
  id: string;
  amount: number;
  date: string;       // ISO string
  source: string;
}

export interface Loan {
  id?: string;
  borrower_id: string;
  borrower_name: string;
  amount: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  status: string;
  payments: Payment[];
  total_amount?: number;
  months?: number;
  mobile: string;
}

export interface LoanUpdate {
  amount?: number;
  interest_rate?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  payments?: Payment[];
}

export interface LoanSelection {
  id: string;              // required
  borrower_id: string;
  borrower_name: string;
  amount: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  status: string;
  payments: Payment[];
  total_amount?: number;
  months?: number;
  mobile: string;
}




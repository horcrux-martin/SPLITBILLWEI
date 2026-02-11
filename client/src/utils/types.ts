export type Item = {
  name: string;
  price: number;
  assignedTo?: string[];
};

export type ScanResult = {
  items: Item[];
  detectedTotal: number | null;
  rawText: string;
  confidence: "high" | "medium" | "low";
  errorMessage?: string;
};

export type BillState = {
  friends: string[];
  payer: string;
  mode: "assign" | "equal";
  items: Item[];
};

export type TransferLine = {
  from: string;
  to: string;
  amount: number;
};

export type BillResult = {
  transfers: TransferLine[];
  total: number;
  funMessage: string;
  copyText: string;
};

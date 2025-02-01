export type Currency = "usd" | "inr" | "gbp" | "eur"

export interface LineItem {
    name: string;
    description: string;
    amount: number;
    currency: Currency;
    quantity: number;
}
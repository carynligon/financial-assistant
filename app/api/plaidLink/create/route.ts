import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Account filtering isn't required here, but sometimes
  // it's helpful to see an example.

  const tokenRequest = {
    user: {
      client_user_id: "user-id",
      phone_number: "+1 415 5550123",
    },
    client_name: "Personal Finance App",
    client_id: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    products: ["transactions"],
    transactions: {
      days_requested: 730,
    },
    country_codes: ["US"],
    language: "en",
    redirect_uri: "http://localhost:3000/expenses/link-bank",
    account_filters: {
      depository: {
        account_subtypes: ["checking", "savings"],
      },
      credit: {
        account_subtypes: ["credit card"],
      },
    },
  };
  try {
    const resp = await fetch("https://sandbox.plaid.com/link/token/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tokenRequest),
    });
    const data = await resp.json();

    return NextResponse.json({
      token: data.link_token,
    });
  } catch (error) {
    console.error("Failed to create plaid link token:", error);
    return NextResponse.json(
      { error: "Failed to create plaid link token expense" },
      { status: 500 },
    );
  }
}

"use client";

import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function ExpensesPage() {
  const [plaidToken, setPlaidToken] = useState<string | null>(null);

  const { open, ready } = usePlaidLink({
    token: plaidToken,
    onSuccess: (public_token, metadata) => {
      // send public_token to server
    },
  });

  useEffect(() => {
    const getLinkToken = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/plaidLink/create`,
        { method: "POST" },
      );
      const data = await response.json();
      setPlaidToken(data.token);
    };

    getLinkToken();
  }, []);

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}>
        link bank account
      </button>
    </div>
  );
}

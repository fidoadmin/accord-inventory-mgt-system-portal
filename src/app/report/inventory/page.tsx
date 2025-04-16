"use client";

import React, { useEffect, useState } from "react";
import AllInventory from "@/app/inventory/all/page";
import { getCookie } from "cookies-next";

const ReportPage = () => {
  const [authKey, setAuthKey] = useState<string | null>(null);

  useEffect(() => {
    const authKey = getCookie("authKey") as string;

    setAuthKey(authKey);
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Inventory Report</h1>
      <AllInventory />
    </main>
  );
};

export default ReportPage;

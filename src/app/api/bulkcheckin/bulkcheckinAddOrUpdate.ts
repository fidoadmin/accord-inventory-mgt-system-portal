import { BulkCheckinInterface } from "@/types/BulkCheckin";
import { getCookie } from "cookies-next";

import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addOrUpdateBulkCheckin = async (
  BulkCheckinData: BulkCheckinInterface
): Promise<boolean> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    toast.error("No authKey found");
    return false;
  }

  try {
    const response = await fetch(`${baseURL}/inventories/bulkscan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AuthKey: authKey,
      },
      body: JSON.stringify(BulkCheckinData),
    });

    if (!response.ok) {
      const errorText = await response.json();
      toast.error(errorText.error);
      return false;
    }

    await response.json();
    return true;
  } catch (error) {
    toast.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    return false;
  }
};

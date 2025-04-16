import {
  BarcodeRequestInterface,
  BarcodeResponseInterface,
} from "@/types/BarcodeInterface";
import { ErrorResponse } from "@/types/ErrorInterface";
import { getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const barcodes = async (
  Data: BarcodeRequestInterface
): Promise<BarcodeResponseInterface> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No authKey found");
  }
  const response = await fetch(`${baseURL}/barcodes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
      AuthKey: authKey,
    },
    body: JSON.stringify(Data),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();

    throw new Error(errorData.error);
  }

  return response.json();
};

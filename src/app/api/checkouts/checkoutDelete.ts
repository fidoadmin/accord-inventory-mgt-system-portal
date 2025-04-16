import { DeleteCheckoutDetailInterface } from "@/types/CheckoutInterface";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteCheckoutDetails = async (
  data: DeleteCheckoutDetailInterface
): Promise<Response> => {
  const { CheckoutInventoryDescriptionId, AuthKey } = data;

  const response = await fetch(
    `${baseURL}/checkoutinventorydescriptions/${CheckoutInventoryDescriptionId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        AuthKey: AuthKey || "",
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.json();
    toast.error(errorText.error);
    throw new Error(
      `Failed to delete items(status:${response.status}):${errorText}`
    );
  } else {
    toast.success("Items Deleted Successfully");
  }

  return response;
};

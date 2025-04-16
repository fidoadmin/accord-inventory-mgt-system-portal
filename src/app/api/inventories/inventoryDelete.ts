import { deleteInventoryInterface } from "@/types/InventoryInterface";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const deleteInventory = async (
  data: deleteInventoryInterface
): Promise<void> => {
  const response = await fetch(`${baseURL}/inventories/${data.Id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      AuthKey: data.AuthKey || "",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete inventory");
  }
};

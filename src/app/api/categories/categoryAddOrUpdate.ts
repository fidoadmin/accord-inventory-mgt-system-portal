import { AddOrUpdateCategoryInterface } from "@/types/CategoryInterface";

export const addOrUpdateInventory = async (
  category: AddOrUpdateCategoryInterface,
  authKey?: string
): Promise<{ upsertCategory: string }> => {
  const response = await fetch("/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey || "",
    },
    body: JSON.stringify({ Category: category }),
  });

  if (!response.ok) {
    throw new Error("Failed to add or update category");
  }

  return response.json();
};

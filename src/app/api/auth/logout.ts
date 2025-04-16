import { deleteCookie, getCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const logout = async (): Promise<void> => {
  const authKey = getCookie("authKey") as string;

  if (!authKey) {
    throw new Error("No auth key found");
  }

  const response = await fetch(`${baseURL}/logout`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      AuthKey: authKey,
      origin: "http://localhost:3000",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }

  deleteCookie("authKey");

  localStorage.removeItem("userId");
  localStorage.removeItem("firstName");
  localStorage.removeItem("lastName");
  localStorage.removeItem("EmailAddress");
  localStorage.removeItem("ClientName");
  localStorage.removeItem("menuItems");
  localStorage.removeItem("RoleCode");
  localStorage.removeItem("IsVerified");
};

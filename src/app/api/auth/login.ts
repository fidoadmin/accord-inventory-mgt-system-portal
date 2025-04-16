import { LoginRequest, LoginResponse } from "@/types/AuthInterface";
import { ErrorResponse } from "@/types/ErrorInterface";
import { setCookie } from "cookies-next";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (Data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${baseURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: "http://localhost:3000",
    },
    body: JSON.stringify(Data),
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json();
    throw new Error(errorData.error);
  }

  const responseData = await response.json();

  setCookie("authKey", responseData.AuthKey, { path: "/" });
  localStorage.setItem("userId", responseData.UserId);
  localStorage.setItem("firstName", responseData.FirstName);
  localStorage.setItem("lastName", responseData.LastName);
  localStorage.setItem("EmailAddress", responseData.EmailAddress);
  localStorage.setItem("ClientName", responseData.ClientName);
  localStorage.setItem("RoleCode", responseData.RoleCode);
  localStorage.setItem("IsVerified", responseData.IsVerified);
  if (responseData.MenuItems) {
    localStorage.setItem("menuItems", JSON.stringify(responseData.MenuItems));
  }
  return responseData;
};

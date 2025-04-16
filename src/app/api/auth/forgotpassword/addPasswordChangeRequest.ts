const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const addPasswordChangeRequest = async (Emailaddress: string) => {
  const response = await fetch(`${baseURL}/resetpassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ EmailAddress: Emailaddress }),
  });

  if (response.status != 200) {
    const data = await response.json();
    alert(data.error);
    return data;
  }

  const data = await response.json();
  return data;
};

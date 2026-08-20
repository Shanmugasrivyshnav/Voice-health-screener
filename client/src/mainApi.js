const API_URL = "https://voice-health-screener-s8c8.onrender.com";

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/api/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const createUser = async (user) => {
  const response = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

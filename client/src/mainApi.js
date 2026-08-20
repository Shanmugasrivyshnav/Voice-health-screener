export const getUsers = async () => {
  const response = await fetch(
    "https://voice-health-screener-s8c8.onrender.com/api/users",
  );
  // http://localhost:5000
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const createUser = async (user) => {
  const response = await fetch(
    "https://voice-health-screener-s8c8.onrender.com/api/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

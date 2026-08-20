export const getUsers = async () => {
  const response = await fetch("http://localhost:5000/api/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

export const createUser = async (user) => {
  const response = await fetch("http://localhost:5000/api/users", {
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

const API_URL = `${import.meta.env.VITE_API_URL}/plants`;

const getToken = () => {
  return localStorage.getItem("token");
};

export const getMyPlants = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Please login again.");
  }

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch plants."
    );
  }

  return data;
};

export const getPlant = async (id) => {
  const token = getToken();

  if (!token) {
    throw new Error("Please login again.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch plant."
    );
  }

  return data;
};

export const deletePlant = async (id) => {
  const token = getToken();

  if (!token) {
    throw new Error("Please login again.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete plant."
    );
  }

  return data;
};
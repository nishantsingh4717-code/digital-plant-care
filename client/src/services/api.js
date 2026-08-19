

const API_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  "http://localhost:5000/api";

export default API_URL;
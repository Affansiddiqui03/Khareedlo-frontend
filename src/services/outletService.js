import api from "./api";

export const searchOutlets = async (q) => {
  const res = await api.get(`/outlets/search?q=${q}`);
  return res.data;
};

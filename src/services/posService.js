import API from "../config/api";

export const syncPOS = async (provider, apiKey) => {
  const res = await API.post("/pos/sync", {
    provider,
    apiKey,
  });
  return res.data;
};

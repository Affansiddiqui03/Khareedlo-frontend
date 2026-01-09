import API from "../config/api";

export const addToWishlist = async (productId) => {
  const res = await API.post("/wishlist/add", { productId });
  return res.data;
};

export const getWishlist = async () => {
  const res = await API.get("/wishlist");
  return res.data;
};

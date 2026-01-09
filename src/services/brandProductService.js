import API from "../config/api";

export const createProduct = async (data) => {
  const res = await API.post("/brand/products", data);
  return res.data;
};

export const updateProduct = async (id, data) => {
  const res = await API.put(`/brand/products/${id}`, data);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await API.delete(`/brand/products/${id}`);
  return res.data;
};

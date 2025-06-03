import axios from "axios";

const API_URL = "http://localhost:5000/api/payment";

export const requestPayment = async (amount) => {
  const res = await axios.post(`${API_URL}/request`, { amount });
  return res.data;
};

export const verifyPayment = async (authority, amount) => {
  const res = await axios.post(`${API_URL}/verify`, { authority, amount });
  return res.data;
};
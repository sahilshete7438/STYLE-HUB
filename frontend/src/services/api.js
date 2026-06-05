import axios from "axios";

const API_URL = "http://localhost:8080/products";

export const getMenProducts = () =>
  axios.get(`${API_URL}/men`);

export const getWomenProducts = () =>
  axios.get(`${API_URL}/women`);

export const getKidsProducts = () =>
  axios.get(`${API_URL}/kids`);
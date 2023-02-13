import axios from "axios";

const instance = axios.create({
  baseURL: "http://52.3.242.76/api"
});

export default instance;

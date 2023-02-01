import axios from "axios";

const instance = axios.create({
  baseURL: "http://52.91.115.250/api"
});

export default instance;

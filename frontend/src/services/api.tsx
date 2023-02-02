import axios from "axios";

const instance = axios.create({
  baseURL: "/http://34.224.5.24/api"
});

export default instance;

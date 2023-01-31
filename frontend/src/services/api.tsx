import axios from "axios";

const instance = axios.create({
  baseURL: "http://54.173.233.48/api"
});

export default instance;

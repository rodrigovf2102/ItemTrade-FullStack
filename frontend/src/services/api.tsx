import axios from "axios";

const instance = axios.create({
  baseURL: "http://YOUR-IP-HERE/api"
});

export default instance;

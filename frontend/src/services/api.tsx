import axios from "axios";

const instance = axios.create({
  baseURL: "http://34.203.201.225/api"
});

export default instance;

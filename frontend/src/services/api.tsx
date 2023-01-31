import axios from "axios";

const instance = axios.create({
  baseURL: "http://54.159.22.175/api"
});

export default instance;

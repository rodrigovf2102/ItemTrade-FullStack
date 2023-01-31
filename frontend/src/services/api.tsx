import axios from "axios";

const instance = axios.create({
  baseURL: "http://54.237.3.205/api"
});

export default instance;

import axios from "axios";

const request = axios.create({
  // 配置接口请求的基准路径
  baseURL: "http://localhost:8081/admin",
});
// 响应拦截器
request.interceptors.response.use(
  (response:any) => {
    if (response.status == 200) {
      return response.data;
    } else {
      return response;
    }
  },
  function (error:any) {
    return Promise.reject(error);
  }
);
export default request;


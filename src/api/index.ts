import axios from "axios";

const request = axios.create({
  // ���ýӿ�����Ļ�׼·��
  baseURL: "http://localhost:8081/admin",
});
// ��Ӧ������
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


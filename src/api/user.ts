import request from ".";

export const getUser = (data:any) => {
  return request.get('/shp/user');
};
export const updateShpUser = (data:any) => {
  return request.put('/shp/updateUser', data);
};

export const deleteUser = (id:number) => {
  // 构建请求 URL
  const url = `/shp/deleteUser/${id}`;
  // 发送 DELETE 请求
  return request.delete(url);
};
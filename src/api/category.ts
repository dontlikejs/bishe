import request from ".";

export const getCategory = () => {
  return request.get('/shp/category');
};
export const updateCategory = (data:any) => {
  return request.put('/shp/updateCategory', data);
};

export const deleteCategory = (id:number) => {
  // 构建请求 URL
  const url = `/shp/deleteCategory/${id}`;
  // 发送 DELETE 请求
  return request.delete(url);
};
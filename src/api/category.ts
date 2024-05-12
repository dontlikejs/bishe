import request from ".";

export const getCategory = () => {
  return request.get('/shp/category');
};
export const updateCategory = (data:any) => {
  return request.put('/shp/updateCategory', data);
};

export const deleteCategory = (id:number) => {
  // �������� URL
  const url = `/shp/deleteCategory/${id}`;
  // ���� DELETE ����
  return request.delete(url);
};
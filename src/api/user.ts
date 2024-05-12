import request from ".";

export const getUser = (data:any) => {
  return request.get('/shp/user');
};
export const updateShpUser = (data:any) => {
  return request.put('/shp/updateUser', data);
};

export const deleteUser = (id:number) => {
  // �������� URL
  const url = `/shp/deleteUser/${id}`;
  // ���� DELETE ����
  return request.delete(url);
};
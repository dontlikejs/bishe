import request from ".";

export const getShp = (params:any) => {
  return request.get(`/shp/${params.id}?dm=${params.dm}`);
};

export const updateShp = (data:any) => {
  return request.put('/shp/update', data);
};

export const getKfq = (data:any) => {
  return request.get('/shp/kfq');
};

export const searchKfq = (keyword: string) => {
  return request.get('/shp/searchKfq', {
    params: { keyword: keyword },
  });
};

export const deleteKfq = (djdtbbh: number, kfqdm: string) => {
  // �������� URL
  const url = `/shp/deleteKfq/${djdtbbh}/${kfqdm}`;
  // ���� DELETE ����
  return request.delete(url);
};
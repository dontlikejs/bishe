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
  // 构建请求 URL
  const url = `/shp/deleteKfq/${djdtbbh}/${kfqdm}`;
  // 发送 DELETE 请求
  return request.delete(url);
};
/*
 * @Author: Meng Tian
 * @Date: 2021-11-09 21:05:51
 * @Description: Do not edit
 */
import request from '@/utils/request';

// 样例:修改样本入组时间
export async function PreProcess(body: any) {
  console.log('body', body);
  return request('http://10.17.38.226:80/preHandleCt', {
    method: 'GET',
    data: body.uuid,
  });
}

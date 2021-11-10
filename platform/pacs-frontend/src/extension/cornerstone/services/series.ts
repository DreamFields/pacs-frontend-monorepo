/*
 * @Author: linkenzone
 * @Date: 2021-06-01 14:59:46
 * @Descripttion: Do not edit
 */
import request from '../utils/request';

export async function FetchSeries({ series }: { series: string }) {
  return request(`/series/${series}`, {
    method: 'GET',
  });
}

export async function FetchInstances({ series }: { series: string }) {
  return request(`/series/${series}/instances`, {
    method: 'GET',
  });
}

// @ts-ignore
/* eslint-disable */
import request from '@/utils/request';

/** adduser POST /v1/user/add */
export async function adduserUsingPOST(
  params: {
    // query
    id?: number;
    name?: string;
    pwd?: string;
  },
  options?: { [key: string]: any },
) {
  return request<string>('/v1/user/add', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** delete POST /v1/user/delete */
export async function deleteUsingPOST(
  params: {
    // query
    /** id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<string>('/v1/user/delete', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** querybyid POST /v1/user/getById */
export async function querybyidUsingPOST(
  params: {
    // query
    /** id */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.User>('/v1/user/getById', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** queryUserList GET /v1/user/getlist */
export async function queryUserListUsingGET(options?: { [key: string]: any }) {
  return request<API.User[]>('/v1/user/getlist', {
    method: 'GET',
    ...(options || {}),
  });
}

/** update POST /v1/user/update */
export async function updateUsingPOST(
  params: {
    // query
    id?: number;
    name?: string;
    pwd?: string;
  },
  options?: { [key: string]: any },
) {
  return request<string>('/v1/user/update', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

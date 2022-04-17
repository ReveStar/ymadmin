import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token, account_id) {
  return request({
    url: '/user/info',
    method: 'get',
    headers: { 'X-Token': token },
    params: {
      account_id
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getAll() {
  return request({
    url: '/account/all',
    method: 'get'
  })
}

export function updateAccount(data) {
  return request(
    {
      url: '/account/update',
      method: 'post',
      data
    }
  )
}

export function createAccount(data) {
  return request({
    url: '/account/add',
    method: 'post',
    data
  })
}

export function deleteAccount(data) {
  return request({
    url: '/account/delete',
    method: 'post',
    data
  })
}

export function searchAccount(data) {
  return request({
    url: 'user/info',
    method: 'get',
    params: data
  })
}

export function getStudents() {
  return request({
    url: 'account/students',
    method: 'get'
  })
}

export function getTeachers() {
  return request({
    url: 'account/teachers',
    method: 'get'
  })
}

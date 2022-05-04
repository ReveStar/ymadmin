import request from '@/utils/request'

export function fetchOrderList() {
  return request({
    url: '/order/info',
    method: 'get'
  })
}

export function searchOrder(data) {
  return request({
    url: '/order/info',
    method: 'get',
    params: data
  })
}

export function updateOrder(data) {
  return request({
    url: '/order/update',
    method: 'post',
    data
  })
}

export function deleteOrder(data) {
  return request({
    url: '/order/delete',
    method: 'post',
    data
  })
}

export function createOrder(data) {
  return request({
    url: '/order/add',
    method: 'post',
    data
  })
}

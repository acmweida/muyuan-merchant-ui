import request from '@/utils/request'

export function getShop() {
  return request({
    url: '/store-system/user/getUserInfo',
    method: 'get'
  })
}

export function createShop(data) {
  return request({
    url: '/store-shop/shop/create',
    method: 'post',
    data: data
  })
}

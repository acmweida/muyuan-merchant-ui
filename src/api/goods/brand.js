import request from '@/utils/request'

// 查询品牌列表
export function listBrand(query) {
  return request({
    url: '/api/product/brand/list',
    method: 'get',
    params: query
  })
}

// 选项品牌
/**
 * categoryCode 必须传
 * @param query
 */
export function options(query) {
  return request({
    url: '/api/product/brand/options',
    method: 'get',
    params: query
  })
}

// 查询品牌分类列表
export function listCategory(id) {
  return request({
    url: '/api/product/brand/category/'+id,
    method: 'get',
  })
}

// 查询品牌详细
export function getBrand(id) {
  return request({
    url: '/api/product/brand/' + id,
    method: 'get'
  })
}

// 新增品牌
export function addBrand(data) {
  return request({
    url: '/api/product/brand',
    method: 'post',
    data: data
  })
}

// 新增品牌
export function linkCategory(data) {
  return request({
    url: '/api/product/brand/category',
    method: 'put',
    data: data
  })
}

// 修改品牌
export function updateBrand(data) {
  return request({
    url: '/api/product/brand',
    method: 'put',
    data: data
  })
}

// 删除品牌
export function delBrand(id) {
  return request({
    url: '/api/product/brand/' + id,
    method: 'delete'
  })
}

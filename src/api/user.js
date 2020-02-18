import request from '@/utils/request'
const querystring = require('querystring')
export function login(data) {
  return request({
    // baseURL: 'http://127.0.0.1:8081',
    // url: '/a1/user/loginpw',
    url: '/user/login',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: querystring.stringify({
      userName: data.userName,
      password: data.password
    })
  })
}

export function getInfo(token) {
  return request({
    url: '/a1/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/a1/user/logout',
    method: 'post'
  })
}
export function yzlogin(data) {
  return request({
    url: '/user/verification',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: querystring.stringify({
      mobile: data.mobile
    })
  })
}
export function resetLogin(data) {
  return request({
    url: '/user/reset',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: querystring.stringify({
      mobile: data.mobile,
      code: data.code,
      password: data.password
    })
  })
}

import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const userName = 'login-user'

const userId = 'login-id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, 10000)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserName() {
  return localStorage.getItem(userName)
}

export function setUserName(name) {
  return localStorage.setItem(userName, name)
}

export function removeUserName() {
  return localStorage.removeItem(userName)
}

export function getUserId() {
  return localStorage.getItem(userId)
}

export function setUserId(id) {
  return localStorage.setItem(userId, id)
}

export function removeUserId() {
  return localStorage.removeItem(userId)
}

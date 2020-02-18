import { login } from '@/api/user'
import { getToken, setToken, removeToken, setUserName, getUserName, getUserId, setUserId } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '@/store'
const state = {
  token: getToken(),
  name: getUserName(),
  avatar: '',
  introduction: '',
  roles: [],
  treeShow: false, // 隧道树的显隐
  treeData: [], // 隧道树的数据
  userId: getUserId(),
  baseUrl: 'http://119.23.213.192:8010',
  baseWebsoket: '119.23.213.192:8010'
  // http://33.64.67.130:97 生产
  // http://119.23.213.192:8010 阿里云
  // http://10.1.4.7:8081大增有限
  // http://10.1.101.126:8081大增无线
  // http://10.1.4.119:8081付秀
  // http://10.1.4.87:8081陈帅
  // http://10.1.4.92:8081徐艳辉
  // http://10.1.4.86:8081杨旭
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_TREESHOW: (state, treeShow) => {
    state.treeShow = treeShow
  },
  SET_TREEDATA: (state, treeData) => {
    state.treeData = treeData
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  allDatas: (state, ids) => {
    state.allData = ids
  }
}

const actions = {
  // 隧道树是否展示
  showTree({ commit }, show) {
    commit('SET_TREESHOW', show)
  },
  // 隧道树的数据
  initTreeData({ commit }, treeData) {
    commit('SET_TREEDATA', treeData)
  },

  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), password: password.trim() }).then(response => {
        const { data } = response
        // 将改变的状态提交给mutations，如果直接改变的话就没办法监听数据响应式的变化了
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.userName)
        commit('SET_USERID', data.userId)
        setToken(data.token)
        setUserName(data.userName)
        setUserId(data.userId)
        // 将状态由待处理改变为已处理，若不执行会一直停留在prepareding
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   const { roles, name, avatar, introduction } = data

      //   // roles must be a non-empty array
      //   if (!roles || roles.length <= 0) {
      //     reject('getInfo: roles must be a non-null array!')
      //   }

      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', introduction)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })

      const data = {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin',
        userId: ''
      }
      const { roles, avatar, introduction } = data

      commit('SET_ROLES', roles)
      commit('SET_NAME', this.state.user.name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      commit('SET_USERID', this.state.user.userId)
      store.commit('dashord/allDatas', JSON.parse(sessionStorage.getItem('allData')))
      // console.log(store.state.dashord.allData)
      resolve(data)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   commit('SET_ROLES', [])
      //   removeToken()
      //   resetRouter()
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

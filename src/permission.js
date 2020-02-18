import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getTunnelTree } from '@/api/tunnelTree'
// import { getDivide } from '@/api/dashboard'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // debugger
  // getDivide().then(res => {
  //   debugger
  //   if (res.code === 10003) {
  //     next(false)
  //     location.href = 'login.html'
  //   } else {
  //     console.log('111')
  //   }
  // })
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (to.path === '/forgetPassword' && from.path === '/login') {
    next()
    NProgress.done()
  } else {
    if (hasToken||true) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        // determine whether the user has obtained his permission roles through getInfo
        const hasRoles = store.getters.roles && store.getters.roles.length > 0
        if (hasRoles) {
          if (to.path !== '/tunnelControl/tunnelTree') {
            if (document.getElementsByClassName('tree-div')[0]) {
              document.getElementsByClassName('tree-div')[0].style.display = 'none'
            }
            next()
          } else {
            if (Object.keys(to.query).length > 0) { // 点击隧道树跳转的路由
              next()
            } else { // 点击导航栏跳转的路由
              // if (document.getElementsByClassName('tree-div')[0].style.display === 'block') {
              //   document.getElementsByClassName('tree-div')[0].style.display = 'none'
              // } else {
              //   document.getElementsByClassName('tree-div')[0].style.display = 'block'
              // }
              if (store.getters.treeShow) {
                document.getElementsByClassName('tree-div')[0].style.display = 'none'
                store.dispatch('user/showTree', false)
              } else {
                getTunnelTree().then(res => {
                  if (res.success) {
                    store.dispatch('user/initTreeData', res.data)
                  } else {
                    if (res.code === 10010 || res.code === 20006) {
                      Message({
                        showClose: true,
                        message: res.data,
                        type: 'error'
                      })
                    } else {
                      Message({
                        showClose: true,
                        message: '查询隧道树失败',
                        type: 'error'
                      })
                    }
                  }
                }).catch(() => {})
                document.getElementsByClassName('tree-div')[0].style.display = 'block'
                store.dispatch('user/showTree', true)
              }
            }
          }
          // next()
          NProgress.done()
        } else {
          try {
            // get user info
            // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
            const { roles } = await store.dispatch('user/getInfo')

            // generate accessible routes map based on roles
            const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            // hack method to ensure that addRoutes is complete
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
          } catch (error) {
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* has no token*/

      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

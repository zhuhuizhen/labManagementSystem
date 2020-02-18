/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const manageControlRouter = {
  path: '/systemManagement',
  component: Layout,
  redirect: '/systemManagement/UserManagement/OrganManage',
  name: 'systemManagement',
  meta: { title: '系统管理', icon: 'iconxitongguanli' },
  children: [
    {
      path: 'userManagement',
      component: () => import('@/views/systemManagement/UserManagement'),
      meta: { title: '公共管理', icon: 'icon111' },
      name: 'UserManagement',
      redirect: '/systemManagement/UserManagement/OrganManage',
      children: [
        {
          path: 'organManage',
          component: () => import('@/views/systemManagement/UserManagement/OrganManage/view.vue'),
          meta: { title: '组织管理', icon: 'icon111' },
          name: 'OrganManage'
        },
        {
          path: 'areaManage',
          component: () => import('@/views/systemManagement/UserManagement/AreaManage/view.vue'),
          meta: { title: '区域管理', icon: 'icon111' },
          name: 'AreaManage'
        },
        {
          path: 'roleManage',
          component: () => import('@/views/systemManagement/UserManagement/RoleManage/RoleManage.vue'),
          meta: { title: '角色管理', icon: 'icon111' },
          name: 'RoleManage'
        },
        {
          path: 'personManage',
          component: () => import('@/views/systemManagement/UserManagement/PersonManage/PersonManage.vue'),
          meta: { title: '人员管理', icon: 'icon111' },
          name: 'PersonManage'
        },
        {
          path: 'regionManage',
          component: () => import('@/views/systemManagement/UserManagement/RegionManage/RegionManage.vue'),
          meta: { title: '数据域管理', icon: 'icon111' },
          name: 'RegionManage'
        },
        {
          path: 'groupManage',
          component: () => import('@/views/systemManagement/UserManagement/GroupManage/view.vue'),
          meta: { title: '班组管理', icon: 'icon111' },
          name: 'GroupManage'
        }
      ]
    },
    {
      path: 'SystemSet',
      component: () => import('@/views/systemManagement/SystemSet'),
      meta: { title: '系统设置', icon: 'icon111' },
      name: 'SystemSet',
      redirect: '/systemManagement/SystemSet/DictionaryS',
      children: [
        {
          path: 'DictionaryS',
          component: () => import('@/views/systemManagement/SystemSet/DictionaryS/view.vue'),
          meta: { title: '字典库', icon: 'icon111' },
          name: 'DictionaryS'
        }
      ]
    }
  ]

  // children: [
  //   {
  //     path: 'OrganManage',
  //     component: () => import('@/views/systemManagement/UserManagement/OrganManage/view.vue'),
  //     meta: { title: '组织管理', noCache: true }
  //   },
  //   {
  //     path: 'PersonManage',
  //     component: () => import('@/views/systemManagement/UserManagement/PersonManage/PersonManage.vue'),
  //     meta: { title: '人员管理', noCache: true }
  //   }
  // ]

}

export default manageControlRouter

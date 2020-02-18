// 模拟 用户管理 —— 用户部门数据
import Mock from 'mockjs'

const template = {
  msg: 'SUCCESS',
  success: true,
  code: 0,
  data: {
    code: '',
    id: '-1',
    name: '用户部门',
    parent_id: '',
    remark: '用户所属部门管理',
    children: [
      {
        code: '11',
        id: '13be789a617b4963b052e26fb7adfee7',
        name: '办公室',
        parent_id: '',
        remark: ''
      },
      {
        code: '1000',
        id: '8e62191829cc4f93adcb7eae241ebcbc',
        name: '低压电器',
        parent_id: '',
        remark: ''
      }
    ]
  }
}

const DepartmentsList = Mock.mock(template)

// const count = 2

// for (let i = 0; i < count; i++) {
//   DepartmentsList.push(
//     Mock.mock({
//       name: '@first'
//     })
//   )
// }
// DepartmentsList.push({ name: 'mock-Pan' })

export default [
  {
    url: '/getDepartmentsList',
    type: 'get',
    response: _ => {
      return {
        DepartmentsList
      }
      // const { name } = config.query
      // const mockNameList = DepartmentsList.filter(item => {
      //   const lowerCaseName = item.name.toLowerCase()
      //   return !(name && lowerCaseName.indexOf(name.toLowerCase()) < 0)
      // })
      // return {
      //   code: 20000,
      //   data: { items: mockNameList }
      // }
    }
  }
]

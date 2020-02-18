<template>
  <div class="UserRegion-add">
    <p class="bkb" />
    <el-tabs v-model="activeName">
      <!--新建数据域基本信息 :disabled="disabled"-->
      <el-tab-pane label="基本信息" name="first" class="Basic-add" :disabled="disabled">
        <div>
          <el-form ref="addForm" :model="addForm" label-width="90px" :rules="addFormRules" class="adduser">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="编号:" prop="code">
                  <el-input v-model="addForm.code" placeholder="请输入编号" />
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                  <el-input v-model="addForm.name" placeholder="请输入名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="描述:" prop="description">
                  <el-input v-model="addForm.description" type="textarea" placeholder="请输入备注" style="width:515px;margin-left:0px;margin-top:0px;height:70px" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="dialog-footer">
            <el-button size="small" class="button-sub" @click.native="submitManageForm('addForm')">下一步</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!--组织选择-->
      <el-tab-pane label="组织选择" name="second" :disabled="disabled">
        <div class="userManageMent">
          <el-row>
            <!--树结构-->
            <el-col :span="8">
              <div class="tree-div">
                <div class="inline-div">
                  <el-tree
                    ref="tree"
                    :data="dataTree"
                    node-key="id"
                    default-expand-all
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    show-checkbox
                    @node-click="handleNodeClick"
                    @check="checkClick"
                  >
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                      <span v-if="data.children">
                        <i class="iconfont iconzuzhi" />{{ data.name }}
                      </span>
                      <span v-else>
                        <i class="iconfont iconbumen" />{{ data.name }}
                      </span>
                    </span>
                  </el-tree>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="dialog-footer">
            <el-button size="small" class="button-sub" @click.native="submitUserForm">下一步</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!--人员选择-->
      <el-tab-pane label="人员选择" name="third" :disabled="disabled">
        <div>
          <div class="button-tool" style="margin-bottom:5px;float:left">
            <el-button icon="iconfont iconxinzeng" size="small" @click="handleAdd">新增</el-button>
            <el-button icon="iconfont iconshanchu" size="small" @click="handleDel">批量删除</el-button>
          </div>
          <div>
            <el-table ref="multipleTable" height="375" :data="tableDataUser" @selection-change="handleSelcRegionChange">
              <el-table-column type="selection" width="60" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="userCode" label="工号" />
              <el-table-column prop="name" label="用户名" />
            </el-table>
          </div>
          <div class="dialog-footer">
            <el-button size="small" class="button-sub" @click.native="submitForm">完成</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { addRegion, getRegionOrgTree, searchRegion } from '@/api/userManagement.js'
export default {
  props: {
    regionId: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      disabled: true, // tabs是否禁用
      activeName: 'first', // tabs默认显示第一个用户基本信息
      addForm: { name: '', code: '', description: '' },
      addFormRules: {
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      tableDataRole: [], // 角色table数据
      dataTree: [], // 组织tree数据
      tableDataUser: [], // 数据域人员选择table数据
      userDataList: [], // 父级传过来的选中要添加的数据
      totalCount: 0, // 人员选择table总条数
      pageSize: 5, // 人员选择table每页几条数据
      pageNumber: 1, // 人员选择table第几页
      currentPage: 1, // 人员选择table直接跳转到第几页
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      formRegion: {
        name: '' // 人员名
      },
      multipleTable: [], // 选择table表格的一条或多条数据
      userIdList: [], // 数据域中人员删除
      treeAllData: {}, // 点击的tree树的data数据
      istreetrue: [], // 判断tree树是否选中
      manageIds: [], // 数据域中组织树新增数组
      manageParentId: '', // 数据域中组织树新增传参父级管理中心
      manageId: '', // 数据域中组织树新增传参管理中心
      deptId: '', // 数据域中组织树新增传部门
      unitId: '', // 数据域中组织树新增传单位
      groupId: '' // 数据域中组织树新增传班组
    }
  },
  watch: {
    tableData(oldVlaue, newValue) {
    }
  },
  methods: {
    // 数据域基本信息下一步  根据数据域ID查询所拥有的组织树接口  1
    submitManageForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 新建数据域接口
          searchRegion({ sysRegion: { code: this.addForm.code, name: this.addForm.name }}).then(res => {
            if (res.success === true) {
              this.activeName = 'second'
              this.$emit('refRegionList')
            } else {
              this.$message.error(res.msg)
            }
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
      // 根据数据域ID查询所拥有的组织树接口
      const paratree = {
        regionId: ''
      }
      getRegionOrgTree(paratree).then(response => {
        if (response.success === true) {
          this.dataTree = response.data
          this.dataTree.map(value1 => {
            value1.biaoji = value1.orgType // 1
            if (value1.children.length !== 0) {
              value1.show = true
              value1.children.map(value2 => {
                // if (value2.children) {
                value2.show = true
                value1.biaoji = value2.orgType
                value2.biaoji = '0'
                if (value2.children.length !== 0) {
                  value2.show = true
                  value2.children.map(value3 => {
                    value2.biaoji = value3.orgType // 2
                    value3.biaoji = value3.orgType
                    if (value3.children.length !== 0) {
                      // value1.isDel = false // 根据孙子给爷爷判断是否可以删   //根据value3.children去判断value1是否可删，
                      value3.show = true
                      value3.children.map(value4 => {
                        value3.biaoji = value4.orgType
                        value4.biaoji = value4.orgType
                        if (value4.children.length !== 0) {
                          // value2.isDel = false // 根据value4.children去判断value2是否可删，
                          value4.show = true
                          value4.children.map(value5 => {
                            value4.biaoji = value5.orgType
                            value5.biaoji = value5.orgType
                            if (value5.children.length !== 0) {
                              // value3.isDel = false // 根据value5.children去判断value3是否可删，
                              value5.show = true
                              // value5.children.map(value6 => {
                              //   value5.biaoji = value6.orgType
                              //   value6.biaoji = value6.orgType
                              // })
                            } else {
                              value5.show = false
                            }
                          })
                        } else {
                          value4.show = true
                        }
                      })
                    } else {
                      value3.show = true
                    }
                  })
                } else {
                  value2.show = true
                }
              })
            } else {
              value1.show = true
            }
          })
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 组织下一步 数据域组织树选择关系新增  根据数据域ID查询用户--用户选择
    // 数据域管理-根据数据域ID查询用户 用户选择函数----调用
    getRegionList() {},
    submitUserForm() { // 第二步
      // 数据域组织树新增
      if (this.istreetrue.length === 0) {
        this.$message.error('请选择数据域组织关系数据')
      } else {
        this.activeName = 'third'
        // 数据域管理-根据数据域ID查询用户 用户选择
        this.getRegionList()
      }
    },
    // 点击tree树
    handleNodeClick(dataTree) {
      // console.log('tag', dataTree.biaoji)
    },
    // 点击tree树
    checkClick(dataTree) {
      this.istreetrue = this.$refs.tree
        .getCheckedNodes()
        .concat(this.$refs.tree.getHalfCheckedNodes())
      const manageparentidArr = [] // 标记为0的节点
      const manageidArr = [] // 标记为1的节点
      const deptid2 = [] // 标记为2、type有值的节点（父节点）
      const deptid3 = [] // 标记为3、type有值的节点（父节点）
      const currentData = [] // 标记为2和3并且type为""的节点  【子节点的集合】
      const arr = [
        ...this.$refs.tree
          .getCheckedNodes()
          .concat(this.$refs.tree.getHalfCheckedNodes())
      ] // 合并tree所有的节点
      // console.log(arr, 22222222222222)
      const submitData = []

      // 挑出层级关系
      arr.map(value => {
        // 杭新景高速管理中心
        if (value.biaoji === '0') {
          manageparentidArr.push(value)
        }
        // 建德分中心、测试中心
        if (value.biaoji === '1' && value.type === '') {
          manageidArr.push(value)
        }
        // 施工部和养护部
        if (value.type !== '' && value.type !== '0') {
          // alue.biaoji === "2" &&
          deptid2.push(value)
        }
        // 监控中心
        if (value.type === '0') {
          // alue.biaoji === "3" &&
          deptid3.push(value)
        }
        // 最子级的内容
        if (
          (value.biaoji === '2' && value.type === '') ||
          (value.biaoji === '3' && value.type === '')
        ) {
          currentData.push(value)
        }
      })
      // console.log(manageparentidArr, "00000");
      // console.log(manageidArr, 111);
      // console.log(deptid2, 222);
      // console.log(deptid3, 333);
      // console.log(currentData, "currentData");
      // 存在最子级选中的话，过滤数据，拼接数组
      currentData.map(value => {
        const obj = {}
        if (value.biaoji === '2') {
          obj.unitId = value.id
        }
        if (value.biaoji === '3') {
          obj.groupId = value.id
        }
        // 找到对应的biaoji为1的那级的id
        manageidArr.map(item1 => {
          if (
            item1.children !== '' &&
            item1.children !== null &&
            item1.children.length !== 0
          ) {
            // console.log(item1, 999999999999)
            item1.children.map(value1 => {
              if (
                value1.children !== '' &&
                value1.children !== null &&
                value1.children.length !== 0
              ) {
                value1.children.map(value2 => {
                  if (value2.id === value.id) {
                    obj.manageId = item1.id
                  }
                })
              }
            })
          }
        })
        deptid2.map(item => {
          if (
            item.children !== '' &&
            item.children !== null &&
            item.children.length !== 0
          ) {
            item.children.map(value1 => {
              if (value1.id === value.id) {
                obj.deptId = item.id
              }
            })
          }
        })
        deptid3.map(item => {
          if (
            item.children !== '' &&
            item.children !== null &&
            item.children.length !== 0
          ) {
            item.children.map(value1 => {
              if (value1.id === value.id) {
                obj.deptId = item.id
              }
            })
          }
        })
        obj.regionId = this.regionId
        manageparentidArr.map(item1 => {
          if (
            item1.children !== '' &&
            item1.children !== null &&
            item1.children.length !== 0
          ) {
            item1.children.map(value1 => {
              if (
                value1.children !== '' &&
                value1.children !== null &&
                value1.children.length !== 0
              ) {
                value1.children.map(value2 => {
                  if (
                    value2.children !== '' &&
                    value2.children !== null &&
                    value2.children.length !== 0
                  ) {
                    value2.children.map(value3 => {
                      if (value3.id === value.id) {
                        obj.manageParentId = item1.id
                      }
                    })
                  }
                })
              }
            })
          }
        })
        submitData.push(obj)
      })
      const asyncData = {}
      asyncData.regionId = this.regionId
      asyncData.sysRegionOrganizations = submitData
      // 高速管理中心没有子节点的情况
      manageparentidArr.map(value => {
        if (
          value.children === '' ||
          value.children.length === 0 ||
          value.children === null
        ) {
          const aa = {}
          aa.manageParentId = value.id
          aa.regionId = this.regionId
          asyncData.sysRegionOrganizations.push(aa)
        }
      })

      // 建德分中心、测试中心判断是否有子节点的情况【没有子节点】
      manageidArr.map(value => {
        if (
          value.children === '' ||
          value.children.length === 0 ||
          value.children === null
        ) {
          const aa = {}
          aa.manageId = value.id
          manageparentidArr.map(item1 => {
            if (
              item1.children !== '' &&
              item1.children !== null &&
              item1.children.length !== 0
            ) {
              item1.children.map(item2 => {
                if (item2.id === value.id) {
                  aa.manageParentId = item1.id
                }
              })
            }
          })
          aa.regionId = this.regionId
          asyncData.sysRegionOrganizations.push(aa)
        }
      })

      // 施工部、养护部没有子节点的情况
      deptid2.map(value => {
        if (
          value.children === '' ||
          value.children.length === 0 ||
          value.children === null
        ) {
          const aa = {}
          aa.deptId = value.id
          aa.regionId = this.regionId
          manageparentidArr.map(item1 => {
            if (
              item1.children !== '' &&
              item1.children !== null &&
              item1.children.length !== 0
            ) {
              item1.children.map(value1 => {
                if (
                  value1.children !== '' &&
                  value1.children !== null &&
                  value1.children.length !== 0
                ) {
                  value1.children.map(value2 => {
                    if (value2.id === value.id) {
                      aa.manageParentId = item1.id
                    }
                  })
                }
              })
            }
          })
          // aa.manageParentId = manageparentidArr[0].id;
          manageidArr.map(item1 => {
            item1.children.map(item2 => {
              if (item2.id === value.id) {
                aa.manageId = item1.id
              }
            })
          })
          asyncData.sysRegionOrganizations.push(aa)
        }
      })

      // 监控中心没有字节点的情况
      deptid3.map(value => {
        if (
          value.children === '' ||
          value.children.length === 0 ||
          value.children === null
        ) {
          const aa = {}
          aa.deptId = value.id
          aa.regionId = this.regionId
          manageparentidArr.map(item1 => {
            if (
              item1.children !== '' &&
              item1.children !== null &&
              item1.children.length !== 0
            ) {
              item1.children.map(value1 => {
                if (
                  value1.children !== '' &&
                  value1.children !== null &&
                  value1.children.length !== 0
                ) {
                  value1.children.map(value2 => {
                    if (value2.id === value.id) {
                      aa.manageParentId = item1.id
                    }
                  })
                }
              })
            }
          })
          manageidArr.map(item1 => {
            item1.children.map(item2 => {
              if (item2.id === value.id) {
                aa.manageId = item1.id
              }
            })
          })
          asyncData.sysRegionOrganizations.push(aa)
        }
      })
      // console.log(submitData, 77777777)
      this.treeAllData = asyncData
    },
    // 根据数据域ID查询用户 查询
    handleSelectUser() {
      this.getRegionList()
    },
    // 获取人员信息
    getUserListData(data) {
      this.userDataList = data
      var selectedUsersId = []
      if (this.tableDataUser) {
        this.tableDataUser.map(user => {
          selectedUsersId.push(user.id)
        })
      }
      if (data) {
        data.map(item => {
          if (selectedUsersId.indexOf(item.id) === -1) {
            this.tableDataUser.push(item)
          }
        })
      }
    },
    // 数据域-人员新增
    handleAdd() {
      this.$emit('Add2click')
    },
    // 批量删除
    handleDel() {
      if (this.userIdList.length === 0) {
        this.$message.error('请至少选择一条数据')
      } else {
        this.tableDataUser = this.tableDataUser.filter(item => {
          if (this.userIdList.indexOf(item.id) === -1) {
            return item
          }
        })
      }
    },
    // 完成  第三步   3
    submitForm() {
      var param = {}
      param.sysRegion = this.addForm
      var data = JSON.parse(JSON.stringify(this.treeAllData.sysRegionOrganizations))
      if (data.length > 0) {
        data.map(item => {
          item.regionId = undefined
        })
      }
      param.sysRegionOrganizations = data
      var ids = []
      this.tableDataUser.map(item => {
        ids.push(item.id)
      })
      param.userIdList = ids
      addRegion(param).then(res => {
        if (res.success === true) {
          this.$message.success('新建成功')
          this.$emit('closeAdd')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(e => {})
    },
    // 数据域-人员  选择table表格事件
    handleSelcRegionChange(val) {
      this.multipleTable = val
      this.userIdList = []
      this.multipleTable.map(value => {
        this.userIdList.push(value.id)
      })
    },
    // 数据域---人员选择 分页
    handleSizeRegion(val) {},
    // 数据域---人员选择 点击到第几页
    handleCurrentRegion(val) {
      this.pageNumber = val
      this.getRegionList()
    },
    // 数据域---人员选择 直接跳转到第几页
    handleJumperRegion(currentPage) {}
  }
}
</script>

<style lang="scss">
.UserRegion-add{
  .adduser{
    .el-input__inner {
      // cursor: pointer;
      height: 34px;
      width: 166px;
    }
    margin-left:28px;
    height: 420px;
  }

  .el-tabs.el-tabs--top{
    margin-top: -10px;
  }
  .el-tab-pane{
    padding:0 20px !important;
    // >div{
    //   height:460px;
    // }
  }
  .el-tabs__nav-wrap{
      padding-left: 20px;
      margin-top: 10px;
  }
  .el-tabs__item{
      font-size: 14px!important;
      &:hover{
          color:#00eeee;
      }
  }
  .el-tabs__nav-wrap::after{
      background-color:rgba(83,227,253,.4)!important;
  }
  .el-tabs__item{
      color:#fff;
  }
  .el-tabs__item.is-active{
      color:#00eeee;
  }
  .el-tabs__active-bar{
      background-color:#00eeee!important;
  }
  .el-badge__content{
      padding: 0 4px;
      line-height: 14px;
  }
  .dialog-footer{
    text-align: center;
    margin-top:10px;
  }
   //input框间隔
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__error{
    top:76%;
  }
  .el-form-item.is-success .el-input__inner{
    border-color: #00eeee;
  }
  .el-textarea.el-input--medium .el-textarea__inner {
      height: 80px;
      font-size: 12px;
  }
  .el-table{
    border-radius: 5px;
    border: 1px solid #00eeee;
    .cell{
          border-bottom:1px solid #00eeee
        }
    .el-table th>.cell{
      border: none
    }
  }
  //  input::-webkit-input-placeholder {
  //     opacity: 0.5;
  //   }
  //   textarea::-webkit-input-placeholder {
  //     opacity: 0.5;
  //   }
}
</style>
<style lang="scss" scoped>
@import "@/styles/userManageMent.scss";
</style>


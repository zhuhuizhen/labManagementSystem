<template>
  <div class="origanmanage">
    <el-row>
      <!--树结构-->
      <el-col :span="3">
        <div class="tree-div">
          <div class="inline-div">
            <el-tree
              ref="tree"
              :data="data"
              node-key="id"
              default-expand-all
              :props="defaultProps"
              :highlight-current="true"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              @filter-node-method="filterNode"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span v-if="data.children">
                  <i class="iconfont iconzuzhi" />{{ data.name }}
                </span>
                <span v-else style="paddingLeft:16px;">
                  <i class="iconfont iconbumen" />{{ data.name }}
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <!--表格-->
      <el-col :span="21">
        <el-row>
          <el-col :span="24">
            <div class="title-content">
              <span v-if="manageCodeShow" style="margin-left:40px;margin-right:60px;"><span style="padding-right:10px;">班组编号:</span>{{ manageCode }}</span>
              <span style="margin-right:100px;margin-left:40px;"><span style="padding-right:10px;">班组名称:</span>{{ manageName }}</span>
              <span><span style="padding-right:10px;">描述:</span>{{ manageRemark }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="contener">
              <tableWatch v-if="tablewatch" :orgtype="orgtype" :show="show" :table-date="tableDate" :total-num="totalNum" :tree-name="treeName" :tree-id="treeId" @handleGetTree="handleGetTree" @handleGetTableData="handleGetTableData" @getTableDataOnlyone="getTableData1" />
              <tableUnit v-if="tableunit" :orgtype="orgtype" :show="show" :table-date="tableDate" :total-num="totalNum" :tree-name="treeName" :tree-id="treeId" @handleGetTree="handleGetTree" @handleGetTableData="handleGetTableData" @getTableDataOnlyone="getTableData1" />
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getOrgTree,
  getListSelect,
  getorgSelectOne
} from '@/api/userManagement.js'
// import tableManageParent from './components/tab/table.vue'
// import tableManage from './components/tab1/table.vue'
// import tableCenter from './components/tab2/table.vue'
import tableWatch from './components/tab3/table.vue'
import tableUnit from './components/tab4/table.vue'
export default {
  name: '',
  components: { tableWatch, tableUnit },
  data() {
    return {
      manageCode: '', // 组织编号
      manageName: '', // 组织名称
      manageRemark: '', // 描述
      manageCodeShow: true, // 组织编号是否显示
      // tableManageParent: true, // 组织管理下父级管理中心是否显示
      // tablemanage: false, // 组织管理下的子节点管理中心table是否显示
      // tablecenter: false, // 管理中心下的所有部门是否显示
      tablewatch: false, // 监控中心是否显示
      tableunit: false, // 外联是否显示,
      orgtype: '', // 区分是否是最后一级
      data: [], // tree树
      currentNodekey: '', // 默认高亮修改
      expandedkeys: [], // 默认高亮修改
      id: '', // 获取tree树的id
      selectTree: {}, // 获取点击tree树的的整个对象数据
      type: '', // 点击tree传参type
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableDate: [],
      treeName: '', // 上级管理中心名称
      // treeName3: '', // 三四级的上级管理中心是一个管理中心
      treeId: '', // 上级管理中心id
      param: {}, // 所有接口传参
      show: true,
      totalNum: 0,
      pageSize: 10,
      pageNumber: 1
      // selectData: {} // 点击tree树获取整个节点对象
      // isDel: true // 最初默认标识可以删除
    }
  },
  mounted() {
    // 获取tree树
    this.getTreeData()
  },
  methods: {
    // 获取tree树数据
    getTreeData() {
      getOrgTree().then(response => {
        if (response.code === 0) {
          this.data = response.data
          console.log('data', this.data)
          // 默认显示组织管理高亮
          if (this.data.length !== 0) {
            this.currentNodekey = this.data[0].id
            this.expandedkeys.push(this.data[0].id)
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.currentNodekey)
            })
          }
          // this.manageCode = this.data[0].code
          // this.manageName = this.data[0].name
          // this.manageRemark = this.data[0].remark
          this.data.map(value1 => {
            value1.biaoji = value1.orgType // 1
            if (value1.children.length !== 0) {
              value1.show = true
              value1.children.map(value2 => {
                // if (value2.children) {
                value2.show = true
                value1.biaoji = value2.orgType
                // value2.biaoji = value2.orgType
                value2.biaoji = '0'
                if (value2.children.length !== 0) {
                  value2.show = true
                  value2.children.map(value3 => {
                    value2.biaoji = value3.orgType // 2
                    value3.biaoji = value3.orgType
                    if (value3.children.length !== 0) {
                      value3.show = true
                      value3.children.map(value4 => {
                        value3.biaoji = value4.orgType
                        value4.biaoji = value4.orgType
                        value4.treeName = value4.name
                        value4.treeId = value4.id
                        if (value4.children.length !== 0) {
                          value4.show = true
                          value4.children.map(value5 => {
                            value4.biaoji = value5.orgType
                            value5.biaoji = value5.orgType
                            value5.treeName = value4.name
                            value5.treeId = value4.id
                            if (value5.children.length !== 0) {
                              value5.show = true
                            } else {
                              value5.show = false
                              value5.biaoji = value5.orgType
                            }
                          })
                        } else {
                          value4.show = true
                          if (value4.type === '0') {
                            value4.biaoji = '3'
                          } else {
                            value4.biaoji = '2'
                          }
                        }
                      })
                    } else {
                      value3.show = true
                      value3.biaoji = '1'
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
        }

        const param = {
          id: '1ba94e640c004b93bd221894e29dede5',
          type: 3,
          pageNumber: 1,
          pageSize: 10
        }
        this.param = param
        this.getTableData1()

        // const param = {
        //   id: this.data[0].id,
        //   type: 3,
        //   pageNumber: 1,
        //   pageSize: 10
        // }
        // this.param = param
        // this.getTableData()
      })
    },
    // 获取tree树数据(点击新增或修改会重新刷新页面  刷新tree树和table表格)
    getTreeData1() {
      getOrgTree().then(response => {
        if (response.code === 0) {
          this.data = response.data
          this.data.map(value1 => {
            value1.biaoji = value1.orgType // 1
            if (value1.children.length !== 0) {
              value1.show = true
              value1.children.map(value2 => {
                // if (value2.children) {
                value2.show = true
                value1.biaoji = value2.orgType
                // value2.biaoji = value2.orgType
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
                        value4.treeName = value4.name
                        value4.treeId = value4.id
                        if (value4.children.length !== 0) {
                          // value2.isDel = false // 根据value4.children去判断value2是否可删，
                          value4.show = true
                          value4.children.map(value5 => {
                            value4.biaoji = value5.orgType
                            value5.biaoji = value5.orgType
                            value5.treeName = value4.name
                            value5.treeId = value4.id
                            if (value5.children.length !== 0) {
                              // value3.isDel = false // 根据value5.children去判断value3是否可删，
                              value5.show = true
                            } else {
                              value5.show = false
                              value5.biaoji = value5.orgType
                            }
                          })
                        } else {
                          value4.show = true
                          if (value4.type === '0') {
                            value4.biaoji = '3'
                          } else {
                            value4.biaoji = '2'
                          }
                        }
                      })
                    } else {
                      value3.show = true
                      value3.biaoji = '1'
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
        }
        if (this.orgtype === '2' || this.orgtype === '3') {
          this.getTableData1()
        } else {
          this.getTableData()
        }
      })
    },
    // 点击tree树获取table表格的数据
    getTableData() {
      this.param.pageNumber = this.pageNumber
      this.param.pageSize = this.pageSize
      getListSelect(this.param)
        .then(response => {
          if (response.code === 0) {
            this.tableDate = response.data.response
            this.totalNum = Number(response.data.totalNum)
          } else {
            if (response.data !== '') {
              this.$message.error(response.data)
            } else {
              this.$message.error(response.msg)
            }
          }
        })
        .catch(response => {
          this.$message.error(response.message)
        })
    },
    // 点击tree树最子级单独查询的table表格-----函数调用
    getTableData1() {
      getorgSelectOne(this.param)
        .then(response => {
          if (response.code === 0) {
            if (response.data !== '') {
              const onlyone = []
              onlyone.push(response.data)
              this.tableDate = onlyone
            }
          } else {
            if (response.data !== '') {
              this.$message.error(response.data)
            } else {
              this.$message.error(response.msg)
            }
          }
        })
        .catch(response => {
          this.$message.error(response.message)
        })
    },
    handleGetTree() {
      this.getTreeData1()
    },
    // 分页掉接口
    handleGetTableData(value) {
      if (value) {
        // console.log(value)
        this.pageSize = value.pageSize
        this.pageNumber = value.pageNumber
        this.getTableData()
      }
    },
    // 点击tree树
    handleNodeClick(data) {
      this.orgtype = data.orgType
      this.selectTree = data
      // 组织编号是否显示
      if (data.orgType === '') {
        this.manageCodeShow = false
      } else {
        this.manageCodeShow = true
      }

      this.show = data.show
      if (this.orgtype === '2' || this.orgtype === '3') {
        this.treeName = data.treeName
        this.treeId = data.treeId
      } else {
        this.treeName = data.name
        this.treeId = data.id
      }

      if (
        data.orgType === '' ||
        data.orgType === '-1' ||
        data.orgType === '0'
      ) {
        this.$message('请选择班组节点')
        console.log('节点错误')
        return false
      } else {
        this.manageCode = data.code
        this.manageName = data.name
        this.manageRemark = data.remark
        switch (data.type) {
          // case '0':
          //   this.tablemanage = false
          //   this.tablecenter = false
          //   this.tablewatch = true
          //   this.tableunit = false
          //   this.tableManageParent = false
          //   break
          case '3':
            this.tablemanage = false
            this.tablecenter = false
            this.tablewatch = false
            this.tableunit = true
            this.tableManageParent = false
          // break
          // default:
          //   this.tablemanage = false
          //   this.tablecenter = false
          //   this.tablewatch = false
          //   this.tableunit = true
          //   this.tableManageParent = false
        }
        switch (data.orgType) {
          // case '-1':
          //   this.tablemanage = true
          //   this.tablecenter = false
          //   this.tablewatch = false
          //   this.tableunit = false
          //   break
          // case '0':
          //   this.tablemanage = false
          //   this.tablecenter = true
          //   this.tablewatch = false
          //   this.tableunit = false
          //   break
          case '3':
            this.tablemanage = false
            this.tablecenter = false
            this.tablewatch = true
            this.tableunit = false
          // break
          // case '':
          //   this.tablemanage = false
          //   this.tablecenter = false
          //   this.tablewatch = false
          //   this.tableunit = false
          //   this.tableManageParent = true
        }

        this.type = parseInt(data.orgType) + parseInt('1')
        this.id = data.id
        const param = {
          id: this.id,
          type: data.biaoji,
          pageNumber: 1,
          pageSize: 10
        }
        this.param = param
        if (data.orgType === '2' || data.orgType === '3') {
          // 获取table表格--点击tree树最子级和其余的不是一个接口
          // debugger
          this.getTableData1()
        } else {
          this.getTableData()
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';
.origanmanage {
  .title-content {
    margin: 1%;
    background-image: url('../../../../assets/tunnelTree/bj.png');
    background-size: 100% 100%;
    border-radius: 5px;
    border: 1px solid #50dcf5;
    height: 50px;
    color: #fff;
    padding-top: 12px;
    font-size: 14px;
  }
  .contener {
    margin-left: 1%;
    margin-right: 1%;
    background-image: url('../../../../assets/tunnelTree/bj.png');
    background-size: 100% 100%;
    border-radius: 5px;
    border: 1px solid #50dcf5;
    height: 735px;
  }
  // .el-tree .el-tree-node>.el-tree-node__children {
  //   overflow: none;
  // }
}
</style>

<style lang="scss" scoped>
.el-tree {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  min-width: 100%;
  cursor: default;
  display: inline-block !important;
}
.tree-div >>> .el-tree-node__content:hover {
  background-color: #207087;
  color: #ffffff;
}
.tree-div >>> .el-tree-node__content {
  height: 32px;
}
.tree-div /deep/ .is-current > .el-tree-node__content {
  background-color: #207087;
  color: #ffffff;
}
.tree-div {
  margin-top: 7%;
  background-image: url('../../../../assets/tunnelTree/bj.png');
  background-size: 100% 100%;
  border-radius: 5px;
  border: 1px solid #50dcf5;
  padding-top: 6px;
  height: 799px;
  width: 100%;
  // overflow-x: scroll;
  overflow: auto;
  .custom-tree-node {
    .iconfont {
      color: #00eeee;
      position: relative;
      top: 1px;
      margin-right: 6px;
    }
  }
  >>> .tunnel {
    background: url('../../../../../public/img/tunnel.png') no-repeat center
      center;
    content: '';
    display: block;
    width: 15px;
    height: 15px;
    font-size: 15px;
    background-size: 15px;
    margin: 0 10px;
  }
  >>> .el-tree > .el-tree-node.is-expanded > .el-tree-node__content::before {
    content: '';
    border-left: 1px dashed #006a78;
    height: 9px;
    width: 1px;
    position: absolute;
    left: 15px;
    top: 22px;
  }
  >>> .el-tree-node__content {
    position: relative;
    // padding-left:85px !important;
  }
  >>> .el-tree-node__children .el-tree-node__content::before {
    content: '';
    border-left: 1px dashed #006a78;
    height: 100%;
    width: 1px;
    position: absolute;
    left: 15px;
    top: -12px;
  }
  >>> .el-tree-node__children .el-tree-node__content::after {
    content: '';
    border-top: 1px dashed #006a78;
    height: 1px;
    width: 10px;
    position: absolute;
    left: 16px;
  }
  >>> .el-tree .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  >>> .el-tree .el-icon-caret-right:before {
    background: url('../../../../../public/img/jia.png') no-repeat center center;
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    font-size: 18px;
    background-size: 18px;
  }
  >>> .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    background: url('../../../../../public/img/jian.png') no-repeat center
      center;
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    font-size: 18px;
    background-size: 18px;
  }
  >>> .el-tree-node__expand-icon.is-leaf::before {
    display: none;
  }
  >>> .el-tree-node:focus > .el-tree-node__content {
    background-color: #207087;
    color: #ffffff;
  }
}
// .tree-div::-webkit-scrollbar{
//   display: none;
// }
.tree-div::-webkit-scrollbar {
  width: 2px;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.2);
}
.tree-div::-webkit-scrollbar-track {
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.2);
}
.tree-div::-webkit-scrollbar-thumb {
  border-radius: 3px;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  background-color: #25a5c0;
}
</style>

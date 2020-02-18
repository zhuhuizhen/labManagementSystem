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
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-col>
      <!--表格-->
      <el-col :span="21">
        <el-row>
          <el-col :span="24">
            <div class="title-content">
              <span v-if="manageCodeShow" style="margin-left:40px;margin-right:60px;"><span style="padding-right:10px;">组织编号:</span>{{ manageCode }}</span>
              <span style="margin-right:100px;margin-left:40px;"><span style="padding-right:10px;">组织名称:</span>{{ manageName }}</span>
              <span><span style="padding-right:10px;">描述:</span>{{ manageRemark }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="contener">
              <!-- <tableManageParent v-if="tableManageParent" :show="show" :table-date="tableDate" :total-num="totalNum" :tree-name="treeName" :tree-id="treeId" @handleGetTree="handleGetTree" @handleGetTableData="handleGetTableData" />
              <tableManage v-if="tablemanage" :show="show" :table-date="tableDate" :total-num="totalNum" :tree-name="treeName" :tree-id="treeId" @handleGetTree="handleGetTree" @handleGetTableData="handleGetTableData" />
              <tableCenter v-if="tablecenter" :show="show" :table-date="tableDate" :total-num="totalNum" :tree-name="treeName" :tree-id="treeId" :select-tree="selectTree" @handleGetTree="handleGetTree" @handleGetTableData="handleGetTableData" /> -->
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrgTree } from '@/api/userManagement.js' // 导入接口放置文件
export default {
  name: '',
  data() {
    return {
      data: [], // tree树
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      currentNodekey: '', // 默认高亮修改
      expandedkeys: [], // 默认高亮修改
      id: '', // 获取tree树的id
      selectTree: {}, // 获取点击tree树的的整个对象数据
      type: '', // 点击tree传参type
      manageCode: '', // 组织编号
      manageName: '', // 组织名称
      manageRemark: '' // 描述
    }
  },
  mounted() {
    // 获取tree树
    this.getTreeData()
  },
  methods: {
    filterNode(data, node) {
      data.map(value1 => {
        value1.biaoji = value1.orgType // 1
        if (value1.children.length !== 0) {
          value1.show = true
          value1.children.map(value2 => {
            value2.biaoji = value2.orgType // 1
            if (value2.children.length !== 0) {
              value2.show = true
              value2.children.map(value3 => {
                value3.biaoji = value3.orgType // 1
                if (value3.children.length !== 0) {
                  value3.show = false
                  value3.children.length = 0
                } else {
                  value3.show = false
                }
              })
            }
          })
        }
      })
    },
    // 获取tree树数据
    getTreeData() {
      getOrgTree().then(response => {
        if (response.code === 0) {
          this.data = response.data
          this.filterNode(this.data, this.node)
          // 默认显示组织管理高亮 id为key
          if (this.data.length !== 0) {
            this.$nextTick(() => {
              this.node = this.$refs.tree
              this.$refs.tree.setCurrentKey(this.currentNodekey)
            })
          }
          this.manageCode = this.data[0].code
          this.manageName = this.data[0].name
          this.manageRemark = this.data[0].remark
        }
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
                value2.show = true
                value1.biaoji = value2.orgType
                value2.biaoji = '0'
                if (value2.children.length !== 0) {
                  value2.show = true
                  value2.children.map(value3 => {
                    value2.biaoji = value3.orgType // 2
                    value3.biaoji = value3.orgType
                    if (value3.children.length !== 0) {
                      value3.show = false
                      value3.children.length = 0
                    } else {
                      value3.show = false
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
    handleGetTree() {
      this.getTreeData1()
    },

    // 点击tree树
    handleNodeClick(data) {
      console.log('点击节点：', data)
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

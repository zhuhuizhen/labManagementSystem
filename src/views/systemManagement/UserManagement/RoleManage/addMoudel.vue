<template>
  <div class="roleManage-addRole">
    <p class="bkb" />
    <el-tabs v-model="activeName" style="height:540px" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="baseInfo" :disabled="pane1" style="height:490px">
        <el-row class="height50">
          <el-col :span="4" class="right"><span style="color:#ff0000">* </span>角色名称 :</el-col>
          <el-col :span="20"><el-input v-model="baseInfo.name" placeholder="请输入角色名称" style="width:240px" /></el-col>
        </el-row>
        <el-row class="height50">
          <el-col :span="4" class="right"><span style="color:#ff0000">* </span>是否启用 :</el-col>
          <el-col :span="20">
            <el-select v-model="baseInfo.status" style="width:240px" popper-class="select-option">
              <el-option value="" label="请选择角色状态" />
              <el-option value="1" label="是" />
              <el-option value="0" label="否" />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="height80">
          <el-col :span="4" class="right height50">描述 :</el-col>
          <el-col :span="20">
            <el-input v-model="baseInfo.description" placeholder="请输入描述" style="margin:10px 0" :rows="2" type="textarea" />
          </el-col>
        </el-row>
        <div style="position:absolute;bottom:20px;left:50%;transform:translate(-50%)">
          <el-button class="button-sub" @click="saveBaseInfo">下一步</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="权限设置" name="roleInfo" :disabled="pane2" style="height:490px">
        <el-row>
          <el-col :span="12">
            <el-tree
              ref="menuTree"
              style="height:420px"
              :data="roleMenuTree"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="defaultProps"
            />
          </el-col>
          <el-col :span="12">
            <el-tree
              ref="btnTree"
              style="height:420px"
              :data="roleBtnTree"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="defaultProps"
            />
          </el-col>
        </el-row>
        <div style="position:absolute;bottom:20px;left:50%;transform:translate(-50%)">
          <el-button class="button-sub" @click="saveRoleInfo">下一步</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="人员信息" name="userInfo" :disabled="pane3">
        <el-row style="margin-bottom:10px">
          <div style="display:inline-block">
            <el-button class="button-sub btn" icon="iconfont iconxinzeng" @click="addNewUser">新增</el-button>
            <el-button class="button-sub btn" icon="iconfont iconshanchu" style="margin-right:5px" @click="delUsers">批量删除</el-button>
          </div>
        </el-row>
        <el-table
          ref="userTable"
          :data="userInfo"
          tooltip-effect="dark"
          height="380"
          style="width: 100%;height:300px"
          @row-click="selectUserRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="60"
          />
          <el-table-column
            type="index"
            label="序号"
            width="60"
          />
          <el-table-column
            prop="id"
            label="用户ID"
          />
          <el-table-column
            prop="name"
            label="用户名"
          />
        </el-table>
        <!-- <div class="numListJup " style="padding-bottom:42px;padding-right:70px">
          <el-pagination
            :page-size="pageSize"
            :page-sizes="[8, 20, 50, 100]"
            layout="total,sizes,prev, pager, next, jumper"
            :total="totalCount"
            :current-page.sync="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <div class="sendAllBtn">
            <span>跳转</span>
          </div>
        </div> -->
        <div style="text-align:center;margin-top:15px;">
          <el-button class="button-sub" @click="saveUserInfo">完 成</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="选择人员" append-to-body :visible.sync="addUserVisible" :before-close="handleAddNewUser" width="45%" class="addRoleUserDialog">
      <div style="height:540px">
        <p class="bkb" />
        <el-row style="margin-top:10px">
          关键字 : <el-input v-model="primaryKey" placeholder="请输入姓名或ID" style="width:200px;margin:0px 10px" />
          <el-button class="button-sub btn btn2" @click="searchNewUsers">查询</el-button>
          <el-button class="button-sub btn btn2" @click="confirmAddUsers">确认</el-button>
        </el-row>
        <el-table
          ref="userInfoTable"
          :data="userUnselectedInfo"
          tooltip-effect="dark"
          height="435"
          style="width: 100%;height:400px"
          @row-click="selectUserInfoRow"
          @selection-change="handleUnSelectionChange"
        >
          <el-table-column
            type="selection"
            width="60"
          />
          <el-table-column
            type="index"
            label="序号"
            width="60"
          />
          <el-table-column
            prop="id"
            label="用户ID"
          />
          <el-table-column
            prop="name"
            label="用户名"
          />
          <el-table-column
            prop="mobile"
            label="手机"
          />
          <el-table-column
            prop="email"
            label="邮箱"
          />
        </el-table>
        <div class="numListJup " style="padding-right:70px">
          <el-pagination
            :page-size="userPageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="total,sizes,prev, pager, next, jumper"
            :total="userTotalCount"
            :current-page.sync="selectUserPage"
            @size-change="handleUserSizeChange"
            @current-change="handleSelectUserChange"
          />
          <div class="sendAllBtn">
            <span>跳转</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveRole, getRolePermission, getRoleUsers, searchRoleUsers, saveAddRole, searchRoleName } from '@/api/roleManage'
export default {
  name: 'AddRolePage',
  data() {
    return {
      activeName: 'baseInfo',
      baseInfo: {}, // 基本信息
      defaultProps: {
        label: 'resName',
        children: 'children'
      },
      addFlag: true, // 区分新增和修改
      pane1: false,
      pane2: true,
      pane3: true,
      primaryKey: '', // 关键字
      totalCount: 50, // 表格数据总数
      userTotalCount: 0, // 未选择人数页数
      userPageSize: 10, // 选择人员每页个数
      pageSize: 8, // 每页个数
      currentPage: 1, // 当前页数
      selectUserPage: 1, // 为选择人员页数
      multipleSelection: [], // 已选用户多选列表
      unSelectMultipleSelection: [], // 未选用户多选列表
      roleMenuTree: [], // 菜单权限tree
      roleBtnTree: [], // 按钮权限tree
      userInfo: [], // 已添加人员信息
      userUnselectedInfo: [], // 未添加人员信息
      formUserInfo: {},
      addUserVisible: false
    }
  },
  methods: {
    handleClick(tab) {

    },
    // 父组件调用判断添加或者修改
    clearContent() {
      this.baseInfo = {}
    },
    // 递归遍历菜单树
    mapMenuTree(data) {
      if (data && data.length > 0) {
        data.map(item => {
          this.mapMenuTree(item)
        })
      }
      if (data.children && data.children.length > 0) {
        if (data.checked === 'true') {
          this.$refs.menuTree.setChecked(data.id, true)
        }
        return this.mapMenuTree(data.children)
      } else {
        if (data.checked === 'true') {
          this.$refs.menuTree.setChecked(data.id, true)
        }
      }
    },
    async getRoleMenuFirst() {
      await getRolePermission({ roleId: this.addFlag === false ? this.baseInfo.id : undefined, type: 'button' }).then(res => {
        if (res.success === true) {
          this.roleBtnTree = res.data
          this.$nextTick(() => {
            this.roleBtnTree.map(item => {
              this.mapBtnTree(item)
            })
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(e => {
        this.$message.error(e)
      })
      await getRolePermission({ roleId: this.addFlag === false ? this.baseInfo.id : undefined, type: 'menu' }).then(res => {
        if (res.success === true) {
          this.roleMenuTree = res.data
          this.roleMenuTree[0].checked = 'true'
          this.roleMenuTree[0].disabled = true
          this.$nextTick(() => {
            this.roleMenuTree.map(item => {
              this.mapMenuTree(item)
            })
          })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    // 遍历按钮树
    mapBtnTree(data) {
      if (data && data.length > 0) {
        data.map(item => {
          this.mapBtnTree(item)
        })
      }
      if (data.children && data.children.length > 0) {
        if (data.checked === 'true') {
          this.$refs.btnTree.setChecked(data.id, true)
        }
        return this.mapBtnTree(data.children)
      } else {
        if (data.checked === 'true') {
          this.$refs.btnTree.setChecked(data.id, true)
        }
        return
      }
    },
    addEditRoleDialog(data) {
      this.activeName = 'baseInfo'
      if (data) {
        this.addFlag = false
        this.baseInfo = data
        this.pane1 = false
        this.pane2 = false
        this.pane3 = false
        this.$emit('reset-save-flag', false)
        // 根据角色获取按钮权限
        this.getRoleMenuFirst()
        // 根据角色获取人员
        this.handleGetRoleUsers()
      } else {
        this.baseInfo = {}
        this.roleMenuTree = []
        this.roleBtnTree = []
        this.userInfo = []
        this.$emit('reset-save-flag', true)
        this.addFlag = true
        this.pane2 = true
        this.pane3 = true
      }
    },
    selectUserRow(row) {
      this.$refs.userTable.toggleRowSelection(row)
    },
    selectUserInfoRow(row) {
      this.$refs.userInfoTable.toggleRowSelection(row)
    },
    // 获取人员信息
    handleGetRoleUsers(data) {
      getRoleUsers({ pageSize: this.pageSize, active: '1', available: '1', pageNumber: this.currentPage, roleId: this.addFlag === false ? this.baseInfo.id : undefined, userName: data }).then(res => {
        if (res.success === true) {
          this.userInfo = res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    handleGetUnselectRoleUsers(data) {
      searchRoleUsers({ roleId: this.baseInfo.id, pageSize: this.userPageSize, pageNumber: this.selectUserPage, name: data }).then(res => {
        if (res.success === true) {
          this.userUnselectedInfo = res.data.rows
          this.userTotalCount = res.data.totalCount
        } else {
          this.$message.error(res.msg)
        }
      }).catch(e => {
        this.$message.error(e)
      })
    },
    // 人员信息列表
    handleCurrentChange() {
      this.handleGetRoleUsers()
    },
    // 未添加人员信息列表
    handleSelectUserChange() {
      this.handleGetUnselectRoleUsers()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.handleGetRoleUsers()
    },
    handleUserSizeChange(val) {
      this.userPageSize = val
      this.handleGetUnselectRoleUsers()
    },
    // 处理多选列表
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 处理未选多选列表
    handleUnSelectionChange(val) {
      this.unSelectMultipleSelection = val
    },
    // 关闭添加人员
    closeAddRoleUser() {
      this.addUserVisible = false
      this.handleGetRoleUsers()
    },
    // 保存角色信息--第一步
    saveBaseInfo() {
      var param = {}
      if (this.addFlag === false) {
        param.flag = '0'
        param.sysRole = {}
        param.sysRole.name = this.baseInfo.name
        param.sysRole.status = this.baseInfo.status
        param.sysRole.description = this.baseInfo.description || ''
        param.sysRole.id = this.baseInfo.id
      }
      if (this.baseInfo.name === '' || this.baseInfo.name === undefined) {
        this.$message.error('角色名称不能为空')
        return false
      }
      if (this.baseInfo.status === '' || this.baseInfo.status === undefined) {
        this.$message.error('角色状态不能为空')
        return false
      }
      if (this.addFlag === false) {
        saveRole(param).then(res => {
          if (res.success === true) {
            this.activeName = 'roleInfo'
            this.$message.success('修改成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        searchRoleName({ sysRole: { name: this.baseInfo.name }}).then(res => {
          if (res.success === false) {
            this.$message.error(res.msg)
            return false
          } else {
            this.activeName = 'roleInfo'
            this.getRoleMenuFirst()
          }
        })
      }
    },
    // 保存或修改角色信息--第二步
    saveRoleInfo() {
      if (this.addFlag === false) {
        var menuKeys = this.$refs.menuTree.getCheckedKeys().concat(this.$refs.menuTree.getHalfCheckedKeys())
        var btnKeys = this.$refs.btnTree.getCheckedKeys().concat(this.$refs.btnTree.getHalfCheckedKeys())
        var resourcesList = menuKeys.concat(btnKeys)
        saveRole({ flag: '1', sysRole: { id: this.baseInfo.id }, resourcesList }).then(res => {
          if (res.success === true) {
            this.activeName = 'userInfo'
            this.$message.success('保存成功')
            this.handleGetRoleUsers()
            this.$emit('reset-save-flag', false)
          } else {
            this.$message.error(res.msg)
          }
        }).catch(e => {})
      } else {
        this.activeName = 'userInfo'
      }
    },
    // 关闭弹窗
    saveUserInfo() {
      var param = {}
      if (this.addFlag === false) {
        param.flag = '2'
        param.sysRole = {}
        param.sysRole.id = this.baseInfo.id
        param.userIdList = []
        if (this.userInfo) {
          this.userInfo.map(user => {
            param.userIdList.push(user.id)
          })
        }
        saveRole(param).then(res => {
          if (res.success === true) {
            this.$message.success('保存成功')
            this.$emit('closeAddRole')
          } else {
            this.$message.error(res.msg)
          }
        }).catch(e => {})
      } else {
        var menuKeys = this.$refs.menuTree.getCheckedKeys().concat(this.$refs.menuTree.getHalfCheckedKeys())
        var btnKeys = this.$refs.btnTree.getCheckedKeys().concat(this.$refs.btnTree.getHalfCheckedKeys())
        var resourcesList = menuKeys.concat(btnKeys)
        param.sysRole = {
          name: this.baseInfo.name,
          description: this.baseInfo.description || '',
          status: this.baseInfo.status
        }
        param.userIdList = []
        if (this.userInfo) {
          this.userInfo.map(user => {
            param.userIdList.push(user.id)
          })
        }
        param.resourcesList = resourcesList
        saveAddRole(param).then(res => {
          if (res.success === true) {
            this.$message.success('新建成功')
            this.$emit('closeAddRole')
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    },
    // 添加新成员
    addNewUser() {
      this.addUserVisible = true
      this.handleGetUnselectRoleUsers()
    },
    // 关闭添加用户页面
    handleAddNewUser(done) {
      if (this.addFlag === false) {
        this.handleGetRoleUsers()
      }
      done()
    },
    // 确认添加用户
    confirmAddUsers() {
      if (this.unSelectMultipleSelection.length < 1) {
        this.$message.info('您还没有选择要添加的人员')
        return false
      }
      var selectedUsers = []
      if (this.userInfo) {
        this.userInfo.map(user => {
          selectedUsers.push(user.id)
        })
      }
      var userIdList = []
      this.unSelectMultipleSelection.map(item => {
        if (selectedUsers.indexOf(item.id) === -1) {
          userIdList.push(item)
        }
      })
      if (userIdList.length !== this.unSelectMultipleSelection.length) {
        this.$message.info('已过滤掉重复人员')
      }
      this.userInfo = this.userInfo.concat(userIdList)
      this.addUserVisible = false
    },
    // 查询要新添加的用户
    searchNewUsers() {
      this.selectUserPage = 1
      this.handleGetUnselectRoleUsers(this.primaryKey)
    },
    // 批量删除
    delUsers() {
      var userIdList = this.multipleSelection
      userIdList = userIdList.map(item => {
        return item.id
      })
      this.userInfo = this.userInfo.filter(item => {
        if (userIdList.indexOf(item.id) === -1) {
          return item
        }
      })
    }
  }
}
</script>
<style scoped>
.numListJup{
  padding-right: 10px
}
.right{
  text-align: right;
  padding-right: 10px;
}
.height50{
  height:50px;
  line-height: 50px;
}
.margin10{
  margin:0 10px;
  width: 200px;
}
</style>
<style lang="scss" scoped>
 .btn{
  height: 32px;
  color: #00eeee;
  padding: 0px 15px;
  font-size: 12px;
  background:linear-gradient(0deg, rgba(80,220,245,0) 1%, rgba(80,220,245,0.39) 100%) !important;
  &:hover{
    background:linear-gradient(0deg, rgba(80,220,245,0) 1%, rgba(80,220,245,0.99) 100%) !important
  }
  >>> span{
    color: #00eeee
  }
  >>> i{
    color: #00eeee;
    font-size: 14px;
    margin-right: 4px
  }
}
.btn2{
    padding: 5px 15px
  }

</style>
<style lang="scss">
  .addRoleUserDialog::-webkit-scrollbar{
    width: 0 !important
  }
  .addRoleUserDialog .el-dialog{
     border-radius: 10px;
      color: #01E6E9;
      background:transparent;
      border:1px solid #00eeee;
      background-image: url(/static/img/bgTwo.a178d248.png)!important;
      background-size: 100% 100%;
      overflow: hidden;
      .bkb{
        height: 1px;
      width: 90%;
      margin: -1px auto 0;
      background: radial-gradient(#53e3fd 20%, transparent 80%);
      }
      .el-tree{
        background: transparent;
        .el-tree__empty-block{
          background: transparent
        }
        .el-tree__empty-text{
          color: #ffffff
        }
        .el-checkbox__inner{
          top: 3px;
          border:1px solid #00eeee;
          background:transparent
        }
        .el-tree-node__label{
          color: #ffffff
        }
        .el-tree-node__content{
          background: none;
          &:hover{
            opacity: 0.5;
          }
        }
        .el-tree-node__children .el-tree-node__content::before {
          content: "";
          border-left: 1px dashed #006a78;
          height: 100vh;
          overflow-y: auto;
          width: 1px;
          position: absolute;
          left: 15px;
          top: -12px;
        }
        .el-tree-node__children .el-tree-node__content::after {
          content: "";
          border-top: 1px dashed #006a78;
          height: 1px;
          width: 10px;
          position: absolute;
          left:16px
        }
        .el-tree-node__expand-icon.expanded {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        .el-icon-caret-right:before {
          background: url("../../../../../public/img/jia.png") no-repeat center center;
          content: "";
          display: block;
          width: 18px;
          height: 18px;
          font-size: 18px;
          background-size: 18px;
        }
        .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
          background: url("../../../../../public/img/jian.png") no-repeat center center;
          content: "";
          display: block;
          width: 18px;
          height: 18px;
          font-size: 18px;
          background-size: 18px;
        }
        .el-tree-node__expand-icon.is-leaf::before {
          // display: none;
          visibility: hidden;
        }
      }
      .el-table{
        margin-top: 10px;
        border-radius: 4px;
        border: 1px solid #00eeee;
        overflow-y: auto;
        .el-table__empty-text{
          color: #ffffff
        }
        .cell{
          border-bottom:1px solid rgba(80,220,245,0.39)
        }
        th>.cell{
          border: none
        }
        // .el-table__row.hover-row{
        //   background: #50dcf5
        // }
        .el-table__row.current-row{
          background: #0099ff
        }
      }
      .el-dialog__header{
        text-align: left;
        margin:0 auto;
        font-size: 14px;
        padding:0 0 0 16px;
        background: linear-gradient(to bottom, rgba(83,227,253,1) 0%, rgba(83,227,253,0.0) 100%);
        color:#00eeee;
        width: 100%;
        height: 34px;
        line-height: 34px;
        .el-dialog__title{
          color: #00eeee;
          font-size: 14px;
          font-weight: bold;
          line-height: 34px;
        }
      }
      .el-dialog__body{
        padding:0 20px;
        font-size: 14px;
        color:#00eeee
      }
      .el-tabs__item{
        color: #ffffff;
        &.is-active{
         color: #00EEEE
        }
      }
      .el-tabs__nav-wrap::after{
        width: 0%
      }
      .el-tabs__active-bar{
        background: #00EEEE
      }
      .el-tabs__item:hover{
        color: #00EEEE
      }
      .el-dialog__headerbtn{
        outline: none;
        top: 0px;
        right: 10px;
        i{
          font-size: 18px;
          color: #00EEEE;
          font-weight: bold
        }
      }

  }
</style>

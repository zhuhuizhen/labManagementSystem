<template>
  <div class="UserManage userManageMent">
    <div class="UserManage-title">
      <el-form ref="form1" :model="formUser" size="small" label-width="110px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="关键字：">
              <el-input v-model="formUser.name" placeholder="请输入工号或姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="在职状态：">
              <el-select v-model="formUser.active" popper-class="select-option" clearable>
                <el-option label="-请选择-" value="" />
                <el-option label="在职" value="1" />
                <el-option label="离职" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="账号状态：">
              <el-select v-model="formUser.available" popper-class="select-option" clearable>
                <el-option label="-请选择-" value="" />
                <el-option label="启用" value="1" />
                <el-option label="未启用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button size="small" class="button-sub" style="marginLeft:-70px" @click="getUsers">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="UserManage-table">
      <div class="button-tool">
        <el-button icon="iconfont iconxinzeng" size="small" @click="handleAdd">新增</el-button>
        <el-button icon="iconfont iconshanchu" size="small" @click="handleEditAll">批量删除</el-button>
      </div>
      <div>
        <el-table :data="tableData" style="width: 100%" height="568" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" />
          <el-table-column type="index" label="序号" />
          <el-table-column prop="userCode" label="工号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="sex" label="性别" :formatter="formSex" />
          <el-table-column prop="active" label="在职状态" :formatter="formActive" />
          <el-table-column prop="available" label="账号状态" :formatter="formAvailable" />
          <el-table-column prop="mobile" label="手机" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont iconxiugai scope-caozuo" title="编辑" @click="handleEdit(scope.$index, scope.row)" />
              <i class="iconfont iconmima scope-caozuo" title="重置密码" @click="handleResPassword(scope.$index, scope.row)" />
              <i class="iconfont iconshanchu scope-caozuo" title="删除" @click="handleDel(scope.$index, scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <div class="numListJup margin-jump">
          <el-pagination
            :page-size="10"
            layout="total,prev, pager, next, jumper"
            :total="totalCount"
            :pager-count="5"
            :current-page.sync="currentPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
          <div class="sendAllBtn" @click="handleJumper">
            <span>跳转</span>
          </div>
        </div>
      </div>
    </div>
    <div class="childrenlog">
      <!--新增界面-->
      <el-dialog v-if="addFormVisible" v-model="addFormVisible" title="新建用户" :close-on-click-modal="false" :visible.sync="addFormVisible" :before-close="handleClose" class="deviceAdd editHeight" width="900px">
        <addMoudel style="height:525px;" class="userManageMentDilog" @clickAdd="clickAdd" @closeAdd="closeAdd" />
      </el-dialog>
      <!--取消新增界面-->
      <el-dialog title="提示" :visible.sync="CloseAddFormVisible" class="baseMove">
        <confirmDialog title="关闭后所填写的数据将不会保存，是否关闭" @sureMsg="addClose" @confireMsg="addNoClose" />
      </el-dialog>
      <!--编辑界面-->
      <el-dialog v-if="editFormVisible" v-model="editFormVisible" title="修改用户" :close-on-click-modal="false" :visible.sync="editFormVisible" :before-close="handleEditClose" class="deviceAdd editHeight" width="900px">
        <editMoudel style="height:525px;" :row="row" @clickAdd="clickAdd" @closeEdit="closeEdit" />
      </el-dialog>
      <!--确认删除弹框-->
      <el-dialog title="删除" :visible.sync="moveShow" class="baseMove">
        <confirmDialog title="将同时删除该用户与角色、数据域的关系，是否删除？" @sureMsg="sureMsg" @confireMsg="confireMsg" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getUserList, rsPassword, deleteSysUser } from '@/api/userManagement.js'
import addMoudel from './addMoudel.vue'
import editMoudel from './editMoudel.vue'
// import removeDialog from '@/views/baseComponents/baseRemove'
import confirmDialog from '@/views/baseComponents/baseConfirm'
export default {
  components: { addMoudel, editMoudel, confirmDialog },
  data() {
    return {
      tableData: [],
      totalCount: 50,
      pageNumber: 1,
      pageSize: 10,
      currentPage: 1, // 直接前往第几页
      formUser: {
        name: '', // 工号或姓名
        active: '', // 在职状态 在职 未在职
        available: '' // 账号状态 启用 未启用
      },
      selections: [], // 批量删除
      row: {}, // 编辑初始化内容
      delId: [], // 删除传参id
      addFormVisible: false, // 新增界面是否显示
      editFormVisible: false, // 编辑界面是否显示
      CloseAddFormVisible: false, // 取消新增界面
      moveShow: false// //确认删除弹框是否显示
      // tableData11: [
      //   { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }, { name: '11', id: '11' }
      // ]
    }
  },
  mounted() {
    // 查询--进入页面显示table表格
    this.getUsers()
  },
  methods: {
    // 查询
    getUsers() {
      const param = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sortColumn: 'name',
        sortOrder: 'desc',
        active: this.formUser.active,
        available: this.formUser.available,
        name: this.formUser.name
      }
      getUserList(param).then(response => {
        if (response.success === true) {
          this.tableData = response.data.rows
          this.totalCount = Number(response.data.totalCount)
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 性别转换
    formSex(row, column) {
      if (row.sex) {
        if (row.sex === '1') {
          return '男'
        } else if (row.sex === '0') {
          return '女'
        }
      }
    },
    // 是否在职
    formActive(row, column) {
      if (row.active) {
        if (row.active === '1') {
          return '在职'
        } else if (row.active === '0') {
          return '离职'
        }
      }
    },
    // 账号状态
    formAvailable(row, column) {
      if (row.available) {
        if (row.available === '1') {
          return '启用'
        } else if (row.available === '0') {
          return '未启用'
        }
      }
    },
    // 点击新增弹出新增页面moudel框
    handleAdd() {
      this.addFormVisible = true
    },
    // 取消新增---xx按钮 弹出新增界面是否关闭页面
    handleClose(done) {
      this.CloseAddFormVisible = true
      // this.CloseAddFormVisible = true
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
    },
    // 关闭新增页面  是 否
    addClose() {
      this.CloseAddFormVisible = false
      this.addFormVisible = false
    },
    addNoClose() {
      this.CloseAddFormVisible = false
    },
    // 新增界面保存之后关闭新增弹出框
    closeAdd() {
      this.addFormVisible = false
    },
    // 编辑弹出编辑页面moudel框
    handleEdit(index, row) {
      this.row = row
      row.password = ''
      // console.log('renyuan', this.row)
      this.editFormVisible = true
    },
    // 点击x取消编辑界面
    handleEditClose(done) {
      done()
      this.getUsers()
    },
    // 修改界面保存之后关闭修改弹框
    closeEdit() {
      this.editFormVisible = false
    },
    // 重置密码
    handleResPassword(index, row) {
      // console.log(index, row.id)
      const param = { id: row.id }
      rsPassword(param).then(response => {
        if (response.success === true) {
          this.$message.success('重置密码成功')
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 删除
    handleDel(index, row) {
      this.delId = [row.id]
      this.moveShow = true
    },
    // 批量删除
    handleEditAll() {
      if (this.selections.length === 0) {
        this.$message.error('您还没有选择要删除的用户')
      } else {
        this.moveShow = true
        this.delId = []
        this.selections.map(item => {
          this.delId.push(item.id)
        })
      }
    },
    // 确认删除
    sureMsg(flag) {
      this.moveShow = flag
      const param = { userIdList: this.delId }
      deleteSysUser(param).then(response => {
        if (response.success === true) {
          this.$message.success('删除成功')
          this.getUsers()
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 取消删除
    confireMsg(flag) {
      this.moveShow = flag
    },
    handleSelectionChange(val) {
      this.selections = val
    },
    // 分页
    handleSizeChange() {

    },
    // 分页  点击哪一页跳到哪一页
    handleCurrentChange(val) {
      // console.log('tag', this.currentPage)
      this.pageNumber = val
      this.getUsers()
    },
    // 分页,直接前往第几页
    handleJumper(currentPage) {},
    // 子组件新增保存完毕调用table数据
    clickAdd() {
      this.getUsers()
    }
  }
}
</script>
<style lang="scss">
// .typeInfoAdd .el-dialog__title{
//         color:#00eeee
//       }
.UserManage{
    .typeInfoAdd .el-dialog__title{
        color:#00eeee
      }
    .UserManage-title{
        margin: 1%;
        // padding-left:20px;
        background-image: url('../../../../assets/tunnelTree/bj.png');
        background-size: 100% 100%;
        border-radius: 5px;
        border: 1px solid #50DCF5;
        padding-top:1.5%;
        .el-input__inner {
          // cursor: pointer;
          height: 34px;
          width: 166px;
        }
        .el-input{
          font-size: 14px;
          // input{
          //   padding-left: 10px;
          // }
        }
        .el-form-item__label{
          font-size: 14px;
        }
    }
    // /deep/ .el-dialog__wrapper .el-dialog {
    //   margin-top: 100px !important
    // }

    .UserManage-table{
       margin: 1%;
       background-image: url('../../../../assets/tunnelTree/bj.png');
       background-size: 100% 100%;
       border-radius: 5px;
       border: 1px solid #50DCF5;
      //  height: 690px;
       .button-tool{
         padding-top:1%;
       }
       .scope-caozuo{
          margin-left: 12px;
          margin-right:8px;
          color:#00FFFF;
          // font-size: 12px;
       }
      //  .el-table .cell{
      //     height: 43px;
      //     line-height: 43px;
      //     border-bottom:1px solid #00eeee
      //   }
      //   .el-table th>.cell{
      //     border: none
      //   }
    }
    .childrenlog{
      .dialog-footer{
        text-align: center;
      }
    }
    .el-table .cell{
          height: 43px;
          line-height: 43px;
          border-bottom:1px solid #00eeee
    }
    .el-table th>.cell{
      border: none
    }
    .el-card__body {
      padding: 0;
    }
    .editHeight.el-dialog__wrapper .el-dialog{
      height: 555px!important;
    }
}
</style>
<style lang="scss" scoped>
@import "@/styles/userManageMent.scss";
</style>


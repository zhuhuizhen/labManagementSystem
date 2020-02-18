<template>
  <div class="managemainTable">
    <div v-show="show" class="button-tool">
      <el-button icon="iconfont iconxinzeng" size="small" @click="handleAdd">新增</el-button>
      <el-button icon="iconfont iconshanchu" size="small" @click="handleSelectDel">批量删除</el-button>
    </div>
    <el-table :data="tableDate" height="605" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="code" label="区域ID" width="110" />
      <el-table-column prop="name" label="区域名称" width="140" />
      <el-table-column prop="manager" label="区域负责人" />
      <el-table-column prop="phone" label="联系电话" width="125" />
      <el-table-column prop="remark" label="描述" />
      <el-table-column label="操作" width="115">
        <template slot-scope="scope">
          <i class="iconfont iconxiugai scope-caozuo" title="编辑" @click="handleEdit(scope.$index, scope.row)" />
          <i class="iconfont iconshanchu scope-caozuo" title="删除" @click="handleDel(scope.$index, scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="numListJup margin-jump">
      <el-pagination
        :page-size="pageSize"
        layout="total,prev, pager, next, jumper"
        :total="totalNum"
        :pager-count="5"
        :current-page.sync="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div class="sendAllBtn" @click="handleJumper">
        <span>跳转</span>
      </div>

    </div>
    <!--确认删除-->
    <el-dialog title="删除" :visible.sync="moveShow" class="baseMove">
      <removeDialog @sureMsg="sureMsg" @confireMsg="confireMsg" />
    </el-dialog>
    <!--新增界面-->
    <el-dialog v-if="addFormVisible" v-model="addFormVisible" title="新建区域" :close-on-click-modal="false" :visible.sync="addFormVisible" class="deviceAdd addmanage" width="860px">
      <addMoudel style="height:490px;" @handleGetTree1="handleGetTree1" @handeladdFormVisible="handeladdFormVisible" />
    </el-dialog>
    <!--编辑界面-->
    <el-dialog v-if="editFormVisible" v-model="editFormVisible" title="修改区域" :close-on-click-modal="false" :visible.sync="editFormVisible" :before-close="handleClose" class="deviceAdd addmanage" width="860px">
      <editMoudel ref="childrenEdit" :row="row" style="height:490px;" @handleGetTree1="handleGetTree1" @handeleditFormVisible="handeleditFormVisible" />
    </el-dialog>
  </div>
</template>

<script>
import { conDelete } from '@/api/userManagement.js'
import addMoudel from './addMoudel.vue'
import editMoudel from './editMoudel.vue'
import removeDialog from '@/views/baseComponents/baseRemove'
export default {
  components: { addMoudel, editMoudel, removeDialog },
  props: {
    tableDate: {
      type: Array,
      default: () => []
    },
    totalNum: {
      type: Number,
      default: () => 0
    },
    show: Boolean
  },
  data() {
    return {
      pageSize: 10,
      pageNumber: 1,
      currentPage: 1, // 直接前往第几页
      total: 0,
      addFormVisible: false, // 新增界面是否显示
      editFormVisible: false, // 编辑界面是否显示
      row: {}, // 编辑初始化内容
      multipleSelection: [], // 选择的table数据的对象组成的数组
      delTableById: [], // 删除数据传参的id数组
      moveShow: false// //确认删除弹框是否显示
      // removeDioag: false // 确认删除
    }
  },
  mounted() {
    // alert('table1')
    // console.log('show', this.show)
    // console.log('11', this.tableDate)
  },
  methods: {
    // 重新刷新页面
    handleGetTree1() {
      // alert(22222)
      this.$emit('handleGetTree')
    },
    // 选择table数据  删除的项
    handleSelectionChange(val) {
      this.delTableById = []
      this.multipleSelection = val
      this.multipleSelection.map(value => {
        this.delTableById.push(value.id)
      })
      // console.log('delTableById', this.delTableById)
    },
    // 新增
    handleAdd() {
      this.addFormVisible = true
    },
    // 取消新增
    handeladdFormVisible(addFormVisible) {
      this.addFormVisible = false
    },

    // 批量删除
    handleSelectDel() {
      if (this.delTableById.length === 0) {
        this.$message.error('请至少选择一条数据')
      } else {
        this.moveShow = true
      }
    },
    // 删除
    handleDel(index, row) {
      // console.log('shanchu', row.id)
      this.delTableById.push(row.id)
      this.moveShow = true
    },
    // 确认删除
    sureMsg(flag) {
      this.moveShow = flag
      const param = { tableName: 'sys_manage_center', columnName: 'id', values: this.delTableById }
      conDelete(param).then(response => {
        if (response.success === true) {
          this.$message.success(response.data)
          this.handleGetTree1()
        } else {
          if (response.data !== '') {
            this.$message.error(response.data)
          } else {
            this.$message.error(response.msg)
          }
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 取消删除
    confireMsg(flag) {
      this.moveShow = flag
    },
    // 编辑
    handleEdit(index, row) {
      // console.log(index, row)
      this.row = row
      // console.log('this', row)
      this.editFormVisible = true
    },
    // 取消编辑
    handeleditFormVisible(editFormVisible) {
      this.editFormVisible = false
    },
    handleClose(done) {
      // if (this.$refs.childrenEdit) {
      //   this.$refs.childrenEdit.handeleditFormVisible()
      // }
      done()
      this.handleGetTree1()
      // this.$refs.childrenEdit.clearDate()
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNumber = 1
      this.$emit('handleGetTableData', { pageSize: this.pageSize, pageNumber: this.pageNumber })
    },
    handleCurrentChange(val) {
      this.pageSize = 10
      this.pageNumber = val
      this.$emit('handleGetTableData', { pageSize: this.pageSize, pageNumber: this.pageNumber })
    },
    handleJumper(currentPage) {}
    // // 刷新
    // handleRes(val) {
    //   // this.handleSizeChange(val)
    // },
    // // 切换
    // handleQiHuan() {},
    // // 下载
    // handleDownload() {}
  }
}
</script>

<style lang="scss">
.managemainTable{
    .button-tool{
      margin-top:20px;
      margin-bottom: 5px;
    }
    .scope-caozuo{
       margin-left: 12px;
       margin-right:8px;
       color:#00FFFF;
      //  font-size: 12px;
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
    // /deep/ .el-dialog__wrapper .el-dialog {
    //   margin-top: 100px !important
    // }
}
</style>

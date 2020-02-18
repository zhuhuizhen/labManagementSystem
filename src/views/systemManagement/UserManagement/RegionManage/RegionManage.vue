<template>
  <div class="RegionManage userManageMent">
    <div class="RegionManage-title">
      <el-form ref="form1" :model="formRegion" size="small" label-width="110px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="数据域名称：">
              <el-input v-model="formRegion.name" placeholder="请输入要查询的数据域名称" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button size="small" class="button-sub" style="margin-left:-80px;" @click="getList">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="RegionManage-table">
      <div class="button-tool">
        <el-button icon="iconfont iconxinzeng" size="small" @click="handleAdd">新增</el-button>
        <el-button icon="iconfont iconshanchu" size="small" @click="handleSelectDel">批量删除</el-button>
      </div>
      <div>
        <el-table :data="tableData" height="568" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" />
          <el-table-column type="index" label="序号" />
          <el-table-column prop="code" label="编号" />
          <el-table-column prop="name" label="名称" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont iconxiugai scope-caozuo" title="编辑" @click="handleEdit(scope.$index, scope.row)" />
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
      <el-dialog v-if="addFormVisible" v-model="addFormVisible" title="新建数据域" :close-on-click-modal="false" :visible.sync="addFormVisible" :before-close="handleClose" class="deviceAdd editandaddHeight" width="920px">
        <addMoudel ref="childrenAdd" style="height:530px;" :region-id="regionId" @refRegionList="refRegionList" @Add2click="Add2click" @closeAdd="closeAdd" />
      </el-dialog>
      <!--取消新增界面-->
      <!-- <el-dialog title="提示信息" :visible.sync="CloseAddFormVisible" append-to-body class="typeInfoAdd outGoing">
        <div class="sureRemove" style="font-size:16px;">页面关闭后您的数据将不会被保存，确认关闭当前页面吗？</div>
        <div class="goOut">
          <el-button size="small" class="button-sub" @click="addClose">确认</el-button>
          <el-button size="small" class="button-cancle" @click="addNoClose">取消</el-button>
        </div>
      </el-dialog> -->
      <!--编辑界面-->
      <el-dialog v-if="editFormVisible" v-model="editFormVisible" title="修改数据域" :close-on-click-modal="false" :visible.sync="editFormVisible" :before-close="handleEditClose" class="deviceAdd editandaddHeight" width="920px">
        <editMoudel ref="childrenEdit" style="height:530px;" :row="row" :region-id="regionId" @refRegionList="refRegionList" @Add2click="Add2click" @closeEdit="closeEdit" />
      </el-dialog>
      <!--确认删除弹框-->
      <el-dialog title="删除" :visible.sync="moveShow" class="baseMove">
        <confirmDialog title="将同时删除该数据域与组织的关系，是否删除？" @sureMsg="sureMsg" @confireMsg="confireMsg" />
      </el-dialog>
      <!-- 新建数据域未保存提示 -->
      <el-dialog title="提示" :visible.sync="saveShow" class="baseMove">
        <confirmDialog title="关闭后所填写的数据将不会保存，是否关闭" @sureMsg="saveShowConfirm" @confireMsg="saveShowCancel" />
      </el-dialog>
      <!--数据域新增里边的新增人员-->
      <el-dialog v-if="Add2FormVisible" v-model="Add2FormVisible" title="选择人员" :close-on-click-modal="false" :visible.sync="Add2FormVisible" :before-close="Useradd2Close" class="deviceAdd editandaddHeight" width="920px">
        <p class="bkb" />
        <div>
          <div class="addAtop">
            <el-form ref="formRegionAdd" :model="formRegionAdd" size="small" label-width="110px">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-form-item label="关键字：">
                    <el-input v-model="formRegionAdd.name" placeholder="请输入用户名" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-button size="small" class="button-sub" style="margin-left:-80px;" @click="selseAdduser">查询</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-button size="small" class="button-sub" style="margin-left:-120px;" @click="selseAdduserOk">确认</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="AddBorder">
            <el-table ref="multipleTableAdd" height="400" :data="tableDataUser" @selection-change="handleSelcRegionChangeAdd">
              <el-table-column type="selection" width="60" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="userCode" label="工号" />
              <el-table-column prop="name" label="用户名" />
              <el-table-column prop="name" label="手机" />
              <el-table-column prop="name" label="Email" />
            </el-table>
            <div class="numListJup margin-jump">
              <el-pagination
                :page-size="pageSizeAdd"
                layout="total,prev, pager, next, jumper"
                :total="totalCountAdd"
                :pager-count="5"
                :current-page.sync="currentPageAdd"
                @size-change="handleSizeAdd"
                @current-change="handleCurrentAdd"
              />
              <div class="sendAllBtn" @click="handleJumperAdd">
                <span>跳转</span>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getRegionList, delRegion, getUserList } from '@/api/userManagement.js'
import addMoudel from './addMoudel.vue'
import editMoudel from './editMoudel.vue'
// import removeDialog from '@/views/baseComponents/baseRemove'
import confirmDialog from '@/views/baseComponents/baseConfirm'
export default {
  components: { addMoudel, editMoudel, confirmDialog },
  data() {
    return {
      saveShow: false,
      tableData: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10,
      currentPage: 1, // 直接前往第几页
      formRegion: {
        name: '' // 工号或姓名
      },
      row: {}, // 编辑初始化内容
      addFormVisible: false, // 新增界面是否显示
      editFormVisible: false, // 编辑界面是否显示
      moveShow: false, // 确认删除弹框是否显示
      CloseAddFormVisible: false, // 取消新增界面
      Add2FormVisible: false, // 新增里边的新增人员是否显示
      multipleSelection: [], // 选择的table数据的对象组成的数组
      delTableById: [], // 删除数据传参的id数组
      regionId: '', // 新增之后最新数据域id
      formRegionAdd: { name: '' }, // 新增数据域中新增人员
      multipleTableAdd: [],
      tableDataUser: [], // 新增中新增人员
      pageSizeAdd: 8,
      pageNumberAdd: 1,
      totalCountAdd: 0,
      currentPageAdd: 1,
      userIdList: []// 数据域新增人员选择新增选择人员id
    }
  },
  watch: {
    tableData(oldVlaue, newValue) {
    }
  },
  mounted() {
    // 查询--进入页面显示table表格
    this.getList()
  },
  methods: {
    // 新建数据域未保存提示
    saveShowConfirm() {
      this.saveShow = false
      this.addFormVisible = false
    },
    saveShowCancel() {
      this.saveShow = false
    },
    // 查询
    getList() {
      const param = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sortColumn: 'create_time',
        sortOrder: 'desc',
        name: this.formRegion.name
      }
      getRegionList(param).then(response => {
        if (response.success === true) {
          this.tableData = response.data.rows
          this.regionId = this.tableData[0].id
          // console.log('sdf11', this.tableData)
          // console.log('00001', this.tableData[0].id)
          this.totalCount = Number(response.data.totalCount)
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 新增刷新数据域表格
    refRegionList() {
      this.getList()
    },
    // 点击新增弹出新增页面moudel框
    handleAdd() {
      this.addFormVisible = true
    },
    // 取消新增
    handleClose(done) {
      this.saveShow = true
    },
    closeAdd() {
      this.addFormVisible = false
      this.getList()
    },
    // 关闭新增页面  是 否
    addClose() {
      this.CloseAddFormVisible = false
      this.addFormVisible = false
      this.getList()
    },
    addNoClose() {
      this.CloseAddFormVisible = false
    },
    // 编辑弹出编辑页面moudel框
    handleEdit(index, row) {
      this.row = row
      row.password = ''
      // console.log('renyuan', this.row)
      this.editFormVisible = true
    },
    // 保存编辑界面之后关闭修改界面
    closeEdit() {
      this.editFormVisible = false
      this.getList()
    },
    // 点击x取消编辑界面
    handleEditClose(done) {
      done()
      this.getList()
    },
    // 点击x取消数据域新增中的人员选择新增界面
    Useradd2Close(done) {
      done()
      this.pageNumberAdd = 1; this.pageSizeAdd = 8; this.currentPageAdd = 1
      // this.Adduser()
    },
    // 删除
    handleDel(index, row) {
      this.delTableById.push(row.id)
      this.moveShow = true
    },
    // 确认删除
    sureMsg(flag) {
      this.moveShow = flag
      const param = { regionIdList: this.delTableById }
      delRegion(param).then(response => {
        if (response.success === true) {
          this.$message.success('删除成功')
          this.getList()
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
    // 选择table数据
    handleSelectionChange(val) {
      this.delTableById = []
      this.multipleSelection = val
      this.multipleSelection.map(value => {
        this.delTableById.push(value.id)
      })
      // console.log('delTableById', this.delTableById)
    },
    // 批量删除
    handleSelectDel() {
      if (this.delTableById.length === 0) {
        this.$message.error('请至少选择一条数据')
      } else {
        this.moveShow = true
      }
    },
    // 分页
    handleSizeChange() {},
    // 分页  点击哪一页跳到哪一页
    handleCurrentChange(val) {
      // console.log('tag', this.currentPage)
      this.pageNumber = val
      this.getList()
    },
    // 分页,直接前往第几页
    handleJumper(currentPage) {},
    // 新增数据域中的新增人员选择函数-----接口分页调用
    Adduser() {
      const param = { regionId: this.regionId, name: this.formRegionAdd.name, pageNumber: this.pageNumberAdd, pageSize: this.pageSizeAdd }
      getUserList(param).then(response => {
        if (response.success === true) {
          // this.$message.success(response.msg)
          this.tableDataUser = response.data.rows
          this.totalCountAdd = response.data.totalCount
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 新增数据域中的新增人员选择
    Add2click() {
      this.Add2FormVisible = true
      this.Adduser()
    },
    // 新增数据域中的新增人员选择  查询
    selseAdduser() {
      this.Adduser()
    },
    // 新增数据域中的新增人员选择  确认
    selseAdduserOk() {
      if (this.userIdList.length === 0) {
        this.$message.error('请至少选择一条数据')
      } else {
        if (this.addFormVisible) {
          this.$refs.childrenAdd.getUserListData(this.multipleTableAdd)
        }
        if (this.editFormVisible) {
          this.$refs.childrenEdit.getUserListData(this.multipleTableAdd)
        }
        this.Add2FormVisible = false
      }
    },
    // 新增数据域中的新增人员选择table
    handleSelcRegionChangeAdd(val) {
      // console.log('useridsssss', val)
      this.multipleTableAdd = val
      this.userIdList = []
      this.multipleTableAdd.map(value => {
        this.userIdList.push(value.id)
      })
      // console.log('userid', this.userIdList)
    },
    handleSizeAdd() {},
    handleCurrentAdd(val) {
      this.pageNumberAdd = val
      this.Adduser()
    },
    handleJumperAdd(currentPageAdd) {}
  }
}
</script>
<style lang="scss">
.RegionManage{
    .RegionManage-title{
        margin: 1%;
        background-image: url('../../../../assets/tunnelTree/bj.png');
        background-size: 100% 100%;
        border-radius: 5px;
        border: 1px solid #50DCF5;
        padding-top:1.5%;
        padding-left:20px;
        .el-input__inner {
          cursor: pointer;
          height: 34px;
          width: 180px;
        }
        .el-input{
          font-size: 14px;
          // input{
            // padding-left: 10px;
          // }
        }
        .el-form-item__label{
          font-size: 14px;
        }
    }
    .RegionManage-table{
       margin: 1%;
       background-image: url('../../../../assets/tunnelTree/bj.png');
       background-size: 100% 100%;
       border-radius: 5px;
       border: 1px solid #50DCF5;
       .button-tool{
         padding-top:1%;
       }
       .scope-caozuo{
          margin-left: 12px;
          margin-right:8px;
          color:#00FFFF;
          // font-size: 12px;
       }
    }

    .childrenlog{
      .dialog-footer{
        text-align: center;
      }
      .addAtop{
        margin-top:20px;
      }
      .AddBorder{
        /deep/.el-table{
          border-radius: 5px;
          border: 1px solid #00eeee;
        }
        margin-left: 20px;
        margin-right: 20px
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
    .editandaddHeight.el-dialog__wrapper .el-dialog{
      height: 565px!important;
    }
     .el-tab-pane{
        padding:0 20px !important;
      }
}
</style>
<style lang="scss" scoped>
@import "@/styles/userManageMent.scss";
</style>


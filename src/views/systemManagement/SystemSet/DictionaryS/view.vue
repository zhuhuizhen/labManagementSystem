<template>
  <div class="Dictionarys">
    <div class="Diction-title">
      <el-form ref="form1" :model="formDiction" size="small" label-width="110px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="字典名称：">
              <el-input v-model="formDiction.name" placeholder="请输入字典名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button size="small" class="button-sub" style="marginLeft:-70px" @click="getDiction">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="Dictions-table">
      <div class="button-tool">
        <el-button icon="iconfont iconxinzeng" size="small" @click="handleAdd">新增</el-button>
        <el-button icon="iconfont iconshanchu" size="small" @click="handleSelectDel">批量删除</el-button>
      </div>
      <div>
        <el-table ref="multipleDel" :data="tableData" style="width: 100%" height="568" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="60" />
          <el-table-column type="index" label="序号" />
          <el-table-column prop="name" label="字典名称" />
          <el-table-column prop="description" label="字典描述" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont iconxiugai scope-caozuo" title="编辑" @click="handleEdit(scope.$index, scope.row)" />
              <i class="iconfont iconchakan scope-caozuo" title="查看详情" @click="handleLook(scope.$index, scope.row)" />
              <i class="iconfont iconshanchu scope-caozuo" title="删除" @click="handleDel(scope.$index, scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <div class="numListJup margin-jump">
          <el-pagination
            :page-size="10"
            layout="total,prev, pager, next, jumper"
            :total="totalCount"
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
    <div class="dislog">
      <!--新增界面-->
      <el-dialog v-if="addFormVisible" v-model="addFormVisible" title="新建字典库" :close-on-click-modal="false" :visible.sync="addFormVisible" class="deviceAdd newAddDit" width="550px">
        <AddMoudel style="height:310px;" @addclose="addclose" @resgetDiction="resgetDiction" />
      </el-dialog>
      <!--编辑界面-->
      <el-dialog v-if="editFormVisible" v-model="editFormVisible" title="编辑字典库" :close-on-click-modal="false" :before-close="closeEdit" :visible.sync="editFormVisible" class="deviceAdd newAddDit" width="550px">
        <EditMoudel :row="row" :dict-id="dictId" style="height:310px;" @editclose="editclose" @resgetDiction="resgetDiction" />
      </el-dialog>
      <!--详情界面-->
      <el-dialog v-if="LookFormVisible" v-model="LookFormVisible" title="查看字典子项" :close-on-click-modal="false" :visible.sync="LookFormVisible" class="deviceAdd newlookDit" width="860px">
        <LookMoudel :dict-id="dictId" :parent-name="parentName" style="height:500px;" @Lookclose="Lookclose" />
      </el-dialog>
      <!--确认删除弹框-->
      <el-dialog title="删除" :visible.sync="moveShow" class="baseMove">
        <removeDialog @sureMsg="sureMsg" @confireMsg="confireMsg" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { dictConnSelect, dictConnDel } from '@/api/Dictionarys.js'
import AddMoudel from './AddMoudel.vue'
import EditMoudel from './EditMoudel.vue'
import LookMoudel from './LookMoudel.vue'
import removeDialog from '@/views/baseComponents/baseRemove'
export default {
  components: { AddMoudel, EditMoudel, LookMoudel, removeDialog },
  data() {
    return {
      formDiction: { name: '' },
      tableData: [], // 字典table表格数据
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      currentPage: 1,
      addFormVisible: false, // 新增界面是否显示
      editFormVisible: false, // 编辑界面是否显示
      LookFormVisible: false, // 详情界面是否显示
      ids: '', // 删除传参id
      moveShow: false, // //确认删除弹框是否显示
      multipleDel: [],
      row: {}, // 字典编辑的数据
      dictId: '', // 主表字典id
      parentName: ''// 主表字典的name
    }
  },
  mounted() {
    this.getStartDiction()
  },
  methods: {
    // 字典查询----初始化查询
    getStartDiction() {
      const param = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      dictConnSelect(param).then(response => {
        if (response.success === true) {
          this.tableData = response.data.sysDicts
          this.totalCount = Number(response.data.totalCount)
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 字典查询----模糊查询
    getDiction() {
      const param = {
        dictName: this.formDiction.name,
        dictNameIsLike: '1',
        sortColumn: 'create_time',
        sortOrder: 'asc',
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }
      dictConnSelect(param).then(response => {
        if (response.success === true) {
          this.tableData = response.data.sysDicts
          this.totalCount = Number(response.data.totalCount)
        } else {
          this.$message.error(response.data)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 字典删除
    handleDel(index, row) {
      console.log('tag', row)
      this.ids = row.id
      this.moveShow = true
    },
    // 确认删除
    sureMsg(flag) {
      this.moveShow = flag
      const param = {
        ids: this.ids,
        flag: '1'
      }
      dictConnDel(param).then(response => {
        if (response.success === true) {
          this.$message.success(response.msg)
          this.getDiction()
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 批量删除
    handleSelectDel() {
      if (this.ids.length === 0) {
        this.$message.error('请至少选择一条数据')
      } else {
        this.moveShow = true
      }
    },
    // 选择表格数据
    handleSelectionChange(val) {
      this.multipleDel = val
      const delId = []
      this.multipleDel.map(value => {
        delId.push(value.id)
      })
      //   console.log('userid', delId.join(','))
      this.ids = delId.join(',')
    },
    // 取消删除
    confireMsg(flag) {
      this.moveShow = flag
    },
    // 字典新增
    handleAdd() {
      this.addFormVisible = true
    },
    // 取消新增
    addclose() {
      this.addFormVisible = false
    },
    // 新增编辑之后刷新页面
    resgetDiction() {
      this.getDiction()
    },
    // 字典编辑
    handleEdit(index, row) {
      this.dictId = row.id
      this.row = row
      this.editFormVisible = true
    },
    // 取消编辑
    editclose() {
      this.editFormVisible = false
    },
    // 点击x取消编辑
    closeEdit(done) {
      done()
      this.getDiction()
    },
    // 查看详情  查看字典库子表
    handleLook(index, row) {
      this.LookFormVisible = true
      this.dictId = row.id
      this.parentName = row.name
      //   console.log('parentname', this.parentName)
      //   const param = { dictId: this.dictId }
      //   dictConnSelect(param).then(response => {
      //     if (response.success === true) {
      //       this.SontableData = response.data.sysDictItems
      //     } else {
      //       this.$message.error(response.data)
      //     }
      //   }).catch(response => {
      //     this.$message.error(response.message)
      //   })

    //   console.log('zirow', row)
    },
    // 取消详情
    Lookclose() {
      this.LookFormVisible = false
    },
    // 分页
    handleSizeChange() {},
    handleCurrentChange(val) {
      this.pageSize = 10
      this.pageNumber = val
      this.getDiction()
    },
    handleJumper(currentPage) {}
  }
}
</script>

<style lang="scss" >
.Dictionarys{
    .Diction-title{
        margin: 1%;
        // padding-left:20px;
        background-image: url('../../../../assets/tunnelTree/bj.png');
        background-size: 100% 100%;
        border-radius: 5px;
        border: 1px solid #50DCF5;
        padding-top:1.5%;
        .el-input__inner {
          height: 34px;
          width: 166px;
        }
        .el-form-item__label{
          color: #00eeee;
          font-family:"微软雅黑";
          font-weight:400;
        }
        .el-input--small .el-input__inner {
        background-color: transparent;
        font-family:"微软雅黑";
        font-weight:400;
        color:rgba(255,255,255,1);
        border:1px solid rgba(80,220,245,0.7);
        &:focus {
          border:1px solid rgba(80,220,245,1);
        }
      }
       .el-input--small.is-focus .el-input__inner {
        background-color: transparent;
        font-family:'微软雅黑';
        font-weight:400;
        color:rgba(255,255,255,1);
        border:1px solid rgba(80,220,245,1);
      }
      input::-webkit-input-placeholder {
        opacity: 0.5;
        font-size: 12px;
      }
    }
    .Dictions-table{
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
          cursor: pointer;
       }
       .el-table .cell{
          height: 43px;
          line-height: 43px;
          border-bottom:1px solid #00eeee
        }
        .el-table th>.cell{
        border: none
        }
    }
    .newAddDit .el-form-item__label{
          color: #00eeee;
          font-family:"微软雅黑";
          font-weight:400;
    }
    .newAddDit.el-dialog__wrapper .el-dialog{
      height: 340px!important;
    }
    .newlookDit.el-dialog__wrapper .el-dialog{
      height: 555px!important;
    }
}
</style>

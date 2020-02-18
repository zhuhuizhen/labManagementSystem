<template>
  <div class="messageIndex">
    <div class="msgTop blockMsg">
      <el-row class="msgTp">
        <el-radio-group v-model="factype" class="radio-style" @change="changeClick">
          <el-radio-button label="1">系统公告</el-radio-button>
          <el-radio-button label="2">企业信息</el-radio-button>
          <el-radio-button label="0">全部</el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row>
        <div class="block">
          <el-date-picker
            v-model="startMsgTime"
            type="datetime"
            placeholder="选择开始日期时间"
            prefix-icon="iconfont iconrili"
          />
        </div>
        <span class="toGo">至</span>
        <div class="block">
          <el-date-picker
            v-model="endMsgTime"
            type="datetime"
            placeholder="选择结束日期时间"
            prefix-icon="iconfont iconrili"
          />
        </div>
        <el-button size="small" class="button-sub searchs" @click="searchMsg">查询</el-button>
      </el-row>
    </div>
    <div class="msgBom blockMsg">
      <div class="headerTop">
        <el-row class="btn">
          <div class="button-tool btn-all">
            <el-button size="small" icon="iconfont iconqingchuduilie" @click="removeMsg">删除</el-button>
            <el-button size="small" @click="oneRead">标为已读</el-button>
            <el-button size="small" @click="allRead">全部标为已读</el-button>
          </div>
          <div class="sendAllBtn">
            <el-button size="small" class="button-sub" @click="addMsg">新增</el-button>
            <el-button size="small" class="button-sub" @click="sendMsg">发布</el-button>
          </div>
        </el-row>
      </div>
      <el-table
        ref="multipleTable"
        height="572"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="tableShow"
        @selection-change="handleSelectionChange"
        @cell-click="clickOneTable"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          label="序号"
          width="120"
          prop="id"
        >
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          prop="memo"
          label="内容"
        >
          <!-- show-overflow-tooltip -->
          <template slot-scope="scope">
            <div v-if="scope.row.ifRead==='0'?true:false" class="tableContent">
              <span class="board" :title="scope.row.topic+memoReplace(scope.row.memo)">{{ scope.row.topic }}<span class="momoLeft" v-html="memoReplace(scope.row.memo)" /></span><span class="redBoard" />
            </div>
            <div v-else class="tableContent"><span class="board" :title="scope.row.topic+memoReplace(scope.row.memo)">{{ scope.row.topic }}<span class="momoLeft" v-html="memoReplace(scope.row.memo)" /></span></div>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="120"
          :formatter="stateFormatter"
        />
        <el-table-column
          prop="create_time"
          label="时间"
          width="150"
          sort-by="create_time"
          :sortable="true"
        />
      </el-table>
      <div v-if="haveData" class="numListJup">
        <el-pagination
          :page-size="12"
          layout="total,prev, pager, next, jumper"
          :total="totalNum"
          @current-change="handleCurrentChange"
        />
        <div class="sendAllBtn">
          <span>跳转</span>
        </div>
      </div>

      <el-dialog title="删除" :visible.sync="moveShow" class="baseMove">
        <removeDialog @sureMsg="sureMsg" @confireMsg="confireMsg" />
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getTime } from '@/utils/time'
import { getAllList, checkStatus, allReads, remove, sendCg } from '@/api/message'
import removeDialog from '@/views/baseComponents/baseRemove'
export default {
  name: 'MessageList',
  components: { removeDialog },
  data() {
    return {
      startMsgTime: '',
      endMsgTime: '',
      tableData: [],
      pageSizeGo: 1,
      moveShow: false,
      removeRd: [], // 勾选数据
      totalNum: 1,
      factype: '0',
      haveData: true
    }
  },
  watch: {
    $route: { // 监听路由变化
      handler: function(to, from) {
        if (to.name === 'MessageList') {
          const param = {
            'pageNumber': 1,
            'pageSize': 12,
            'status': [0, 1, 2]
          }
          this.getListData(param)
        }
      },
      deep: true
    }
  },
  activated() {
  },
  mounted() {
    const param = {
      'pageNumber': 1,
      'pageSize': 12,
      'status': [0, 1, 2]
    }
    this.getListData(param)
  },
  methods: {
    changeClick() {
      const param = {
        'pageNumber': 1,
        'pageSize': 12,
        'status': [0, 1, 2]
      }
      this.getListData(param)
    },
    searchMsg() {
      if (this.startMsgTime === '' || this.startMsgTime === null) {
        this.$message({
          type: 'error',
          message: '请输入开始时间'
        })
        return
      }
      if (this.endMsgTime === '' || this.endMsgTime === null) {
        this.$message({
          type: 'error',
          message: '请输入结束时间'
        })
        return
      }
      this.haveData = false
      const param = {
        'pageNumber': 1,
        'pageSize': 12,
        'status': [0, 1, 2],
        'startDate': getTime(this.startMsgTime),
        'endDate': getTime(this.endMsgTime)
      }
      this.getListData(param)
    },
    sendMsg() {
      var flag = false
      this.removeRd.forEach(element => {
        if (element.state === '1') {
          this.$message.error('消息已发布，请重新选择！')
          flag = true
          return
        }
      })
      if (flag) {
        return
      }
      const ids = this.removeRd.map(res => {
        return res.ms_id
      })
      sendCg(ids.join(',')).then(res => {
        if (res.success) {
          this.$message({
            type: 'success',
            message: '发布成功'
          })
          this.getListData('', true)
        }
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    handleSelectionChange(val) {
      this.removeRd = val
    },
    handleCurrentChange(val) {
      const param = {
        'pageNumber': val,
        'pageSize': 12,
        'status': [0, 1, 2]
      }
      if (this.startMsgTime !== '' && this.endMsgTime !== '') {
        param.startDate = getTime(this.startMsgTime)
        param.endDate = getTime(this.endMsgTime)
      }
      this.getListData(param)
    },
    clickOneTable(row, column, cell, event) {
      const querys = {
        id: row.ms_id
      }
      if (row.ifRead === '0') {
        this.changeStatus(row.ms_id)
      }
      if (row.state === '0') {
        this.$router.push({ path: '/message/changeMsg', query: querys })
      } else {
        this.$router.push({ path: '/message/messageMore/' + querys.id, query: querys })
      }
    },
    removeMsg() {
      if (this.removeRd.length === 0) {
        this.$message.error('请选择至少一条数据')
        return
      }
      this.moveShow = true
    },
    oneRead() {
      if (this.removeRd.length === 0) {
        this.$message.error('请选择至少一条数据')
        return
      }
      var haveNow = this.removeRd.find(res => {
        return res.ifRead === '1'
      })
      if (haveNow) {
        this.$message.error('请选择未读的消息！')
        return
      }
      const ids = this.removeRd.map(res => {
        return res.ms_id
      })
      checkStatus(ids.join(',')).then(res => {
        this.getListData('', true)
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    allRead() {
      allReads().then(res => {
        this.$message({
          type: 'success',
          message: '全部标为已读成功'
        })
        this.getListData('', true)
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    addMsg() {
      this.$router.push({ path: '/message/sendMsg' })
    },
    sureMsg(flag) {
      this.moveShow = flag
      const ids = this.removeRd.map(res => {
        return res.ms_id
      })
      remove(ids.join(',')).then(res => {
        this.getListData('', true)
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    confireMsg(flag) {
      this.moveShow = flag
    },
    stateFormatter(row, column) {
      const states = row.state
      if (states === '0') {
        return '草稿'
      } else if (states === '1') {
        return '发布中'
      } else {
        return '已过期'
      }
    },
    getListData(param, flag) {
      if (flag) {
        param = {
          'pageNumber': 1,
          'pageSize': 12,
          'status': [0, 1, 2]
        }
        if (this.startMsgTime !== '' && this.endMsgTime !== '') {
          param.startDate = getTime(this.startMsgTime)
          param.endDate = getTime(this.endMsgTime)
        }
      }
      if (this.factype === '1') {
        param.typeL = '1100'
      } else if (this.factype === '2') {
        param.typeL = '1200'
      }
      const params = param
      getAllList(params).then(res => {
        if (!res.success) {
          this.haveData = false
          this.tableData = []
          return
        } else {
          this.haveData = true
        }
        const dataList = res.data.responses
        this.tableData = dataList
        this.totalNum = res.data.totalCount
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    changeStatus(id) {
      checkStatus(id).then(res => {

      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    memoReplace(memo) {
      var reg = /<\/?.+?\/?>/g
      var titleConten = memo.replace(reg, '')
      titleConten = titleConten.replace(/&nbsp;/ig, '')
      return titleConten
    }
  }
}
</script>

<style lang="scss">
  @import "~@/styles/btn.scss";
  .messageIndex{
          font-size: 12px;
    width: 100%;
    padding: 18px 16px 0;
    .blockMsg {
      padding:  0 24px 10px;
      border-radius: 4px;
      min-height: 100px;
      border:1px solid #00eeee;
      background: rgba(0,54,77,.3);
      background-image: radial-gradient(rgba(1,34,49,0.5), rgba(2,160,219,0.2));}
    .msgTop{
      .msgTp{
        margin-top: 8px;
      }
      .btn{
        margin-top: 8px;
          cursor: pointer;
          span{
              font-size: 14px;
              border-radius: 3px;
              display: inline-block;
              width: 84px;
              height: 34px;
              background: transparent;
              border:1px solid #50dcf5;
              text-align: center;
              line-height: 34px;
              color:#00eeee;
              &:last-child{
                margin-left:12px;
              }
          }
        .active{
          background: #53e3fd;
          color: #fff
        }
      }
      .block{
        display: inline-block;
        margin-top: 10px;
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
          width: 187px;
        }
      }
      .toGo{
        color: #00eeee;
        margin: 0 10px;
          font-size: 14px;
      }
      .sendAllBtn{
        display: inline-block;
        margin-left:50px;
      }
    }
    .msgBom{
      .btn-all{
        padding:0
      }
      margin-top: 10px;
      height: 682px;
      .tableShow{
        margin-top: 2px;
      }
      .button-tool{
        float: left;
      }
      .el-table .cell{
          height: 43px;
          line-height: 43px;
          border-bottom:1px solid rgba(80,220,245,0.39);
        }
      .el-table th>.cell{
        border: none
      }
      .btn{
        width: 100%;
          // cursor: pointer;
          margin-top: 14px;
          &>span{
              font-size: 14px;
              border-radius: 3px;
              display: inline-block;
              padding: 0 14px;
              height: 34px;
              background: transparent;
              border:1px solid #50dcf5;
              text-align: center;
              line-height: 34px;
              color:#00eeee;
              margin-right: 16px;
          }

        .sendAllBtn{
          float: right;
          right: 0;
          .sends{
            margin-left: 20px
          }
        }
      }
      thead tr th:nth-child(3) .cell{
        text-align: left;
        margin-left: 10px
      }
      .tableContent{
        padding:0 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        position: relative;
        text-align: left;
        .board{
          font-weight: bold;
          margin-right: 6px;
        }
        .momoLeft{
          margin-left:6px;
        }
        .redBoard{
          display: inline-block;
          width: 8px;
          height: 8px;
          background: red;
          border-radius: 50%;
          position: absolute;
          top: 18px;
          right: 1px;
          cursor: pointer;
        }
      }
    }
    .searchs{
      margin-left: 50px;
    }
  }
</style>

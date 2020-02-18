<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="sendMsg">
    <el-form-item label="通知标题 : " prop="topic" class="mgItem">
      <el-input v-model="ruleForm.topic" class="tpc" placeholder="请输入通知标题" />
    </el-form-item>
    <el-form-item label="通知类型 : " required>
      <el-form-item prop="typeL" class="typeTime">
        <el-select v-model="ruleForm.typeL" placeholder="请选择" popper-class="select-option" @change="changeType">
          <el-option v-for="(item,index) in typeLs" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item prop="typeS" class="typeTime">
        <el-select v-model="ruleForm.typeS" placeholder="请选择" popper-class="select-option" class="nextSelect">
          <el-option v-for="(item,index) in typeSs" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item label="发布人 : " prop="sendPeople" class="mgItem">
      <el-input v-model="ruleForm.sendPeople" class="shortInput tpc" placeholder="请输入发布人" />
    </el-form-item>
    <el-form-item label="编辑时间 : " prop="startMsgTime" class="mgItem">
      <el-date-picker
        v-model="ruleForm.startMsgTime"
        type="datetime"
        placeholder="请选择编辑时间"
        prefix-icon="iconfont iconrili"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
    </el-form-item>
    <el-form-item label="生效时间 : " prop="endMsgTime" class="mgItem">
      <el-date-picker
        v-model="ruleForm.endMsgTime"
        type="datetime"
        placeholder="请选择生效时间"
        prefix-icon="iconfont iconrili"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
    </el-form-item>

    <!-- <el-row class="bk">
      <span class="named"><span class="must">*</span> </span><el-input v-model="topic" placeholder="请输入标题" class="tpc" />
    </el-row>
    <el-row class="bk">
      <span class="named"><span class="must">*</span> : </span>
      <el-select v-model="typeL" placeholder="请选择" popper-class="select-option" @change="changeType">
        <el-option v-for="(item,index) in typeLs" :key="index" :label="item" :value="item" />
      </el-select>
      <el-select v-model="typeS" placeholder="请选择" popper-class="select-option" class="nextSelect">
        <el-option v-for="(item,index) in typeSs" :key="index" :label="item" :value="item" />
      </el-select>
    </el-row>
    <el-row class="bk">
      <span class="named"><span class="must">*</span>发布人 : </span><el-input v-model="sendPeople" placeholder="请输入发布人" class="shortInput tpc" />
    </el-row>
    <el-row class="bk">
      <span class="named"><span class="must">*</span>编辑时间 : </span>
      <el-date-picker
        v-model="startMsgTime"
        type="datetime"
        placeholder="请选择编辑时间"
        prefix-icon="iconfont iconrili"
      />
    </el-row>
    <el-row class="bk">
      <span class="named"><span class="must">*</span>生效时间 : </span>
      <el-date-picker
        v-model="endMsgTime"
        type="datetime"
        placeholder="请选择生效时间"
        prefix-icon="iconfont iconrili"
      />
    </el-row> -->

    <el-row class="bk">
      <span class="named">通知内容 : </span>
      <div id="summernote" class="showSend" />
    </el-row>
    <el-row class="bk">
      <span class="named"><span v-if="sendImg" class="must">* </span>图片上传 : </span>
      <div class="sendAllBtn">
        <span v-show="imgReplaceShow" @click="imageUpload"><span class="iconfont iconshangchuan" />上传图片</span>
        <div v-show="!imgReplaceShow">
          <img id="imgShow" src="">
          <el-button id="replaceImg" size="small" class="button-sub" @click="replaceImage">替 换</el-button>
        </div>
      </div>
      <input id="uploadfile" type="file" style="display:none" accept="image/*" @change="getImageChange">
      <input id="replaceImgfile" type="file" style="display:none" @change="getReplaceImg">
    </el-row>
    <el-row class="bk">
      <span class="named">附件上传 : </span>
      <div class="sendAllBtn">
        <span v-show="wordReplaceShow" @click="wodUpload"><span class="iconfont iconshangchuan" />上传附件</span>
        <div v-show="!wordReplaceShow">
          <span>{{ fileName }}</span>
          <el-button id="replaceWord" size="small" class="button-sub" @click="replaceWord">替 换</el-button>
        </div>
      </div>
      <input id="uploadWod" type="file" style="display:none" @change="getWodChange">
      <input id="replaceWordfile" type="file" style="display:none" @change="getReplaceWod">
    </el-row>
    <el-row class="bk">
      <span class="named">发布方式 : </span>
      <el-checkbox-group v-model="checkList" class="checkBoxs">
        <el-checkbox label="平台" disabled />
        <el-checkbox label="APP" disabled />
      </el-checkbox-group>
    </el-row>
    <el-row class="bk">
      <span class="named"><span class="must">* </span>通知区域 : </span>
      <div class="region boderBlock">
        <el-table
          ref="multipleTable"
          height="400"
          :data="tableData"
          class="leftList boderBlock"
          style="width:316px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="数据域"
            prop="name"
            width="258"
          /></el-table>
        <div class="boardTree boderBlock">
          <el-tree
            ref="leftTreeData"
            :data="leftTreeData"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="defaultProps"
            class="sendTree boderBlock"
            :default-checked-keys="regionId"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span v-if="data.children">
                <i class="iconfont iconzuzhi" />{{ node.label }}
              </span>
              <span v-else>
                <i class="iconfont iconbumen" />{{ node.label }}
              </span>
            </span>
          </el-tree>
          <ul class="sendList boderBlock">
            <li v-for="(item,index) in peopleName" :key="index">{{ item.name }}</li>
            <span v-if="regionShow">暂无数据</span>
          </ul>
        </div>
      </div>
    </el-row>
    <div class="btnSubmit">
      <div class="sendAllBtn">
        <el-button v-preventReClick="1000" size="small" class="button-sub" @click="submits(0,'ruleForm')">保存</el-button>
        <el-button v-preventReClick="1000" size="small" class="button-sub" @click="submits(1,'ruleForm')">保存并发布</el-button>
        <el-button size="small" class="button-cancle" @click="closeTab">退出</el-button>
      </div>
    </div>
  </el-form>
</template>
<script>
import $ from 'jquery'
import { searchReagn, searchUser, subFJ, removeFJ, addMsg, getContent } from '@/api/message'
// import { getTime } from '@/utils/time'
import common from '@/utils/common'
export default {
  name: 'SendMsg',
  data() {
    return {
      ruleForm: {
        topic: '',
        typeL: '',
        typeS: '',
        sendPeople: this.$store.getters.name, // 发布人
        startMsgTime: '',
        endMsgTime: ''
      },
      rules: {
        topic: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        typeL: [
          { required: true, message: '请选择通知类型', trigger: 'change' }
        ],
        typeS: [
          { required: true, message: '请选择通知类型', trigger: 'change' }
        ],
        sendPeople: [
          { required: true, message: '请输入发布人', trigger: 'blur' }
        ],
        startMsgTime: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        endMsgTime: [
          { type: 'string', required: true, message: '请选择结束时间', trigger: 'blur' }
        ]
      },
      typeLs: ['系统通知', '企业信息'],
      typeSs: [],
      typeOne: ['更新', '运行', '通知'],
      typeTwo: ['企业新闻'],
      checkList: ['平台'],
      tableData: [],
      leftTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      peopleName: [],
      sendImg: false, // 是否显示
      region: [], // 通知区域
      regionShow: true,
      regionId: [],
      msId: null,
      appendixId: null,
      appendixPath: '',
      appendixImgId: null,
      appendixImgPath: '',
      imgReplaceShow: true,
      wordReplaceShow: true,
      fileName: '',
      cgId: null
    }
  },
  activated() {
  },
  mounted() {
    $('#summernote').summernote({
      height: 352,
      width: 1280,
      lang: 'zh-CN',
      placeholder: '请输入内容',
      fontNames: ['宋体', '微软雅黑', '楷体', '黑体', '隶书', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
        'Helvetica Neue', 'Helvetica', 'Impact', 'Lucida Grande',
        'Tahoma', 'Times New Roman', 'Verdana'],
      minHeight: 300,
      maxHeight: null,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'clear']],
        ['fontname', ['fontname']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph', 'height']],
        ['table', ['table']],
        ['insert', ['fileBtn', 'media', 'link', 'picture', 'video']],
        ['view', ['fullscreen']]
      ],
      buttons: {
      // fileBtn: template()
      },
      callbacks: {
        onImageUpload: function(files, editor, $editable) {
          // debugger
          var file = files[0] // 获取选择的文件，这里是图片类型
          var dataUrl
          var reader = new FileReader()
          reader.readAsDataURL(file) // 读取文件并将文件以URL的形式保存在resulr属性中 base64格式
          reader.onload = function(e) { // 文件读取完成时触发
            var result = e.target.result // base64格式图片地址
            var image = new Image(); image.src = result // 设置image的地址为base64的地址
            // $('#sendContent').summernote('insertNode', image);
            image.onload = function() {
              var canvas = document.createElement('canvas')
              var context = canvas.getContext('2d')
              canvas.width = image.width // 设置canvas的画布宽度为图片宽度
              canvas.height = image.height
              context.drawImage(image, 0, 0, image.width, image.height) // 在canvas上绘制图片
              dataUrl = canvas.toDataURL('image/jpg', 0.42) // 0.92为压缩比，可根据需要设置，设置过小会影响图片质量
              // dataUrl 为压缩后的图片资源，可将其上传到服务器
              image.src = dataUrl
              // $('#sendContent').summernote('insertNode', image)
              // $('#sendContent').summernote('insertNode', image);
            }
            $('#summernote').summernote('insertNode', image)
          }
        }
      }
    })
    $.each($('.note-popover.popover'), function(item) {
      $(this).hide()// 去除浮框
    })
    this.searchRegin()

    var queryId = this.$route.query.id
    if (queryId) {
      this.cgId = queryId
      this.getAll(queryId)
    }
  },
  methods: {
    changeType() {
      if (this.ruleForm.typeL === '系统通知') {
        this.typeSs = this.typeOne
        this.sendImg = false
      } else {
        this.typeSs = this.typeTwo
        this.sendImg = true
      }
      this.ruleForm.typeS = ''
    },
    // 设置保存发送后台数据事件
    submits(state, formName) {
      if (this.ruleForm.typeL === '企业信息') {
        if (!this.appendixImgId) {
          this.$message.error('请上传图片')
          return
        }
      }
      if (this.region.length === 0) {
        this.$message.error('请选择通知区域')
        return
      }
      var publishTime = new Date(this.ruleForm.startMsgTime.replace(/-/g, '/'))
      var invalidTime = new Date(this.ruleForm.endMsgTime.replace(/-/g, '/'))
      var dateDiff = invalidTime.getTime() - publishTime.getTime()
      if (dateDiff < 0) {
        this.$message.error('生效时间要大于编辑时间!')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var bigL, smallL
          if (this.ruleForm.typeL === '企业信息') {
            bigL = '1200'
            smallL = '1201'
          } else {
            bigL = '1100'
            if (this.ruleForm.typeS === '更新') {
              smallL = '1101'
            } else if (this.ruleForm.typeS === '运行') {
              smallL = '1102'
            } else {
              smallL = '1103'
            }
          }
          const param = {
            'state': state,
            'typeL': bigL,
            'typeS': smallL,
            'topic': this.ruleForm.topic,
            'memo': $('#summernote').summernote('code'),
            'publishPer': this.ruleForm.sendPeople,
            'invalidTime': this.ruleForm.endMsgTime,
            'publishTime': this.ruleForm.startMsgTime,
            'pubWay': '0',
            'appendixId': this.appendixId,
            'appendixImgId': this.appendixImgId,
            'regionId': this.region
          }
          if (this.cgId) {
            param.msId = this.cgId
          } else if (state === 0) {
            param.msId = this.msId
          }
          addMsg(param).then(res => {
            if (res.success) {
              if (state === 0) {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '发布成功！'
                })
              }
              this.ruleForm.topic = ''
              this.ruleForm.typeL = ''
              this.ruleForm.typeS = ''
              this.ruleForm.sendPeople = this.$store.getters.name
              this.ruleForm.startMsgTime = ''
              this.ruleForm.endMsgTime = ''
              this.imgReplaceShow = true
              this.wordReplaceShow = true
              this.peopleName = []
              this.leftTreeData = []
              $('#summernote').summernote('code', '')
              this.searchRegin()
            }
          }).catch(res => {
            this.$message.error(res.msg)
          })
        } else {
          this.$message.error('请填写必填项')
          return false
        }
      })
    },
    // 查询数据域
    searchRegin() {
      searchReagn().then(res => {
        this.tableData = res.data
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    handleSelectionChange(val) {
      this.region = val.map(item => {
        return item.id
      })
      var that = this
      searchUser(that.region).then(res => {
        if (res.success) {
          that.leftTreeData = res.data.orgTree
          that.peopleName = res.data.userMap
          if (that.peopleName !== []) {
            that.regionShow = false
          }
          that.idGo(that.leftTreeData)
        } else {
          that.leftTreeData = []
          that.peopleName = []
          that.regionShow = true
        }
      }).catch(res => {
        that.$message.error(res.msg)
      })
    },
    // 递归id disabled
    idGo(arr) {
      var _this = this
      arr.map(item => {
        item.disabled = true
        if (item.checked === 'true') {
          _this.regionId.push(item.id)
        }
        if (item.children) {
          if (item.children.length > 0) {
            _this.idGo(item.children)
          }
        }
      })
    },
    // 图片附件上传
    imageUpload() {
      $('#uploadfile').click()
    },
    getImageChange() {
      this.imageChange($('#uploadfile'))
    },
    imageChange(targets) {
      var files = targets[0].files[0] // 获取文件信息
      var fileName = targets[0].files[0].name
      if (fileName.length > 30) {
        this.$message.error('您上传的图片名字过长!（限30字）')
        return
      }
      var myform = new FormData()
      var extendName = fileName.substring(fileName.lastIndexOf('.') + 1)

      if (!(extendName === 'jpg' || extendName === 'jpeg' || extendName === 'png' || extendName === 'bmp')) {
        this.$message.error('请上传图片附件')
        return
      } else {
        var reader = new FileReader() // 调用FileReader
        reader.onload = function(evt) { // 读取操作完成时触发。
          $('#imgShow').attr('src', evt.target.result) // 将img标签的src绑定为DataURL
        }
        reader.readAsDataURL(files) // 将文件读取为 DataURL(base64)
      }
      var types
      if (this.ruleForm.typeL === '系统通知') {
        types = '100'
      } else {
        types = '200'
      }
      var newName = '' + new Date().getTime() + files.name

      // var renameReportFile =new File([targets[0].files[0]],newName,{type:targets[0].files[0].type});
      var renameReportFile = new Blob([files])
      myform.append('file', renameReportFile, newName)
      // myform.append('file',renameReportFile);
      myform.append('attCode', '700')// 系统公告"700"  短信消息701
      myform.append('type', '1') //   1图片 0文档 2视频
      myform.append('connType', types)// 系统公告 100  企业信息200

      subFJ(myform).then(res => {
        if (res.success) {
          this.appendixImgId = res.data.id
          this.imgReplaceShow = false
          this.appendixImgPath = res.data.appendixPath
          const param = {
            id: this.appendixImgId,
            path: this.appendixImgPath
          }
          this.$store.commit('dashord/imgIdPaths', param)
        }
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    replaceImage() {
      $('#replaceImgfile').click()
    },
    getReplaceImg() {
      const param = {
        'id': this.appendixImgId,
        'appendixPath': this.appendixImgPath
      }
      removeFJ(param).then(res => {
        if (res.success) {
          this.imageChange($('#replaceImgfile'))
        }
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    // 附件上传
    wodUpload() {
      $('#uploadWod').click()
    },
    getWodChange() {
      this.worldChange($('#uploadWod'))
    },
    worldChange(targets) {
      var files = targets[0].files[0] // 获取文件信息
      var myform = new FormData()
      var fileName = targets[0].files[0].name
      var extendName = fileName.substring(fileName.lastIndexOf('.') + 1)

      if (!(extendName === 'xlsx' || extendName === 'docx' || extendName === 'xls')) {
        this.$message.error('请上传文档附件（格式为xlsx,docx,xls）')
        return
      } else {
        this.fileName = fileName
      }
      var types
      if (this.ruleForm.typeL === '系统通知') {
        types = '100'
      } else {
        types = '200'
      }
      var newName = '' + new Date().getTime() + files.name

      var renameReportFile = new Blob([files])
      myform.append('file', renameReportFile, newName)
      myform.append('attCode', '700')// 系统公告"700"  短信消息701
      myform.append('type', '0') //   1图片 0文档 2视频
      myform.append('connType', types)// 系统公告 100  企业信息200

      subFJ(myform).then(res => {
        if (res.success) {
          this.appendixId = res.data.id
          this.wordReplaceShow = false
          this.appendixPath = res.data.appendixPath
          const param = {
            id: this.appendixId,
            path: this.appendixPath
          }
          this.$store.commit('dashord/fjIdPaths', param)
        }
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    replaceWord() {
      $('#replaceWordfile').click()
    },
    getReplaceWod() {
      const param = {
        'id': this.appendixId,
        'appendixPath': this.appendixPath
      }
      removeFJ(param).then(res => {
        if (res.success) {
          this.worldChange($('#replaceWordfile'))
        }
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    // 草稿详情
    getAll(id) {
      getContent(id).then(res => {
        var msgSys = res.data.msgSys
        this.ruleForm.topic = msgSys.topic
        if (msgSys.typeL === '1100') {
          this.ruleForm.typeL = '系统通知'
          this.typeSs = this.typeOne
          if (msgSys.typeS === '1001') {
            this.ruleForm.typeS = '更新'
          } else if (msgSys.typeS === '1002') {
            this.ruleForm.typeS = '运行'
          } else {
            this.ruleForm.typeS = '通知'
          }
        } else {
          this.ruleForm.typeL = '企业信息'
          this.typeSs = this.typeTwo
          this.ruleForm.typeS = '企业新闻'
        }
        this.ruleForm.sendPeople = msgSys.publishPer
        this.ruleForm.startMsgTime = msgSys.publishTime
        this.ruleForm.endMsgTime = msgSys.invalidTime
        $('#summernote').summernote('pasteHTML', msgSys.memo)
        if (msgSys.appendixId !== '') {
          this.appendixId = msgSys.appendixId
          this.wordReplaceShow = false
          this.appendixPath = res.data.mslistSAD[0].appendixPath
          const lengths = res.data.mslistSAD[0].appendixName.length
          this.fileName = res.data.mslistSAD[0].appendixName.substring(13, lengths)
        }
        if (msgSys.appendixImgId !== '') {
          this.appendixImgId = msgSys.appendixImgId
          this.imgReplaceShow = false
          this.appendixImgPath = res.data.msImglistSAD[0].appendixPath
          $('#imgShow').attr('src', this.appendixImgPath)
        }
        var region_id = res.data.msRegionList.map(item => {
          return item.region_id
        })
        var that = this
        this.$nextTick(() => {
          that.tableData.forEach((item, index) => {
            if (region_id.indexOf(item.id) > -1) {
              that.$refs.multipleTable.toggleRowSelection(that.tableData[index], true)
            }
          })
        })
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    closeTab() {
      const vistedRouer = this.$store.state.tagsView.visitedViews
      if (this.appendixId) {
        const param = {
          'id': this.appendixId,
          'appendixPath': this.appendixPath
        }
        removeFJ(param).then(res => {
          if (res.success) {
            return
          }
        }).catch(res => {
          this.$message.error(res.msg)
        })
      }
      if (this.appendixImgId) {
        const param = {
          'id': this.appendixImgId,
          'appendixPath': this.appendixImgPath
        }
        removeFJ(param).then(res => {
          if (res.success) {
            return
          }
        }).catch(res => {
          this.$message.error(res.msg)
        })
      }
      common.closeCurrentTab(vistedRouer, this.$route)
    }
    // 删除附件，不保存时
  }
}
</script>
<style lang='scss'>
  @import "~@/styles/btn.scss";
  @import "~@/styles/message/sendMsg.scss";
  .note-placeholder{
    color:#ccc;
  }
</style>

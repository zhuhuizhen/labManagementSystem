<template>
  <div class="msgMore">
    <p class="topic">{{ allList.topic }}</p>
    <p class="nameTime"><span>发布人：{{ allList.publishPer }}</span><span>时间：{{ time }}</span></p>
    <div class="msgContent" v-html="allList.memo" />
    <p v-if="showFj" class="msgFj">
      <span class="iconfont iconx-accessory" />
      <span class="fj">附件：</span><span class="fjName">{{ mslistSAD[0].appendixName.substring(13, nameLength) }}</span>
      <span class="btn" @click="lookFile">预览</span>
      <span class="btn" @click="downFile">下载</span>
      <a v-show="false" id="downFile" />
    </p>
    <form v-show="false" />
    <!-- <iframe :src="url" width="20%" height="20%" />
    <iframe :src="url2" width="20%" height="20%" /> -->
  </div>
</template>
<script>
import { getContent } from '@/api/message'
// import axios from 'axios'
export default {
  name: 'MessageMore',
  data() {
    return {
      allList: {},
      mslistSAD: {},
      showFj: false,
      time: '',
      downFileUrl: '',
      downFileName: '',
      nameLength: 0,
      url: '',
      url2: ''
    }
  },
  activated() {
  },
  mounted() {
    var queryId = this.$route.query.id
    this.getAll(queryId)
  },
  methods: {
    getAll(id) {
      getContent(id).then(res => {
        this.allList = res.data.msgSys
        this.mslistSAD = res.data.mslistSAD
        this.time = this.allList.createTime
        if (this.mslistSAD) {
          if (this.mslistSAD.length > 0) {
            this.showFj = true
            this.nameLength = this.mslistSAD[0].appendixPath.length
          } else {
            this.showFj = false
          }
        }
      }).catch(res => {
        this.$message.error(res.msg)
      })
    },
    lookFile() {
      const param = {
        'appendixName': this.mslistSAD[0].appendixName,
        'appendixPath': this.mslistSAD[0].appendixPath
      }
      debugger
      fetch(this.$store.state.user.baseUrl + '/common/downloadFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.$store.state.user.token
        },
        body: JSON.stringify(param)
      })
        .then(res => res.blob())
        .then(data => {
          const blobUrl = window.URL.createObjectURL(data)
          console.log(blobUrl)
          // const bone = 'blob:http://localhost:9527/4d8e96d2-d9fc-4c18-a585-8f48d8bebb5b'
          // this.lookload(blobUrl)
          // console.log(encodeURIComponent(bone))
          // this.url = `pdf/web/viewer.html?file=` + encodeURIComponent(blobUrl)
          // this.url2 = `static/pdf/web/viewer.html?file=` + encodeURIComponent(blobUrl)
          // window.open('/pdf/web/viewer.html?file=/' + encodeURIComponent(blobUrl) + '.pdf')
          // window.open(blobUrl)
          // console.log(this.url)
        })
    },
    downFile() {
      const param = {
        'appendixName': this.mslistSAD[0].appendixName,
        'appendixPath': this.mslistSAD[0].appendixPath
      }
      // console.log(this.$store.state.user.baseUrl)
      fetch(this.$store.state.user.baseUrl + '/common/downloadFile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.$store.state.user.token
        },
        body: JSON.stringify(param)
      })
        .then(res => res.blob())
        .then(data => {
          const blobUrl = window.URL.createObjectURL(data)
          console.log(blobUrl)
          this.download(blobUrl)
        })
    },
    download(blobUrl) {
      const a = document.getElementById('downFile')
      const lengths = this.mslistSAD[0].appendixName.length
      a.download = this.mslistSAD[0].appendixName.substring(13, lengths)
      a.href = blobUrl
      a.click()
    }
  }
}
</script>
<style lang='scss' scoped>
.msgMore{
  padding:0 20px;
  p,ul{
    margin:0;padding: 0
  }
  font-size:14px;
  font-family:"微软雅黑";
  color:#fff;
  margin:16px 16px 0px;
  border:1px solid #00eeee;
  border-radius: 5px;
  height: 800px;
  .topic{
    font-size: 16px;
    text-align: center;
    margin-top: 32px;
  }
  .nameTime{
    text-align: center;
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    margin: 12px auto 32px;
    &>span{
      margin: 0 6px;
    }
  }
  .msgContent{
    height: 595px;
    overflow: auto;
    &::-webkit-scrollbar {display:none}
  }
  .msgFj{
    margin: 25px 0 0 32px;
    .fj{
      margin-left: 6px;
    }
    .fjName{
      color:#00eeee;
    }
    .btn{
      width: 56px;
      height: 32px;
      display: inline-block;
      border:1px solid #50dcf5;
      border-radius: 5px;
      text-align: center;
      line-height: 30px;
      margin-left: 12px;
      color:#00eeee;
      font-size: 12px;
      padding: 0;
      &:hover{
        background:rgba(39,130,159,1)!important;
        border:1px solid rgba(83,227,253,1)!important;
        color: #fff;
      }
    }
  }
}
</style>

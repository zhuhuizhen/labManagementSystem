<template>
  <div class="dialgAddform2">
    <p class="bkb" />
    <el-form ref="addForm" :model="addForm" label-width="130px" :rules="addFormRules">
      <el-row class="addtop">
        <el-col :span="12">
          <el-form-item label="区域ID:" prop="code">
            <el-input v-model="addForm.code" placeholder="请输入区域ID" />
          </el-form-item>
          <el-form-item label="区域负责人:" prop="manager">
            <el-input v-model="addForm.manager" auto-complete="off" placeholder="请输入区域负责人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="区域名称:" prop="name">
            <el-input v-model="addForm.name" placeholder="请输入区域名称" />
          </el-form-item>
          <el-form-item label="联系电话:" prop="phone">
            <el-input v-model="addForm.phone" autocomplete="off" placeholder="请输入区域联系电话" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述:" prop="remark">
            <el-input v-model="addForm.remark" type="textarea" placeholder="请输入备注" style="width:501px;margin-left:0px;margin-top:0px;height:70px" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div class="dialog-footer">
      <el-button size="medium" class="button-sub" @click.native="submitForm('addForm')">确定</el-button>
      <el-button size="medium" class="button-cancle" @click="handeladdFormVisible">取消</el-button>
    </div>
  </div>
</template>

<script>
// import { deptInfoEdit } from '@/api/manage.js'
import { deptInfoEdit } from '@/api/userManagement.js'
export default {
  props: {
    treeName: {
      type: String,
      default: () => ''
    },
    treeId: {
      type: String,
      default: () => ''
    },
    selectTree: {
      type: Object,
      default: () => {}
    }
    // treeName: String,
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      var myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // var myreg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入部门联系电话'))
      } else if (!myreg.test(value)) {
        callback(new Error('部门联系电话输入不正确'))
      } else {
        callback()
      }
    }
    var validatelevel = (rule, value, callback) => {
      var myreg = /^(0?[1-9]|1[0-9]|20)$/
      if (value === '') {
        callback(new Error('请输入显示顺序'))
      } else if (!myreg.test(value)) {
        callback(new Error('请输入1-20的整数显示顺序'))
      } else {
        callback()
      }
    }
    return {
      // 新增界面数据
      addForm: { manageName: '', code: '', name: '', type: '', contacts: '', phone: '', deptAddr: '', orderLevel: '', remark: '' },
      addFormVisible: false,
      addFormRules: {
        code: [{ required: true, message: '请输入部门编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择部门类型', trigger: 'blur' }],
        contacts: [{ required: true, message: '请输入部门联系人', trigger: 'blur' }],
        phone: [{ required: true, validator: validatePass1, trigger: 'blur' }],
        orderLevel: [{ required: true, validator: validatelevel, trigger: 'blur' }]
      },
      disabled: true,
      value: '', // 部门选择的type值
      selectData: [{ value: '0', name: '监控中心' }, { value: '1', name: '养护部门' }, { value: '2', name: '施工部门' }, { value: '3', name: '仓管部门' }],
      selectDataTrue: []
    }
  },
  mounted() {
    // console.log('name', this.treeName)
    this.addForm.manageName = this.treeName
    // console.log('selectTree', this.selectTree.children)
    const selcetfilter = []
    this.selectData.map(item => {
      this.selectTree.children.map(value => {
        if (value.type === item.value) {
          selcetfilter.push(item)
        }
      })
    })
    this.selectDataTrue = this.selectData.filter(item => {
      if (selcetfilter.indexOf(item) !== -1) {
        return false
      } else {
        return true
      }
    })
    // console.log(this.selectDataTrue)
    // }
  },
  methods: {
    // 取消新增
    handeladdFormVisible(addFormVisible) {
      this.$emit('handeladdFormVisible', this.addFormVisible)
      this.addForm = {}
    },
    // 提交新增
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = this.addForm
          param.manageId = this.treeId
          deptInfoEdit(param).then(response => {
            if (response.success === true) {
              this.$message.success('新增成功')
              // this.addForm.manageId = this.treeName
              this.$emit('handleGetTree1')
              this.handeladdFormVisible()
            } else {
              if (response.data !== '') {
                this.$message.error(response.data)
              } else {
                this.$message.error(response.msg)
              }
              // this.addForm.manageId = this.treeName
            }
          }).catch(response => {
            this.$message.error(response.message)
            // this.addForm.manageId = this.treeName
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    // 清空新增数据
    clearDate() {
      this.addForm = {}
    }
  }
}
</script>

<style lang="scss">
.dialgAddform2{
   .addtop{
      padding-top:18px;
   }
   .el-input__inner {
    // cursor: pointer;
    height: 34px;
    width: 166px;
   }
   .el-form-item__label{
     color:#00eeee;
   }
   //input框间隔
   .el-form-item {
    margin-bottom: 10px;
    .el-input{
      font-size: 12px;
      // input{
        // padding-left: 10px;
      // }
    }
  }
  .el-form-item__error{
    top:76%;
  }
  .el-form-item.is-success .el-input__inner{
    border-color: #00eeee;
  }
  .el-input.is-disabled .el-input__inner{
     background-color: transparent;
     border:1px solid rgba(80,220,245,1);
   }
   .dialog-footer{
     text-align: center;
     margin-top: 7px;
   }
   input::-webkit-input-placeholder {
      opacity: 0.5;
   }
   textarea::-webkit-input-placeholder {
      opacity: 0.5;
   }
   .el-textarea.el-input--medium .el-textarea__inner {
      height: 80px;
      font-size: 12px;
   }
}
</style>

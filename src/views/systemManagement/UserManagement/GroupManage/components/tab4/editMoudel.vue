<template>
  <div class="dialgEditform">
    <p class="bkb" />
    <el-form ref="editForm" :model="editForm" label-width="130px" :rules="editFormRules" class="formAdd">
      <el-row class="edittop">
        <el-col :span="12">
          <!-- <el-form-item label="所属部门:" prop="manageName">
            <el-input v-model="editForm.manageName" :disabled="disabled" />
          </el-form-item> -->
          <el-form-item label="班组ID:" prop="code">
            <el-input v-model="editForm.code" placeholder="请输入班组ID" />
          </el-form-item>
          <el-form-item label="班组人员::" prop="contactsOne">
            <el-input v-model="editForm.contactsOne" auto-complete="off" placeholder="请输入班组人员" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班组名称:" prop="name">
            <el-input v-model="editForm.name" placeholder="请输入班组名称" />
          </el-form-item>
          <el-form-item label="显示顺序:" prop="orderLevel">
            <el-input v-model="editForm.orderLevel" autocomplete="off" placeholder="请输入显示顺序" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述:" prop="remark">
            <el-input v-model="editForm.remark" type="textarea" placeholder="请输入备注" style="width:577px;margin-left:0px;margin-top:0px;height:70px" />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div class="dialog-footer">
      <el-button size="medium" class="button-sub" @click.native="submitForm('editForm')">确定</el-button>
      <el-button size="medium" class="button-cancle" @click="handeleditFormVisible('editForm')">取消</el-button>
    </div>
  </div>
</template>

<script>
// import { sysUnitsEdit } from '@/api/manage.js'
import { sysUnitsEdit } from '@/api/userManagement.js'
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    treeName: {
      type: String,
      default: () => ''
    },
    treeId: {
      type: String,
      default: () => ''
    },
    orgtype: {
      type: String,
      default: () => ''
    }
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      var myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // var myreg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入单位联系电话一'))
      } else if (!myreg.test(value)) {
        callback(new Error('单位联系电话一输入不正确'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      var myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // var myreg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入单位联系电话二'))
      } else if (!myreg.test(value)) {
        callback(new Error('单位联系电话二输入不正确'))
      } else {
        callback()
      }
    }
    var validatePass3 = (rule, value, callback) => {
      var myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // var myreg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入单位联系电话三'))
      } else if (!myreg.test(value)) {
        callback(new Error('单位联系电话三输入不正确'))
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
      // 编辑界面数据
      editForm: {
        manageName: '',
        code: '',
        name: '',
        type: '',
        addr: '',
        orderLevel: '',
        contactsOne: '',
        phoneOne: '',
        contactsTwo: '',
        phoneTwo: '',
        contactsThree: '',
        phoneThree: '',
        remark: ''
      },
      editFormRules: {
        code: [{ required: true, message: '请输入单位编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        type: [{ required: true, message: '单位类型', trigger: 'blur' }],
        orderLevel: [
          { required: true, validator: validatelevel, trigger: 'blur' }
        ],
        contactsOne: [
          { required: true, message: '请输入联系人一', trigger: 'blur' }
        ],
        phoneOne: [
          { required: true, validator: validatePass1, trigger: 'blur' }
        ],
        contactsTwo: [
          { required: true, message: '请输入单位联系人二', trigger: 'blur' }
        ],
        phoneTwo: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        contactsThree: [
          { required: true, message: '请输入单位联系人三', trigger: 'blur' }
        ],
        phoneThree: [
          { required: true, validator: validatePass3, trigger: 'blur' }
        ]
      },
      editFormVisible: false,
      disabled: true,
      value: ''
    }
  },
  watch: {
    row(newValue, oldVal) {
      this.editForm = Object.assign({}, newValue)
    }
  },
  mounted() {
    this.editForm = Object.assign({}, this.row)
    this.editForm.manageName = this.treeName
  },
  methods: {
    // 取消编辑
    handeleditFormVisible(formName) {
      this.$emit('handeleditFormVisible', this.editFormVisible)
      this.$refs[formName].resetFields()
      // this.$parent.visible = false
    },
    // 提交编辑页面
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const param = this.editForm
          param.manageId = this.treeId
          sysUnitsEdit(param)
            .then(response => {
              if (response.success === true) {
                this.$message.success('修改成功')
                this.$emit('handleGetTree1')
                // if (this.orgtype === '2' || this.orgtype === '3') {
                //   this.$emit('handleGetTree1')
                //   // this.$emit('handlOnlyTable')
                // } else {
                //   this.$emit('handleGetTree1')
                // }
                this.$emit('handeleditFormVisible', this.editFormVisible)
              } else {
                if (response.data !== '') {
                  this.$message.error(response.data)
                } else {
                  this.$message.error(response.msg)
                }
              }
            })
            .catch(response => {
              this.$message.error(response.message)
            })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.dialgEditform {
  .formAdd {
    padding-left: 40px;
  }
  .edittop {
    padding-top: 18px;
  }
  .el-input__inner {
    // cursor: pointer;
    height: 34px;
    width: 166px;
  }
  .el-form-item__label {
    color: #00eeee;
  }
  //input框间隔
  .el-form-item {
    margin-bottom: 10px;
    .el-input {
      font-size: 12px;
      // input{
      //   padding-left: 10px;
      // }
    }
  }
  .el-form-item__error {
    top: 76%;
  }
  .el-form-item.is-success .el-input__inner {
    border-color: #00eeee;
  }
  .dialog-footer {
    text-align: center;
    margin-top: 10px;
  }
  .el-input.is-disabled .el-input__inner {
    background-color: transparent;
    border: 1px solid rgba(80, 220, 245, 1);
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

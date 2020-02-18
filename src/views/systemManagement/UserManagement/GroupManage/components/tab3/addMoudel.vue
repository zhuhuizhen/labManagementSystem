<template>
  <div class="dialgAddform3">
    <p class="bkb" />
    <el-form ref="addForm" :model="addForm" label-width="140px" :rules="addFormRules" class="addtop">
      <el-form-item label="所属部门:" prop="manageName">
        <el-input v-model="addForm.manageName" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="班组名称:" prop="groupName">
        <el-input v-model="addForm.groupName" placeholder="请输入班组名称" />
      </el-form-item>
      <el-form-item label="人员(最多两个人):" prop="usernames">
        <el-select v-model="addForm.usernames" collapse-tags multiple popper-class="select-option" :multiple-limit="multipleLimit" clearable placeholder="-请选择人员-" @change="userChange">
          <el-option
            v-for="item in bZuser"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="显示顺序:" prop="orderLevel">
        <el-input v-model="addForm.orderLevel" autocomplete="off" placeholder="请输入显示顺序" />
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button size="medium" class="button-sub" @click.native="submitForm('addForm')">确定</el-button>
      <el-button size="medium" class="button-cancle" @click="handeladdFormVisible">取消</el-button>
    </div>
  </div>
</template>

<script>
// import { groupEdit } from '@/api/manage.js'
import { groupEdit } from '@/api/userManagement.js'
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
    bZuser: {
      type: Array,
      default: () => []
    }
    // treeName: String,
  },
  data() {
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
      addForm: { manageName: '', groupName: '', usernames: '', orderLevel: '' },
      addFormVisible: false,
      addFormRules: {
        groupName: [{ required: true, message: '请输入班组名称', trigger: 'blur' }],
        usernames: [{ required: true, message: '请输入人员', trigger: 'blur' }],
        orderLevel: [{ required: true, validator: validatelevel, trigger: 'blur' }]
      },
      disabled: true,
      userIds: [], // 选择人员时传参id
      multipleLimit: 2 // 人员选择最多选择两人
    }
  },
  mounted() {
    this.addForm.manageName = this.treeName
  },
  methods: {
    // 取消新增
    handeladdFormVisible(addFormVisible) {
      this.$emit('handeladdFormVisible', this.addFormVisible)
      this.addForm = {}
    },
    // 选择人员
    userChange(value) {
      // console.log('tag', value)
      this.userIds = value
    },
    // 提交新增
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = this.addForm
          param.deptId = this.treeId
          param.userIds = this.userIds
          groupEdit(param).then(response => {
            if (response.success === true) {
              this.$message.success('新增成功')
              this.handeladdFormVisible()
              this.$emit('handleGetTree1')
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
.dialgAddform3{
   .addtop{
      padding-top:18px;
      margin-left:60px;
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
      //   padding-left: 10px;
      // }
    }
  }
  .el-form-item__error{
    top:76%;
  }
  .el-form-item.is-success .el-input__inner{
    border-color: #00eeee;
  }
   .dialog-footer{
     text-align: center;
     margin-top: 25px;
   }
   .el-input.is-disabled .el-input__inner{
     background-color: transparent;
     border:1px solid rgba(80,220,245,1);
   }
   input::-webkit-input-placeholder {
      opacity: 0.5;
   }
    textarea::-webkit-input-placeholder {
      opacity: 0.5;
      font-size: 12px;
    }
}
</style>

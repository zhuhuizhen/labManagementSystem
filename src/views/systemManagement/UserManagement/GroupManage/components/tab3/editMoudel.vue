<template>
  <div class="dialgEditform3">
    <p class="bkb" />
    <el-form ref="editForm" :model="editForm" label-width="140px" :rules="editFormRules" class="edittop">
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属部门:" prop="manageName">
            <el-input v-model="editForm.manageName" :disabled="disabled" />
          </el-form-item>
          <el-form-item label="班组名称:" prop="groupName">
            <el-input v-model="editForm.groupName" placeholder="请输入班组名称" />
          </el-form-item>
          <el-form-item label="人员(最多两个人):" prop="usernames">
            <el-select v-model="editForm.userIds" collapse-tags multiple :multiple-limit="multipleLimit" popper-class="select-option" clearable placeholder="-请选择人员-" @change="userChange">
              <el-option
                v-for="item in bZuser"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="显示顺序:" prop="orderLevel">
            <el-input v-model="editForm.orderLevel" autocomplete="off" placeholder="请输入显示顺序" />
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
// import { groupEdit } from '@/api/manage.js'
import { groupEdit } from '@/api/userManagement.js'

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
    bZuser: {
      type: Array,
      default: () => []
    },
    userIds: {
      type: Array,
      default: () => []
    },
    usernames: {
      type: Array,
      default: () => []
    },
    orgtype: {
      type: String,
      default: () => ''
    }
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
      // 编辑界面数据
      editForm: { manageName: '', groupName: '', usernames: '', orderLevel: '' },
      editFormRules: {
        groupName: [{ required: true, message: '请输入班组名称', trigger: 'blur' }],
        usernames: [{ required: true, message: '请输入人员', trigger: 'blur' }],
        orderLevel: [{ required: true, validator: validatelevel, trigger: 'blur' }]
      },
      editFormVisible: false,
      disabled: true,
      value: '', // 选择人员的id
      multipleLimit: 2 // 人员选择最多选择两人
      // userIds: []// 人员选择对应的id
    }
  },
  watch: {
    row(newValue, oldValue) {
      this.editForm = Object.assign({}, newValue)
      // console.log('editroe', this.editForm)
    }
  },
  mounted() {
    this.editForm = Object.assign({}, this.row)
    this.editForm.manageName = this.treeName
    // console.log('editroe', this.editForm)
    // this.editForm.usernames = this.usernames
    // console.log('banzuuser', this.bZuser)
  },
  methods: {
    // 取消编辑
    handeleditFormVisible(formName) {
      this.$emit('handeleditFormVisible', this.editFormVisible)
      this.$refs[formName].resetFields()
      // this.$parent.visible = false
    },
    // 选择人员
    userChange(value) {
      // console.log('name', this.editForm.usernames)
      // console.log('tag', value)
      // this.userIds = value
      this.value = value
    },
    // 提交编辑页面
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // const param = this.row
          // param.deptId = this.treeId
          // param.userIds = this.userIds
          const param = { manageName: this.editForm.manageName, groupName: this.editForm.groupName, usernames: [], orderLevel: this.editForm.orderLevel,
            deptId: this.treeId, userIds: this.value || this.userIds, id: this.row.id
          }
          groupEdit(param).then(response => {
            if (response.success === true) {
              this.$message.success('修改成功')
              if (this.orgtype === '2' || this.orgtype === '3') {
                this.$emit('handleGetTree1')
                // this.$emit('handlOnlyTable')
              } else {
                this.$emit('handleGetTree1')
              }
              this.$emit('handeleditFormVisible', this.editFormVisible)
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
.dialgEditform3{
   .edittop{
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
     margin-top: 15px;
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

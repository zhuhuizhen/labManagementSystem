<template>
  <div class="UserManage-edit">
    <p class="bkb" />
    <el-tabs v-model="activeName">
      <!--新建人员基本信息-->
      <el-tab-pane label="基本信息" name="first">
        <div>
          <el-form ref="editForm" :model="row" label-width="90px" :rules="editFormRules" class="Basic-add">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="用户名:" prop="name">
                  <el-input v-model="row.name" placeholder="请输入姓名" />
                </el-form-item>
                <el-form-item label="工号:" prop="userCode">
                  <el-input v-model="row.userCode" placeholder="请输入工号" />
                </el-form-item>
                <el-form-item label="生日:" prop="birthday" class="birdate">
                  <!-- <el-input v-model="row.birthday" placeholder="请输入生日" /> -->
                  <div class="block">
                    <el-date-picker v-model="row.birthday" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期" prefix-icon="iconfont iconrili" style="width:60%;" />
                  </div>
                </el-form-item>
                <el-form-item label="联系方式:" prop="mobile">
                  <el-input v-model="row.mobile" autocomplete="off" placeholder="请输入联系方式" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="row.email" autocomplete="off" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                  <el-input v-model="row.password" autocomplete="off" placeholder="新建用户不用填" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="岗位:" prop="job">
                  <el-input v-model="row.job" auto-complete="off" placeholder="请输入岗位" />
                </el-form-item>
                <el-form-item label="职务:" prop="userPosition">
                  <el-input v-model="row.userPosition" autocomplete="off" placeholder="请输入职务" />
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                  <el-select v-model="row.sex" popper-class="select-option" placeholder="-请选择性别-">
                    <el-option label="-请选择-" value="" />
                    <el-option label="男" value="1" />
                    <el-option label="女" value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item label="账号状态:" prop="available">
                  <el-select v-model="row.available" popper-class="select-option" placeholder="-请选择账号状态-">
                    <el-option label="-请选择-" value="" />
                    <el-option label="启用" value="1" />
                    <el-option label="未启用" value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item label="在职状态:" prop="active">
                  <el-select v-model="row.active" popper-class="select-option" placeholder="-请选择在职状态-">
                    <el-option label="-请选择-" value="" />
                    <el-option label="在职" value="1" />
                    <el-option label="离职" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="描述:" prop="remark">
                  <el-input v-model="row.remark" type="textarea" placeholder="请输入用户描述" style="width:580px;margin-left:0px;height:70px" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row class="dialog-footer">
            <el-button size="small" class="button-sub" @click.native="submitUserForm('editForm')">下一步</el-button>
          </el-row>
        </div>
      </el-tab-pane>
      <!--角色信息-->
      <el-tab-pane label="角色" name="second">
        <div>
          <!-- <div>
            <el-form ref="form1" :model="formRole" size="small" label-width="110px">
              <el-row>
                <el-col :span="8" style="margin-left:-38px">
                  <el-form-item label="角色名：">
                    <el-input v-model="formRole.name" placeholder="请输入角色名" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-button size="small" class="button-sub" style="margin-left:-80px;" @click="handleSelectRole">查询</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div> -->
          <div class="button-tool" style="margin-top:5px;margin-bottom:5px;float:left">
            <el-button icon="iconfont iconxinzeng" size="small" @click="AddtwoRole">新增</el-button>
            <el-button icon="iconfont iconshanchu" size="small" @click="handletwoDelRole">批量删除</el-button>
          </div>
          <div>
            <el-table ref="multipRole" class="addShow" height="360" :data="tableDataRole" @selection-change="handleSelcRoleChange">
              <el-table-column type="selection" width="60" />
              <el-table-column type="index" label="序号" />
              <el-table-column prop="name" label="角色名" />
              <el-table-column prop="description" label="描述" />
            </el-table>
          </div>
          <div class=" dialog-footer nextfooter">
            <el-button size="small" class="button-sub" @click.native="submitRoleForm">下一步</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!--所属数据域-->
      <el-tab-pane label="所属数据域" name="third">
        <div>
          <div class="button-tool" style="margin-top:5px;margin-bottom:5px;float:left">
            <el-button icon="iconfont iconxinzeng" size="small" @click="AddtwoRegion">新增</el-button>
            <el-button icon="iconfont iconshanchu" size="small" @click="handletwoDelRegion">批量删除</el-button>
          </div>
          <div>
            <el-table ref="multipRegion" height="360" :data="tableDataRegion" @selection-change="handleSelcRegionChange">
              <el-table-column type="selection" width="60" />
              <el-table-column type="index" label="序号" width="150" />
              <el-table-column prop="name" label="名称" />
              <el-table-column prop="description" label="描述" />
            </el-table>
          </div>
          <div class="dialog-footer nextfooter">
            <el-button size="small" class="button-sub" @click.native="submitForm">保存</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--再次弹出框人员修改里边的新增角色-->
    <el-dialog v-if="AddtwoRoleFormVisible" v-model="AddtwoRoleFormVisible" append-to-body title="选择角色" :close-on-click-modal="false" :visible.sync="AddtwoRoleFormVisible" :before-close="RoleAddteoClose" class="deviceAdd editHeight" width="900px">
      <p class="bkb" />
      <div>
        <div class="addAtop">
          <el-form ref="formRoleAdd" :model="formRoletwoAdd" size="small" label-width="110px">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="关键字：">
                  <el-input v-model="formRoletwoAdd.name" placeholder="请输入角色名" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button size="small" class="button-sub" style="margin-left:-80px;" @click="selseAddTwoRole">查询</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button size="small" class="button-sub" style="margin-left:-120px;" @click="AddTwoRoleOK">确认</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="AddBorder">
          <el-table ref="multipleTwoRole" height="370" :data="AddtwoRoletable" @selection-change="SelcTwoRoleChange">
            <el-table-column type="selection" width="60" />
            <el-table-column type="index" label="序号" />
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="description" label="描述" />
          </el-table>
          <div class="numListJup margin-jump">
            <el-pagination
              :page-size="pageSize"
              layout="total,prev, pager, next, jumper"
              :total="totalCount"
              :pager-count="5"
              :current-page.sync="currentPage"
              @size-change="handleSizeRole"
              @current-change="handleCurrentRole"
            />
            <div class="sendAllBtn" @click="handleJumperRole">
              <span>跳转</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--再次弹出框人员修改里边的新增数据域-->
    <el-dialog v-if="AddtwoRegionFormVisible" v-model="AddtwoRegionFormVisible" append-to-body title="选择数据域" :close-on-click-modal="false" :visible.sync="AddtwoRegionFormVisible" :before-close="RegionAddteoClose" class="deviceAdd editHeight" width="900px">
      <p class="bkb" />
      <div>
        <div class="addAtop">
          <el-form ref="formRegionAdd" :model="formRegiontwoAdd" size="small" label-width="110px">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="关键字：">
                  <el-input v-model="formRegiontwoAdd.name" placeholder="请输入数据域名" />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button size="small" class="button-sub" style="margin-left:-80px;" @click="selseAddTwoRegion">查询</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-button size="small" class="button-sub" style="margin-left:-120px;" @click="AddTwoRegionOK">确认</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="AddBorder">
          <el-table ref="multipleTwoRegion" height="390" :data="AddtwoRegiontable" @selection-change="SelcTwoRegionChange">
            <el-table-column type="selection" width="60" />
            <el-table-column type="index" label="序号" />
            <el-table-column prop="name" label="数据域名称" />
            <el-table-column prop="description" label="描述" />
          </el-table>
          <div class="numListJup margin-jump">
            <el-pagination
              :page-size="pageSizeRegion"
              layout="total,prev, pager, next, jumper"
              :total="totalCountRegion"
              :pager-count="5"
              :current-page.sync="currentPageRegion"
              @size-change="handleSizeRegion"
              @current-change="handleCurrentRegion"
            />
            <div class="sendAllBtn" @click="handleJumperRegion">
              <span>跳转</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectRoleByUserId, selectRegionByUserId, getRegionList, getRoleList, editUserAll } from '@/api/userManagement.js'
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      var myreg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // var myreg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入联系方式'))
      } else if (!myreg.test(value)) {
        callback(new Error('联系方式输入不正确'))
      } else {
        callback()
      }
    }
    return {
      disabled: true, // tabs是否禁用
      activeName: 'first', // tabs默认显示第一个用户基本信息
      editForm: { name: '', userCode: '', birthday: '', mobile: '', email: '', password: '', sex: '', available: '', active: '', remark: '', job: '', userPosition: '' },
      editFormRules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        userCode: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        birthday: [{ required: true, message: '请选择生日', trigger: 'blur' }],
        mobile: [{ required: true, validator: validatePass1, trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        available: [{ required: true, message: '请选择账号状态', trigger: 'blur' }],
        active: [{ required: true, message: '请选择在职状态', trigger: 'blur' }]
      },
      // formRole: { name: '' }, // 角色名查询
      tableDataRole: [], // 角色table数据
      tableDataRegion: [], // 数据域table数据
      totalCount: 0, // 角色总条数
      pageSize: 8, // 角色每页几条
      pageNumber: 1, // 角色第几页
      currentPage: 1, // 角色直接跳到第几页
      totalCountRegion: 0, // 数据域总条数
      pageSizeRegion: 8, // 数据域每页几条
      pageNumberRegion: 1, // 数据域第几页
      currentPageRegion: 1, // 数据域直接跳到第几页
      UserId: '', // 传参人员id
      roleIdList: [], // 添加角色id传参
      regionIdList: [], // 添加数据域id传参
      multipRole: [], // 选择table角色表格的一条或多条数据
      multipRegion: [], // 选择table数据域表格的一条或多条数据
      AddtwoRoleFormVisible: false, // 人员修改里边的角色新增是否显示
      AddtwoRegionFormVisible: false, // 人员修改里面的数据域新增是否显示
      formRoletwoAdd: { name: '' }, // 修改里面的新增角色查询
      formRegiontwoAdd: { name: '' }, // 修改里面的新增数据域查询
      AddtwoRoletable: [], // 新增的角色table表格数据
      AddtwoRegiontable: [], // 新增的数据域的table表格
      multipleTwoRole: [], // 新增的角色的table的ref值
      multipleTwoRegion: [], // 新增的数据域的table的ref值
      AllRoleList: [], // 角色全部的id
      reloselseid: [], // 新增角色选择要添加的角色id
      AllRegionList: [], // 数据域全部id
      regionselseid: [] // 新增数据域选择要添加的id
    }
  },
  mounted() {
    this.editForm = this.row
    this.getRole()
    this.getRegin()
  },
  methods: {
    // 根据用户ID查询所拥有的角色信息接口函数---下一步调用
    getRole() {
      this.UserId = this.row.id
      const paraRole = {
        userId: this.UserId
      }
      selectRoleByUserId(paraRole).then(response => {
        if (response.success === true) {
          this.tableDataRole = response.data
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 根据用户ID查询所拥有的数据域信息接口函数---下一步调用
    getRegin() {
      this.UserId = this.row.id
      const paraRegion = {
        userId: this.UserId
      }
      selectRegionByUserId(paraRegion).then(response => {
        if (response.success === true) {
          this.tableDataRegion = response.data
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 新建人员基本信息下一步 根据用户ID查询所拥有的角色信息接口  1
    submitUserForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 保存编辑的人员信息
          const paramUser = {
            flag: '0'
          }
          paramUser.sysUser = { name: this.editForm.name, userCode: this.editForm.userCode, mobile: this.editForm.mobile, email: this.editForm.email, password: this.editForm.password, sex: this.editForm.sex,
            available: this.editForm.available, active: this.editForm.active, remark: this.editForm.remark, birthday: this.editForm.birthday, job: this.editForm.job, userPosition: this.editForm.userPosition, id: this.row.id }
          editUserAll(paramUser).then(response => {
            if (response.success === true) {
              this.$message.success('修改人员信息成功')
              // 根据用户ID查询所拥有的角色信息接口
              this.getRole()
              this.activeName = 'second'
              this.$emit('clickAdd')
            } else {
              this.$message.error(response.msg)
            }
          }).catch(response => {
            this.$message.error(response.message)
          })
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    // 角色下一步  根据用户ID查询所拥有的数据域信息接口  2
    submitRoleForm() {
      if (this.tableDataRole.length === 0) {
        this.$message.error('请选择要修改的角色信息')
      } else {
      // 修改角色
        this.AllRoleList = []
        this.tableDataRole.map(value => {
          this.AllRoleList.push(value.id)
        })
        // this.UserId = this.row.id
        const paraAddrole = {
          flag: '1',
          roleIdList: this.AllRoleList
        }
        paraAddrole.sysUser = { id: this.row.id }
        editUserAll(paraAddrole).then(response => {
          if (response.success === true) {
            this.$message.success('保存成功')
            // 根据用户ID查询所拥有的数据域信息接口
            this.getRegin()
            this.activeName = 'third'
            this.$emit('clickAdd')
          } else {
            this.$message.error(response.msg)
          }
        }).catch(response => {
          this.$message.error(response.message)
        })
      }
    },
    // 保存  根据人员ID添加修改数据域  3
    submitForm() {
      if (this.tableDataRegion.length === 0) {
        this.$message.error('请选择修改的数据域信息')
      } else {
        this.AllRegionList = []
        this.tableDataRegion.map(value => {
          this.AllRegionList.push(value.id)
        })
        const paraAddregin = {
          flag: '2',
          regionIdList: this.AllRegionList
        }
        paraAddregin.sysUser = { id: this.row.id }
        editUserAll(paraAddregin).then(response => {
          if (response.success === true) {
            this.$message.success('保存成功')
            this.$emit('closeEdit')
            this.activeName = 'first'
            this.$emit('clickAdd')
          } else {
            this.$message.error(response.msg)
          }
        }).catch(response => {
          this.$message.error(response.message)
        })
      }
    },
    // 新增里面的新增 弹出要新增的角色的列表
    AddtwoRole() {
      this.AddtwoRoleFormVisible = true
      this.handelRoleList()
    },
    // 新增里面的新增 批量删除角色列表信息
    handletwoDelRole() {
      // console.log(this.multipRole, 444444)
      if (this.multipRole.length === 0) {
        this.$message.error('请选择要删除的角色')
      } else {
        this.tableDataRole = this.tableDataRole.filter(value => {
          if (this.multipRole.indexOf(value) !== -1) {
            return false
          } else {
            return true
          }
        })
      }
    },
    // 新增里面的新增 新增页面弹出的新增角色弹框里边的查询角色
    selseAddTwoRole() {
      this.handelRoleList()
    },
    // 新增里面的新增 点击x关闭新增角色弹框
    RoleAddteoClose(done) {
      done()
    },
    // 新增里面的新增 确认添加的角色信息
    AddTwoRoleOK() {
      if (this.multipleTwoRole.length === 0) {
        this.$message.error('请选择要添加的角色信息')
      } else {
        if (this.tableDataRole.length === 0) {
          this.tableDataRole = [...this.multipleTwoRole]
        } else {
          // 判断数据有没有添加
          const ifRole = []
          this.tableDataRole.map(item => {
            this.multipleTwoRole.map(value => {
              if (item.id === value.id) {
                ifRole.push(item)
              }
            })
          })
          if (ifRole.length > 0) {
            this.$message.error('该数据已添加')
          } else {
            this.tableDataRole = this.tableDataRole.concat(this.multipleTwoRole)
          }
        }
        this.AddtwoRoleFormVisible = false
      }
    },
    // 数据域新增弹出框显示  数据域列表
    AddtwoRegion() {
      this.AddtwoRegionFormVisible = true
      this.handelRegionList()
    },
    // 批量删除数据域列表
    handletwoDelRegion() {
      if (this.multipRegion.length === 0) {
        this.$message.error('请选择要删除的数据域')
      } else {
        this.tableDataRegion = this.tableDataRegion.filter(value => {
          if (this.multipRegion.indexOf(value) !== -1) {
            return false
          } else {
            return true
          }
        })
      }
    },
    // 新增里面查询新增的数据域列表
    selseAddTwoRegion() {
      this.handelRegionList()
    },
    // 数据域新增弹出框点击x
    RegionAddteoClose(done) {
      done()
    },
    AddTwoRegionOK() {
      if (this.multipleTwoRegion.length === 0) {
        this.$message.error('请选择要添加的数据域信息')
      } else {
        if (this.tableDataRegion.length === 0) {
          this.tableDataRegion = [...this.multipleTwoRegion]
        } else {
          // 判断数据有没有添加
          const ifRegion = []
          this.tableDataRegion.map(item => {
            this.multipleTwoRegion.map(value => {
              if (item.id === value.id) {
                ifRegion.push(item)
              }
            })
          })
          if (ifRegion.length > 0) {
            this.$message.error('该数据已添加')
          } else {
            this.tableDataRegion = this.tableDataRegion.concat(this.multipleTwoRegion)
          }
        }
        this.AddtwoRegionFormVisible = false
      }
    },
    // 角色  选择table表格事件
    handleSelcRoleChange(val) {
      this.roleIdList = []
      this.multipRole = val
      this.multipRole.map(value => {
        this.roleIdList.push(value.id)
      })
      // console.log('roleIdList', this.roleIdList)
    },
    // 数据域  选择table表格事件
    handleSelcRegionChange(val) {
      this.regionIdList = []
      this.multipRegion = val
      this.multipRegion.map(value => {
        this.regionIdList.push(value.id)
      })
      // console.log('regionIdList', this.regionIdList)
    },
    // 角色的新增角色 选择table事件
    SelcTwoRoleChange(val) {
      this.multipleTwoRole = val
      this.reloselseid = []
      this.multipleTwoRole.map(value => {
        this.reloselseid.push(value.id)
      })
      // console.log('xinzengzinztable', this.multipleTwoRole)
    },
    // 数据域的新增数据域 选择table事件
    SelcTwoRegionChange(val) {
      this.multipleTwoRegion = val
      this.regionselseid = []
      this.multipleTwoRegion.map(value => {
        this.regionselseid.push(value.id)
      })
      // console.log('xinzengzinztable', this.regionselseid)
    },
    // 角色 分页
    handleSizeRole(val) {
      this.pageSize = val
      this.handelRoleList()
    },
    // 角色 点击哪一页跳到哪一页
    handleCurrentRole(val) {
      this.pageNumber = val
      this.handelRoleList()
    },
    // 直接跳转到第几页
    handleJumperRole(currentPage) {},
    // 数据域 分页
    handleSizeRegion(val) {
      this.pageSizeRegion = val
      this.handelRegionList()
    },
    handleCurrentRegion(val) {
      this.pageNumberRegion = val
      this.handelRegionList()
    },
    handleJumperRegion(currentPageRegion) {},
    // 新增里面要新增的角色列表-----查询角色列表-----函数调用及分页调用
    handelRoleList() {
      const paRoleList = { pageSize: this.pageSize, pageNumber: this.pageNumber, status: '1', name: this.formRoletwoAdd.name }
      getRoleList(paRoleList).then(response => {
        if (response.success === true) {
          this.AddtwoRoletable = response.data.rows
          this.totalCount = response.data.totalCount
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    },
    // 新增里面要新增的数据域列表-----查询数据域列表-----函数调用及分页调用sortOrder: 'create_time', sortColumn: 'desc',
    handelRegionList() {
      const paRegionList = { pageSize: this.pageSizeRegion, pageNumber: this.pageNumberRegion, name: this.formRegiontwoAdd.name }
      getRegionList(paRegionList).then(response => {
        if (response.success === true) {
          this.AddtwoRegiontable = response.data.rows
          this.totalCountRegion = response.data.totalCount
        } else {
          this.$message.error(response.msg)
        }
      }).catch(response => {
        this.$message.error(response.message)
      })
    }
  }

}
</script>

<style lang="scss">
.UserManage-edit{
  .Basic-add{
  .el-input__inner {
      // cursor: pointer;
      height: 34px;
      width: 180px;
      padding-right: 0px;
   }
   margin-left:70px;
  }
  .el-input__prefix {
    position: absolute;
    height: 100%;
    left: 150px;
  }
  .el-tabs.el-tabs--top{
    margin-top: -10px;
  }
  .el-tabs__nav-wrap{
      padding-left: 20px;
      margin-top: 10px;
  }
  .el-tabs__item{
      font-size: 14px!important;
      &:hover{
          color:#00eeee;
      }
  }
  .el-tabs__nav-wrap::after{
      background-color:rgba(83,227,253,.4)!important;
  }
  .el-tabs__item{
      color:#fff;
  }
  .el-tabs__item.is-active{
      color:#00eeee;
  }
  .el-tabs__active-bar{
      background-color:#00eeee!important;
  }
  .el-badge__content{
      padding: 0 4px;
      line-height: 14px;
  }
  .dialog-footer{
     text-align: center;
  }
  .nextfooter{
    margin-top:12px;
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
  .el-input--prefix .el-input__inner {
    padding-left: 15px !important;
  }
  .el-form-item.is-success .el-input__inner{
    border-color: #00eeee;
  }
  .el-form-item__error{
    top:76%;
  }
  .el-form-item__label{
    font-size: 14px;
  }
  .el-textarea.el-input--medium .el-textarea__inner {
    height: 80px;
    font-size: 12px;
  }
}
.editHeight.el-dialog__wrapper .el-dialog{
      height: 570px!important;
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
      .el-form-item__label{
          font-size: 14px;
          color:#00eeee;
        }
      .addAtop{
        margin-top: 25px;
        margin-left: -5px;
      }
      .AddBorder{
        margin-left: 20px;
        margin-right: 20px;
      }
}
</style>
<style lang="scss" scoped>
 .el-table{
    border-radius: 5px;
    border: 1px solid #00eeee;
    .cell{
          border-bottom:1px solid #00eeee
        }
    .el-table th>.cell{
      border: none
    }
  }
  .el-tab-pane{
    padding:0 20px !important;
    // >div{
    //   height:460px;
    // }
  }
  input::-webkit-input-placeholder {
      opacity: 0.5;
   }
</style>

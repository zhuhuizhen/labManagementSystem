<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <div class="bgChange">
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
          :background-color="variables.menuBgActive"
        >
          <!-- :background-color="variables.menuBgActive" -->
          <sidebar-item
            v-for="route in permission_routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="tree-div">
      <div class="inline-div">
        <el-tree
          :data="treeData"
          default-expand-all
          :props="defaultProps"
          :render-content="renderContent"
          @node-click="handleNodeClick"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
// import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Hamburger from '@/components/Hamburger'

export default {
  components: { SidebarItem, Hamburger },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    // 隧道树的数据
    treeData() {
      return this.$store.getters.treeData
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 树节点被点击时触发事件   div弹框隐藏
    handleNodeClick(data) {
      if (data.children === undefined) {
        // 若选中的是父节点，则data.children是一个数组
        document.getElementsByClassName('tree-div')[0].style.display = 'none'
        this.$router.push({
          path: `/tunnelControl/tunnelTree/${data.id}`,
          query: { id: data.id, name: data.name }
        })
      }
    },
    renderContent(h, { node, data, store }) {
      if (node.level === 1) {
        // el-icon-minus
        // el-icon-plus
        return (
          <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
            <span style='display:flex;'>
              <i class='tunnel'></i>
              <span>{node.label}</span>
            </span>
          </span>
        )
      } else {
        return (
          <span style='flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;'>
            <span style='margin-left:50px;'>
              <span class='childrenNode'>{node.label}</span>
            </span>
          </span>
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-div >>> .el-tree-node__content:hover {
  background-color: #207087;
  color: #ffffff;
}
.tree-div >>> .el-tree-node__content {
  height: 32px;
}

.tree-div {
  // >>> .childrenNode {
  //   color: red;
  // }
  >>> .tunnel {
    background: url("../../../../public/img/tunnel.png") no-repeat center center;
    content: "";
    display: block;
    width: 15px;
    height: 15px;
    font-size: 15px;
    background-size: 15px;
    margin: 0 10px;
  }
  >>> .el-tree > .el-tree-node.is-expanded > .el-tree-node__content::before {
    content: "";
    border-left: 1px dashed #006a78;
    height: 9px;
    width: 1px;
    position: absolute;
    left: 15px;
    top: 22px;
  }
  >>> .el-tree-node__content {
    position: relative;
  }
  >>> .el-tree-node__children .el-tree-node__content::before {
    content: "";
    border-left: 1px dashed #006a78;
    height: 100%;
    width: 1px;
    position: absolute;
    left: 15px;
    top: -12px;
  }
  >>> .el-tree-node__children .el-tree-node__content::after {
    content: "";
    border-top: 1px dashed #006a78;
    height: 1px;
    width: 10px;
    position: absolute;
  }
  >>> .el-tree .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  >>> .el-tree .el-icon-caret-right:before {
    background: url("../../../../public/img/jia.png") no-repeat center center;
    content: "";
    display: block;
    width: 18px;
    height: 18px;
    font-size: 18px;
    background-size: 18px;
  }
  >>> .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    background: url("../../../../public/img/jian.png") no-repeat center center;
    content: "";
    display: block;
    width: 18px;
    height: 18px;
    font-size: 18px;
    background-size: 18px;
  }
  >>> .el-tree-node__expand-icon.is-leaf::before {
    display: none;
  }
  >>> .el-tree-node:focus > .el-tree-node__content {
    background-color: #207087;
    color: #ffffff;
  }
}
</style>

<style lang="scss" scoped>
.bgChange {
  background: linear-gradient(
    to bottom,
    rgba(1, 34, 49, 0.5) 0%,
    rgba(2, 160, 219, 0.15) 100%
  );
  width: 100%;
  height: 100%;
  color: rgba(255, 255, 255, 0.4);
}
.tree-div {
  display: none;
  background: #002A40;
  width: 210px;
  max-height: 83%;
  position: absolute;
  top: 120px;
  left: 100%;
  z-index: 10;
  overflow-y: auto;
  border: 1px solid #00eeee;
  .inline-div {
    background: linear-gradient(
      to bottom,
      rgba(1, 34, 49, 0.5) 0%,
      rgba(2, 160, 219, 0.15) 100%
    );
    width: 100%;
    padding-top: 6%;
    padding-bottom: 6%;
    // height: 100%;
    .el-tree {
      width: 100%;
      position: relative;
      cursor: default;
      color: rgba(255, 255, 255, 0.4);
      background: transparent;
      left: 0%;
      top: 4%;
    }
  }
}
.tree-div::-webkit-scrollbar {
    display: none;
}
</style>

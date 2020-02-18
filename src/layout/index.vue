<template>
  <div :class="classObj" class="app-wrapper">
    <div class="wapper-top">
      <navbar />
    </div>
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <!-- <navbar /> -->
        <tags-view v-if="needTagsView" />
      </div>
      <!-- <el-button style="margin-top:66px" @click="ceshi">测试点击报警</el-button> -->
      <app-main />
    </div>
    <!-- 报警弹出框 -->
    <warning-one v-if="warnOne" />
    <warning-two v-if="warnTwo" />
    <warning-three v-if="warnThree" />
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView, WarningOne, WarningTwo, WarningThree } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView,
    WarningOne,
    WarningTwo,
    WarningThree
  },
  mixins: [ResizeMixin],
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      warnOne: state => state.dashord.warnOne,
      warnTwo: state => state.dashord.warnTwo,
      warnThree: state => state.dashord.warnThree
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    // var data = {
    //   tunnelIds: ''
    // }
    // getTunnelTree(data).then(res => {
    //   this.treeData = res.data
    // })

    document.addEventListener('mouseup', function() {
      $(document).unbind('mousemove')
    }, true)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
    // ceshi() {
    //   this.$store.commit('dashord/setWarnThrees', true)
    // }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
  .wapper-top{
    z-index:9;
    height: 64px;
    width: 100%;
    position: fixed;
    background: linear-gradient(to bottom left, #0a2a3c, #0d3f56 50%, #0a2a3c);
    // box-shadow: 0 2px 6px rgba(0,0,0,.5);
  }
  .drawer-bg {
    // background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 64px;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }

</style>

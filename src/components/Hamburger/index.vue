<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <span v-show="showImg" class="iconfont iconjiantouarrow483" />
    <span v-show="!showImg" class="iconfont iconjiantouarrowhead7" />
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showImg: true
    }
  },
  methods: {
    toggleClick() {
      this.showImg = !this.showImg
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
span{
  cursor: pointer;
  color:rgba(255,255,255,.4);
}
</style>

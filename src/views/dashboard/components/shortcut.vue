<template>
  <div class="shortcuts">
    <headers :post-name="postName" @getMores="getMores" />
    <cut :short-all="shortAll" />
  </div>
</template>
<script>
import headers from './header'
import cut from './shortcut/cun'
import { getShort } from '@/api/dashboard'

export default {
  name: 'Shortcut',
  components: { headers, cut },
  data() {
    return {
      postName: {
        msg: '快捷方式',
        isRefersh: false,
        isToggle: false,
        isMore: true
      }
    }
  },
  computed: {
    shortAll() {
      // console.log(this.$store.state.dashord.shortcuts)
      return this.$store.state.dashord.shortcuts
    }
  },
  activated() {
  },
  mounted() {
    this.getShorts()
  },
  methods: {
    getShorts() {
      getShort().then(res => {
        const shortcutIds = res.data.shortcutIds
        // const shortcutIds = this.$store.state.dashord.indexData.data.shortcutIds
        if (shortcutIds) {
          if (shortcutIds.length !== 0) {
            this.$store.dispatch('dashord/addshort', shortcutIds.split(','))
          } else {
            this.$store.dispatch('dashord/addshort', [])
          }
        } else {
          this.$store.dispatch('dashord/addshort', [])
        }
      })
    },
    getMores() {
      this.$router.push({ path: '/shortCut' })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>

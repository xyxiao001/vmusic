<template>
  <div class="wraper">
    <p>功能最全的配置</p>
    <Vmusic></Vmusic>
  </div>
</template>

<script>
import Vmusic from '../components/Vmusic'
export default {
  data () {
    return {
    }
  },
  computed: {
  },
  components: {
    Vmusic
  },
  methods: {
  },
  // 页面进入执行
  mounted () {
  },
  // 页面切换
  destroyed () {
  }
}
</script>

<style lang="scss">
  html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p,
  blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em,
  img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, dl, dt,
  dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-weight: inherit;
    font-style: inherit;
    font-family: inherit;
    font-size: 100%;
    -webkit-tap-highlight-color:rgba(255,255,255,0);
    vertical-align: baseline;
    font-family: Arial,Helvetica,sans-serif;
  }

  .wraper {
    width: 600px;
    margin: auto;
  }
</style>

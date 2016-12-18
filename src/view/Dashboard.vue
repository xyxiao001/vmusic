<template>
  <div class="wraper">
    <h1 class="title">一个简约， 不简单的播放器！ <a class="url" href="https://github.com/xyxiao001/vmusic" target="_blank">goodboy</a></h1>
    <h3>类型1</h3>
    <Vmusic></Vmusic>
    <h3>类型2</h3>
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
    text-decoration: none;
    color: #666;
  }

  .wraper {
    max-width: 600px;
    margin: auto;

    .title {
      line-height: 40px;
      font-weight: bold;
      color: #666;
    }

    h3 {
      line-height: 35px;
    }

    a.url {
      text-shadow: 1px 2px 3px red;
    }
  }
</style>

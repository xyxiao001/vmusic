<template>
  <div class="v-music">
    <div class="v-content">
      <div
        class="v-pic"
        @click="play()"
        :style="{'background-image': 'url(' + pic + ')'}">
        <i class="iconfont"
          :title="msg"
          :class="{'icon-play': playing === false, 'icon-pause': playing === true}">
        </i>
      </div>
      <div class="v-info">
        <div class="v-search">
          <i class="iconfont icon-search"></i>
          <input type="text" placeholder="搜一搜" v-model="searchInput" @keyup.enter="goSearch">
        </div>
        <div class="v-theme">
          <i class="iconfont icon-theme"></i>
        </div>
        <div class="v-title">
          <span class="song">{{ songname }}</span>
          <span class="singer">- {{ singername }}</span>
        </div>
        <div class="v-lyr">
          <div class="lyr-text" ref="lyrText" v-show="false" v-html="lyr"></div>
          <div class="lyr-list" ref="lyr">
            <p
              v-for="(s, index) in lyrList"
              :class = "{'on': s.dis}">
              {{ s.txt }}
            </p>
          </div>
        </div>
        <div class="v-control">
          <div class="v-progress">
            <div class="v-bar" @click="jump($event)" ref="bar">
              <div class="v-line">
                <div class="v-line-to" ref="lineIn" :style="{'width': (nowTime / allTime) * 100 + '%'}">
                  <span class="v-point" @mousedown="drap($event)" @touchstart="drap($event)"></span>
                </div>
              </div>
            </div>
            <div class="v-des">
              <span>- {{ reslutTime }}</span>
              <div class="i-control volume">
                <div class="volume-progress" @click="changeVolume($event)" ref="volume">
                  <div class="volume-to" :style="{'height': this.volume * 100 + '%'}"></div>
                </div>
                <i class="iconfont icon-volume-max" title="音量"></i>
              </div>
              <div class="i-control">
                <i class="iconfont"
                  @click="changeType"
                  :title="this.type === 'loop' ? '单曲循环' : this.type === 'random' ? '随机播放' : '顺序播放'"
                  :class="{'icon-order': type === 'order',
                  'icon-loop': type === 'loop', 'icon-random': type === 'random'
                }">
                </i>
              </div>
              <div class="i-control">
                <i class="iconfont icon-menu" title="播放列表" @click="toogleList()"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="show-list" v-show="openList">
        <p  v-show="lists.length >= 1">本地歌曲</p>
        <ol v-show="lists.length >= 1">
          <li
            v-for="(item, $index) in lists"
            :class="{'on': now === $index && onLine === false}"
            @click="playItem($index)">
            <span class="v-cur" v-show="now === $index && onLine === false"></span>
            <span>{{ $index + 1 }}</span>
            <span class="song">{{ item.songname }}</span>
            <span class="singer">{{ item.singername }}</span>
          </li>
        </ol>
        <p v-show="search && searchInput.length > 0 || searchLists.length > 0">搜索歌曲</p>
        <ol class="search-list" v-show="search && searchInput.length > 0 || searchLists.length > 0" ref="search">
          <li
            v-for="(item, $index) in searchLists"
            :class="{'on': now === $index && onLine === true}"
            @click="playOnline($index)">
            <span class="v-cur" v-show="now === $index && onLine === true"></span>
            <span>{{ $index + 1 }}</span>
            <span class="song">{{ item.songname }}</span>
            <span class="singer">{{ item.singername }}</span>
          </li>
          <li style="text-align: center" @click="searchMore" v-if="!searchLoading">{{ searchMsg }}</li>
          <li style="text-align: center" v-else>加载中.....</li>
        </ol>
      </div>
    </div>
    <audio
      class="v-audio"
      :src="url"
      ref="music"
      @seeked="seeked"
      @canplay="updateTime()"
      @ended="next()"
      @pause="pause()"
      :loop="type === 'loop'">
    </audio>
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchLists: [],
      searchInput: '',
      searchFirst: true,
      searchLoading: false,
      page: 1,
      allPages: 0,
      openList: true,
      onLine: false,
      playing: false,
      pic: '',
      singername: '',
      songname: '',
      songId: '',
      nowTime: 0,
      now: -1,
      allTime: 0,
      msg: '播放',
      set: 0,
      type: 'order',
      lyr: '',
      lyrList: [],
      volume: 1,
      url: '',
      urlSearch: 'https://route.showapi.com/213-1?showapi_appid=26601&showapi_sign=adc05e2062a5402b81c563a3ced09208&keyword=',
      urlDetail: 'https://route.showapi.com/213-2?showapi_appid=26601&showapi_sign=adc05e2062a5402b81c563a3ced09208&musicid='
    }
  },
  props: {
    lists: {
      type: Array,
      default: () => {
        return []
      }
    },
    search: {
      type: Boolean,
      default: true
    },
    searchKey: {
      type: String,
      default: ''
    }
  },
  computed: {
    reslutTime () {
      // 生成时间展示
      var two = (data) => {
        var m = ~~(data / 60)
        var s = ~~(data % 60)
        m = m > 9 ? m : '0' + m
        s = s > 9 ? s : '0' + s
        return m + ':' + s
      }
      return two(this.nowTime) + ' / ' + two(this.allTime)
    },
    searchMsg () {
      var msg = this.page <= this.allPages ? '点击加载更多....' : '加载完了....'
      return msg
    }
  },
  watch: {
    playing () {
      if (this.playing === false) {
        this.$refs.music.pause()
        this.stop()
      } else {
        this.$nextTick(() => {
          // 暂停其他所有自己的播放器
          var list = document.querySelectorAll('.v-audio')
          list = [].slice.call(list)
          list.forEach((val) => {
            val.pause()
          })
          this.$refs.music.play()
          this.start()
        })
      }
    },
    volume () {
      this.$refs.music.volume = this.volume
    }
  },
  components: {
  },
  methods: {
    // 播放
    play () {
      if (this.songname === '') {
        return false
      }
      if (this.playing === true) {
        this.playing = false
        this.msg = '播放'
      } else {
        this.playing = true
        this.msg = '暂停'
      }
    },
    // 点击播放
    playItem (index) {
      if (index === this.now && this.onLine === false) {
        this.$nextTick(() => {
          this.play()
        })
      } else {
        this.onLine = false
        this.$refs.music.pause()
        this.now = index
        this.nowTime = 0
        this.songname = this.lists[index].songname
        this.singername = this.lists[index].singername
        this.lyr = this.lists[index].lyr
        this.url = this.lists[index].url
        this.pic = this.lists[index].img
        this.showLyr()
        // this.$refs.music.load()
        this.$nextTick(() => {
          if (this.playing === false) {
            this.playing = true
          } else {
            this.$refs.music.play()
          }
        })
      }
    },
    // 播放线上
    playOnline (index) {
      if (index === this.now && this.onLine === true) {
        this.$nextTick(() => {
          this.play()
        })
      } else {
        this.onLine = true
        this.$refs.music.pause()
        this.now = index
        this.nowTime = 0
        this.songname = this.searchLists[index].songname
        this.singername = this.searchLists[index].singername
        this.url = this.searchLists[index].m4a
        this.pic = this.searchLists[index].albumpic_big
        this.songId = this.searchLists[index].songid
        // this.$refs.music.load()
        this.lyrList = [
          {
            min: 999,
            sec: 999,
            ms: 999,
            total: 999,
            txt: '歌词正在疯狂加载中...'
          }
        ]
        // 执行请求歌词
        this.getLyr()
        this.$nextTick(() => {
          if (this.playing === false) {
            this.playing = true
          } else {
            this.$refs.music.play()
          }
        })
      }
    },
    // 展开列表
    toogleList () {
      this.openList = !this.openList
    },
    // 在线的请求歌词
    getLyr () {
      this.$http.get(this.urlDetail + this.songId).then((response) => {
        // 处理数据
        this.lyr = response.body.showapi_res_body.lyric
        this.showLyr()
      }, (response) => {
        console.error('请求失败！')
      })
    },
    // 暂停播放
    pause () {
      this.$refs.music.pause()
      this.playing = false
      this.msg = '播放'
      this.stop()
    },
    // 循环方式
    next () {
      var arr = this.onLine ? this.searchLists : this.lists
      switch (this.type) {
        case 'order':
          if (this.now + 1 > arr.length - 1) {
            this.onLine ? this.playOnline(0) : this.playItem(0)
          } else {
            this.onLine ? this.playOnline(this.now + 1) : this.playItem(this.now + 1)
          }
          break
        case 'random':
          this.onLine ? this.playOnline(this.randomNext()) : this.playItem(this.randomNext())
          break
        default:
          this.currentTime = 0
          break
      }
    },
    // 随机播放
    randomNext () {
      var l = this.onLine ? this.searchLists.length : this.lists.length
      var i = Math.floor(Math.random() * l)
      return i
    },
    // 改变播放模式
    changeType () {
      this.type === 'order' ? this.type = 'random' : this.type === 'random' ? this.type = 'loop' : this.type = 'order'
    },
    // 改变音量
    changeVolume (e) {
      var all = window.getComputedStyle(this.$refs.volume).height
      all = all.replace('px', '')
      if (e.target.className === 'volume-progress') {
        this.volume = ((all - e.offsetY) / all).toFixed(2)
      } else {
        this.volume = ((all - e.offsetY) / all * this.volume).toFixed(2)
      }
    },
    // 获取当前播放时间和总时间
    updateTime () {
      this.nowTime = this.$refs.music.currentTime
      this.allTime = this.$refs.music.duration
    },
    // 实时更新歌词
    updateLyr () {
      if (this.lyrList.length < 1) {
        return false
      }
      // 每次循环歌词 如果当前时间小于自己 那么显示上一个歌词
      var i = 0
      var loading = true
      this.lyrList.forEach((val, index) => {
        this.lyrList[index].dis = false
      })
      this.lyrList.forEach((val, index) => {
        if ((val.total - this.nowTime) > 0 && loading === true) {
          i = index - 1
          i = i > 0 ? i : 0
          loading = false
        } else {
          this.lyrList[index].dis = false
        }
      })
      this.lyrList[i].dis = true
      var nowLry = i - 1 > 0 ? i - 1 : 0
      this.$refs.lyr.style.transform = 'translate3d(0, -' + nowLry * 15 + 'px, 0)'
    },
    // 开始计时 并更新时间
    start () {
      if (this.songname === '') {
        return false
      }
      this.set = setInterval(() => {
        // 更新时间
        this.updateTime()
        // 更新展示歌词
        this.updateLyr()
      }, 100)
    },
    // 暂停计时
    stop () {
      clearInterval(this.set)
    },
    // 提取歌词 并展示
    showLyr () {
      if (this.lyr.length <= 0) {
        return false
      }
      this.$nextTick(() => {
        // 转义字符
        var lyrics = this.$refs.lyrText.innerHTML
        // 切割成数组
        lyrics = lyrics.split('\n')
        // console.log(lyrics)
        var lyrObj = []
        // 提取时间轴
        lyrics.forEach(function (val, index) {
          if (index > 4) {
            // 去除两边空格
            val = val.replace(/(^\s*)|(\s*$)/g, '')
            var obj = {}
            obj.min = ~~(val.substring(1, 3))
            obj.sec = ~~(val.substring(4, 6))
            obj.ms = ~~(val.substring(7, 9))
            obj.txt = val.substring(10, val.length)
            obj.txt = obj.txt.replace(/(^\s*)|(\s*$)/g, '')
            obj.dis = false
            obj.total = obj.min * 60 + obj.sec + obj.ms / 100
            if (obj.txt.length > 0) {
              lyrObj.push(obj)
            }
          }
          // 提取时间
          // var time = /[[\d:\d((.|)\d\])]/g.exec(val)
        })
        // 添加一个空的p
        lyrObj.push({min: 999, sec: 999, ms: 999, total: 999, txt: ''})
        this.lyrList = lyrObj
        // 第一个选中
        this.updateLyr()
      })
    },
    // 设置currentTime 之后
    seeked () {
      this.updateLyr()
    },
    // 单纯的点击跳转
    jump (e) {
      if (e.target.nodeName !== 'SPAN') {
        var go = e.offsetX
        // 得到要去的时间
        var all = window.getComputedStyle(this.$refs.bar).width
        all = all.replace('px', '')
        var time = ((go / all) * this.allTime).toFixed(3)
        this.$refs.music.currentTime = time
      }
    },
    // 准备拖拽
    drap (e) {
      // 先停止更新时间和歌词
      this.stop()
      e.preventDefault()
      this.oldX = e.clientX ? e.clientX : e.touches[0].clientX
      this.nowLine = window.getComputedStyle(this.$refs.lineIn).width
      this.nowLine = this.nowLine.replace('px', '')
      this.$refs.lineIn.style.transitionDuration = '0s'
      window.addEventListener('mousemove', this.move)
      window.addEventListener('touchmove', this.move)
      window.addEventListener('mouseup', this.leave)
      window.addEventListener('touchend', this.leave)
    },
    // 开始拖拽
    move (e) {
      var all = window.getComputedStyle(this.$refs.bar).width
      all = all.replace('px', '')
      this.nowX = e.clientX ? e.clientX : e.touches[0].clientX
      var end = Number(this.nowX - this.oldX) + Number(this.nowLine)
      end = end > all ? all : end < 0 ? 0 : end
      this.nowTime = Number(((end / all) * this.allTime).toFixed(3))
      // 拖拽时歌词
      this.updateLyr()
    },
    // 结束拖拽
    leave (e) {
      if (this.oldX !== 0) {
        this.oldX = 0
        this.$refs.music.currentTime = this.nowTime
        this.$refs.lineIn.style.transitionDuration = '0.05s'
      }
      window.removeEventListener('mousemove', this.move)
      window.removeEventListener('touchmove', this.move)
      window.removeEventListener('mouseup', this.leave)
      window.removeEventListener('touchend', this.leave)
      if (this.playing === true) {
        this.start()
      }
    },
    // 输入框搜索
    goSearch () {
      this.page = 1
      this.searchLoading = true
      this.$refs.search.scrollTop = 0
      this.searching()
    },
    // 执行搜索
    searching () {
      this.$http.get(this.urlSearch + this.searchInput + '&page=' + this.page).then((response) => {
        // 处理数据
        this.searchLoading = false
        this.page = response.body.showapi_res_body.pagebean.currentPage
        if (this.page > 1) {
          this.searchLists = this.searchLists.concat(response.body.showapi_res_body.pagebean.contentlist)
        } else {
          this.searchLists = response.body.showapi_res_body.pagebean.contentlist
        }
        this.allPages = response.body.showapi_res_body.pagebean.allPages
        if (this.searchFirst === true && this.lists.length === 0) {
          this.searchFirst = false
          this.playOnline(0)
          this.$nextTick(() => {
            this.playing = false
          })
        }
      }, (response) => {
        console.error('请求失败！')
      })
    },
    // 加载下一页
    searchMore () {
      if (this.page < this.allPages) {
        this.page += 1
        this.searching()
        this.searchLoading = true
      }
    }
  },
  mounted () {
    if (this.lists.length > 0) {
      this.nowTime = 0
      this.songname = this.lists[0].songname
      this.singername = this.lists[0].singername
      this.lyr = this.lists[0].lyr
      this.url = this.lists[0].url
      this.pic = this.lists[0].img
      this.showLyr()
      // this.$refs.music.load()
      this.updateTime()
      this.now = 0
    }
    // 如果传入搜索关键词 那么执行搜索
    if (this.searchKey.length > 0) {
      this.searchInput = this.searchKey
      this.searching()
    }
    this.volume = 0.5
  }
}
</script>

<style lang="scss">
  .v-music {
    position: relative;
    font-family: Arial,Helvetica,sans-serif;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);
    display: inline-block;
    font-size: 14px;
    width: 520px;
    overflow: hidden;

    .v-theme {
      position: absolute;
      top: 2px;
      right: 2px;
      cursor: pointer;

      i {
        color: #666;
      }
    }

    .v-search {
      position: absolute;
      top: 2px;
      right: 20px;

      i {
        position: absolute;
        bottom: 3px;
        left: 5px;
        font-size: 12px;
        color: #666;
      }

      input {
        font-size: 12px;
        outline: none;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        padding-left: 18px;
        width: 100px;
        color: #666;
      }
    }

    .v-pic {
      position: relative;
      display: inline-block;
      width: 95px;
      height: 95px;
      background-size: cover;

      i {
        color: white;
        font-size: 23px;
        cursor: pointer;
      }

      i.icon-play {
        position: absolute;
        right: 35%;
        bottom: 30%;
        font-size: 35px;
        animation: showPlay 0.2s ease-out;
      }

      i.icon-pause {
        position: absolute;
        right: 5%;
        bottom: 5%;
        animation: showPause 0.2s ease-out;
      }

      @keyframes showPlay {
        from {
          position: absolute;
          right: 5%;
          bottom: 5%;
          font-size: 23px;
        }

        to {
          position: absolute;
          right: 35%;
          bottom: 30%;
          font-size: 35px;
        }
      }

      @keyframes showPause {
        from {
          position: absolute;
          right: 35%;
          bottom: 30%;
          font-size: 35px;
        }

        to {
          position: absolute;
          right: 5%;
          bottom: 5%;
          font-size: 23px;
        }
      }
    }

    .v-info {
      float: right;
      width: 420px;
      height: 95px;
      overflow: hidden;
      padding: 10px 7px 5px 7px;
      box-sizing: border-box;

      .v-title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0 0 13px 5px;
        user-select: text;
        cursor: default;
        padding-bottom: 2px;

        .song {
          font-size: 15px;
        }

        .singer {
          font-size: 12px;
          color: #666;
        }
      }

      .v-lyr {
        height: 45px;
        background: #fff;
        text-align: center;
        overflow: hidden;
        margin: -10px 0 7px;

        .lyr-list {
          transition: transform 0.4s ease-out;
        }

        p {
          font-size: 12px;
          line-height: 15px;
          color: #666;
          opacity: .4;
        }

        p.on {
          opacity: 1;
        }
      }

      .v-progress {
        position: relative;
        margin: 0 0 0 5px;
        flex: 1;

        .v-bar {
          float: left;
          width: 63%;
          height: 8px;
          cursor: pointer;
        }

        .v-line {
          width: 100%;
          position: relative;
          height: 2px;
          background: #cdcdcd;
        }

        .v-line-to {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: rgb(173, 122, 134);
          transition: all 0.05s linear;

          .v-point {
            position: absolute;
            top: 0;
            right: 5px;
            margin-top: -5px;
            margin-right: -10px;
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background: #fff;
            cursor: pointer;
            border: 1px solid rgb(173, 122, 134);

            &:hover {
              background-color: rgb(173, 122, 134);
            }
          }
        }

        .v-des {
          position: relative;
          margin-left: 63%;
          width: 37%;
          right: 0;
          bottom: 10px;
          height: 17px;
          color: #999;
          font-size: 11px;
          padding-left: 7px;
          user-select: none;

          .i-control {
            position: relative;
            display: inline-block;
            line-height: 17px;
            vertical-align: middle;
          }

          i {
            opacity: 0.6;
            cursor: pointer;

            &:hover {
              opacity: 1;
            }
          }

          i.icon-volume-max {
            font-size: 18px;
            padding-left: 2px;
            font-size: 18px;
          }
        }
      }

      .volume:hover  .volume-progress {
        display: block;
      }

      .volume-progress {
        display: none;
        position: absolute;
        bottom: 18px;
        right: 9px;
        width: 7px;
        height: 35px;
        background: #aaa;
        cursor: pointer;

        .volume-to {
          position: absolute;
          bottom: 0;
          background: #ad7a86;
          width: 7px;
          transition: all .1s ease;
        }
      }
    }

    .show-list {
      overflow: hidden;

      p {
        line-height: 32px;
        padding-left: 15px;
      }
      ol {
        max-height: 140px;
        overflow-y: auto;
        overflow-x: hidden;
        &::-webkit-scrollbar {
          width: 4px;
          height: 8px;
          background-color: rgba(0, 0, 0, 0.5);
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
        }
        &::-webkit-scrollbar-thumb {
           background: #ad7a86;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
        }
      }

      ol li {
        position: relative;
        height: 32px;
        line-height: 32px;
        list-style-type: armenian;
        padding: 0 15px;
        font-size: 12px;
        border-top: 1px solid #e9e9e9;
        cursor: pointer;
        -webkit-transition: all .2s ease;
        transition: all .2s ease;
        overflow: hidden;

        &:last-child{
          border-bottom: 1px solid #e9e9e9;
        }

        span.v-cur {
          position: absolute;
          width: 3px;
          height: 22px;
          left: 0;
          top: 5px;
          cursor: pointer;
          background: #ad7a86;
        }

        span.song {
          margin-left: 10px;
        }

        span.singer {
          float: right;
        }

        &.on, &:hover {
          background: #efefef;
        }
      }
    }
  }

  @media screen and (max-width: 520px) {
    .v-music {
      margin-left: 1%;
      width: 98%;

      .v-content {
        .v-pic {
          width: 20%;
        }

        .v-info {
          width: 80%;
        }

        .v-progress {
          .v-bar {
            width: 50%;

            .v-line-to {
              .v-point {
                width: 12px;
                height: 12px;
                margin-top: -6px;
              }
            }
          }

          .v-des {
            position: absolute;
            margin-left: 0;
            right: -5px;
            bottom: -8px;
            width: auto;
          }
        }
      }
    }
  }

  @media screen and (max-width: 375px) {
    .v-music {
      .v-content {
        .v-progress {
          .v-bar {
            width: 45%;
          }
        }
      }
    }
  }

  @media screen and (max-width: 320px) {
    .v-music {
      .v-content {
        .v-progress {
          .v-bar {
            width: 40%;
          }
        }
      }
    }
  }
</style>

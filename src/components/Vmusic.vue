<template>
  <div class="v-music">
    <div class="v-content">
      <div
        class="v-pic"
        :style="{'background-image': 'url(' + pic + ')'}">
        <i class="iconfont"
          :title="msg"
          @click="play()"
          :class="{'icon-play': playing === false, 'icon-pause': playing === true}">
        </i>
      </div>
      <div class="v-info">
        <div class="v-search">
          <i class="iconfont icon-search"></i>
          <input type="text" placeholder="搜一搜">
        </div>
        <div class="v-theme">
          <i class="iconfont icon-theme"></i>
        </div>
        <div class="v-title">
          <span class="song">{{ songname }}</span>
          <span class="singer">- {{ singer }}</span>
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
              <div class="i-control"><i class="iconfont icon-menu" title="播放列表"></i></div>
            </div>
          </div>
        </div>
      </div>
      <div class="show-list">
        <ol>
          <li>本地歌曲</li>
          <li
            v-for="(item, $index) in lists"
            :class="{'on': now === $index}"
            @click="playItem($index)">
            <span class="v-cur" v-show="now === $index"></span>
            <span>{{ $index + 1 }}</span>
            <span class="song">{{ item.songname }}</span>
            <span class="singer">{{ item.singer }}</span>
          </li>
        </ol>
        <ol class="search-list" v-show="searchLists.length > 1">
          <li>搜索歌曲</li>
          <li>123</li>
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
      lists: [
        {
          songname: 'AI',
          singer: '回音哥',
          lyr: '[ti&#58;A&#46;I]&#10;[ar&#58;回音哥]&#10;[al&#58;A&#46;I]&#10;[by&#58;]&#10;[offset&#58;0]&#10;[00&#58;00&#46;48]A&#46;I&#32;&#45;&#32;回音哥&#10;[00&#58;01&#46;11]词：回音哥&#10;[00&#58;01&#46;27]曲：颜小健/回音哥&#10;[00&#58;01&#46;57]编曲：颜小健&#10;[00&#58;01&#46;77]混音：颜小健&#10;[00&#58;01&#46;97]吉他：金天&#10;[00&#58;02&#46;13]录音：苍白&#10;[00&#58;02&#46;30]和声：回音哥&#10;[00&#58;02&#46;49]和声编写：颜小健&#10;[00&#58;02&#46;76]母带：刘三斤&#10;[00&#58;02&#46;96]制作人：颜小健&#10;[00&#58;03&#46;60]&#10;[00&#58;11&#46;91]以假乱真的眼睛&#32;给你透露我的心&#10;[00&#58;15&#46;32]&#10;[00&#58;16&#46;83]组织言语的逻辑&#32;寻找合适的表情&#10;[00&#58;20&#46;50]&#10;[00&#58;21&#46;89]举手投足的轻盈&#32;挥舞沉重的钢筋&#10;[00&#58;25&#46;43]&#10;[00&#58;26&#46;99]可能的万分之一&#32;全都由计算证明&#10;[00&#58;30&#46;98]现在&#32;格式&#32;你的神经&#10;[00&#58;34&#46;14]安装全新的你&#32;oh&#32;baby&#32;baby&#10;[00&#58;36&#46;71]及时&#32;更新整理&#32;修复错误问题&#10;[00&#58;40&#46;58]&#10;[00&#58;41&#46;11]现在&#32;定制&#32;你的权利&#10;[00&#58;44&#46;10]植入你的目的&#32;oh&#32;baby&#32;baby&#10;[00&#58;46&#46;91]测试&#32;我的稳定&#32;完成未来的题&#10;[00&#58;50&#46;75]&#10;[00&#58;53&#46;19]你想还原的日期&#32;早遥遥无期&#10;[00&#58;57&#46;05]&#10;[00&#58;57&#46;91]把自己当个机器&#32;才够人性&#10;[01&#58;02&#46;00]&#10;[01&#58;12&#46;60]演算出爱的程序&#32;删除原始的动机&#10;[01&#58;16&#46;12]&#10;[01&#58;17&#46;46]运用情绪的高低&#32;渲染无聊的场景&#10;[01&#58;21&#46;04]&#10;[01&#58;22&#46;51]城市的电子游戏&#32;是复杂的数字题&#10;[01&#58;26&#46;26]&#10;[01&#58;27&#46;56]排除多余的肯定&#32;找到简单的定义&#10;[01&#58;31&#46;72]现在&#32;格式&#32;你的神经&#10;[01&#58;34&#46;75]安装全新的你&#32;oh&#32;baby&#32;baby&#10;[01&#58;37&#46;29]及时&#32;更新整理&#32;修复错误问题&#10;[01&#58;41&#46;14]&#10;[01&#58;41&#46;77]现在&#32;定制&#32;你的权利&#10;[01&#58;44&#46;82]植入你的目的&#32;oh&#32;baby&#32;baby&#10;[01&#58;47&#46;45]测试&#32;我的稳定&#32;完成未来的题&#10;[01&#58;51&#46;40]&#10;[01&#58;53&#46;50]你想还原的日期&#32;早遥遥无期&#10;[01&#58;57&#46;73]&#10;[01&#58;58&#46;53]把自己当个机器&#32;才够人性&#10;[02&#58;02&#46;56]&#10;[02&#58;44&#46;13]你想还原的日期&#32;早遥遥无期&#10;[02&#58;48&#46;20]&#10;[02&#58;48&#46;92]把自己当作机器&#32;全新的你',
          img: 'http://i.gtimg.cn/music/photo/mid_album_300/o/C/001BkQ9Y2e1hoC.jpg',
          url: 'http://ws.stream.qqmusic.qq.com/109828807.m4a?fromtag=46'
        },
        {
          songname: '告白气球',
          singer: '周杰伦',
          lyr: '[ti&#58;告白气球]&#10;[ar&#58;周杰伦]&#10;[al&#58;周杰伦的床边故事]&#10;[by&#58;]&#10;[offset&#58;0]&#10;[00&#58;00&#46;98]告白气球&#32;&#45;&#32;周杰伦&#10;[00&#58;04&#46;19]词：方文山&#10;[00&#58;06&#46;29]曲：周杰伦&#10;[00&#58;07&#46;78]&#10;[00&#58;23&#46;65]塞纳河畔&#32;左岸的咖啡&#10;[00&#58;26&#46;45]我手一杯&#32;品尝你的美&#10;[00&#58;28&#46;94]&#10;[00&#58;29&#46;49]留下唇印的嘴&#10;[00&#58;31&#46;89]&#10;[00&#58;34&#46;42]花店玫瑰&#32;名字写错谁&#10;[00&#58;37&#46;18]告白气球&#32;风吹到对街&#10;[00&#58;40&#46;18]微笑在天上飞&#10;[00&#58;42&#46;59]&#10;[00&#58;44&#46;27]你说你有点难追&#32;想让我知难而退&#10;[00&#58;49&#46;40]礼物不需挑最贵&#32;只要香榭的落叶&#10;[00&#58;54&#46;67]喔&#32;营造浪漫的约会&#32;不害怕搞砸一切&#10;[01&#58;00&#46;01]拥有你就拥有&#32;全世界&#10;[01&#58;04&#46;15]&#10;[01&#58;05&#46;13]亲爱的&#32;爱上你&#32;从那天起&#10;[01&#58;11&#46;48]甜蜜的很轻易&#10;[01&#58;14&#46;59]&#10;[01&#58;15&#46;70]亲爱的&#32;别任性&#32;你的眼睛&#10;[01&#58;21&#46;36]&#10;[01&#58;22&#46;08]在说我愿意&#10;[01&#58;25&#46;42]&#10;[01&#58;49&#46;14]塞纳河畔&#32;左岸的咖啡&#10;[01&#58;51&#46;72]我手一杯&#32;品尝你的美&#10;[01&#58;54&#46;20]&#10;[01&#58;54&#46;87]留下唇印的嘴&#10;[01&#58;57&#46;31]&#10;[01&#58;59&#46;81]花店玫瑰&#32;名字写错谁&#10;[02&#58;02&#46;39]告白气球&#32;风吹到对街&#10;[02&#58;04&#46;70]&#10;[02&#58;05&#46;44]微笑在天上飞&#10;[02&#58;07&#46;99]&#10;[02&#58;09&#46;61]你说你有点难追&#32;想让我知难而退&#10;[02&#58;14&#46;78]礼物不需挑最贵&#32;只要香榭的落叶&#10;[02&#58;19&#46;65]&#10;[02&#58;20&#46;18]喔&#32;营造浪漫的约会&#32;不害怕搞砸一切&#10;[02&#58;25&#46;40]拥有你就拥有&#32;全世界&#10;[02&#58;29&#46;42]&#10;[02&#58;30&#46;46]亲爱的&#32;爱上你&#32;从那天起&#10;[02&#58;36&#46;87]甜蜜的很轻易&#10;[02&#58;39&#46;98]&#10;[02&#58;41&#46;01]亲爱的&#32;别任性&#32;你的眼睛&#10;[02&#58;46&#46;74]&#10;[02&#58;47&#46;33]在说我愿意&#10;[02&#58;51&#46;16]&#10;[02&#58;51&#46;85]亲爱的&#32;爱上你&#32;恋爱日记&#10;[02&#58;57&#46;46]&#10;[02&#58;58&#46;06]飘香水的回忆&#10;[03&#58;01&#46;49]&#10;[03&#58;02&#46;42]一整瓶&#32;的梦境&#32;全都有你&#10;[03&#58;08&#46;11]&#10;[03&#58;08&#46;82]搅拌在一起&#10;[03&#58;12&#46;29]&#10;[03&#58;13&#46;16]亲爱的别任性&#32;你的眼睛&#10;[03&#58;20&#46;01]&#10;[03&#58;21&#46;37]在说我愿意',
          img: 'http://i.gtimg.cn/music/photo/mid_album_300/Y/d/003RMaRI1iFoYd.jpg',
          url: 'http://ws.stream.qqmusic.qq.com/107192078.m4a?fromtag=46'
        }
      ],
      searchLists: [],
      playing: false,
      pic: '',
      singer: '',
      songname: '',
      nowTime: 0,
      now: -1,
      allTime: 999,
      msg: '播放',
      set: 0,
      type: 'order',
      lyr: '',
      lyrList: [],
      volume: 1,
      url: ''
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
          document.querySelectorAll('.v-audio').forEach((val) => {
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
      if (index === this.now) {
        this.$nextTick(() => {
          this.play()
        })
      } else {
        this.now = index
        this.nowTime = 0
        this.songname = this.lists[index].songname
        this.singer = this.lists[index].singer
        this.lyr = this.lists[index].lyr
        this.url = this.lists[index].url
        this.pic = this.lists[index].img
        this.showLyr()
        this.$nextTick(() => {
          document.querySelectorAll('.v-audio').forEach((val) => {
            val.pause()
          })
          this.$refs.music.play()
          this.start()
        })
      }
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
      switch (this.type) {
        case 'order':
          if (this.now + 1 > this.lists.length - 1) {
            this.playItem(0)
          } else {
            this.playItem(this.now + 1)
          }
          break
        case 'random':
          this.playItem(this.randomNext())
          break
        default:
          this.currentTime = 0
          break
      }
    },
    // 随机播放
    randomNext () {
      var l = this.lists.length
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
      this.set = setInterval(() => {
        // 更新时间
        this.updateTime()
        // 更新展示歌词
        this.updateLyr()
      }, 60)
    },
    // 暂停计时
    stop () {
      clearInterval(this.set)
    },
    // 提取歌词 并展示
    showLyr () {
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
            val = val.replace('/^s+|s+$/', '')
            var obj = {}
            obj.min = ~~(val.substring(1, 3))
            obj.sec = ~~(val.substring(4, 6))
            obj.ms = ~~(val.substring(7, 9))
            obj.txt = val.substring(10, val.length)
            obj.txt = obj.txt.replace('/^s+|s+$/', '')
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
    }
  },
  mounted () {
    if (this.lists.length > 0) {
      this.nowTime = 0
      this.songname = this.lists[0].songname
      this.singer = this.lists[0].singer
      this.lyr = this.lists[0].lyr
      this.url = this.lists[0].url
      this.pic = this.lists[0].img
      this.showLyr()
    }
    this.volume = 0.3
    this.now = 0
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
        top: 3px;
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

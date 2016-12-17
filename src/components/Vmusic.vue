<template>
  <div class="v-music">
    <div class="v-content">
      <div class="v-pic"
        :style="{'background-image': 'url(' + pic + ')'}">
        <i class="iconfont" :class="{'icon-play': playing === false, 'icon-pause': playing === true}"></i>
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
          <span class="song">{{ song }}</span>
          <span class="singer">- {{ singer }}</span>
        </div>
        <div class="v-lyr">
          <div class="lyr-list">
            <p>A.I - 回音哥</p>
            <p class="on">词：回音哥</p>
            <p>曲：颜小健/回音哥</p>
          </div>
        </div>
        <div class="v-control">
          <div class="v-progress">
            <div class="v-bar">
              <div class="v-bar-to">
                <span class="v-point"></span>
              </div>
            </div>
            <div class="v-des">
              <span>- 00:30 /</span>
              <span>04:53</span>
              <span><i class="iconfont icon-volume-max"></i></span>
              <span><i class="iconfont icon-order"></i></span>
              <span><i class="iconfont icon-menu"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <audio :src="url"></audio>
  </div>
</template>

<script>
export default {
  data () {
    return {
      playing: false,
      pic: 'http://i.gtimg.cn/music/photo/mid_album_300/o/C/001BkQ9Y2e1hoC.jpg',
      singer: '回音哥',
      song: 'AI',
      nowTime: 0,
      url: ''
    }
  },
  computed: {
  },
  components: {
  },
  methods: {
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
    }

    .v-search {
      position: absolute;
      top: 2px;
      right: 20px;

      i {
        position: absolute;
        top: 3px;
        left: 5px;
        font-size: 10px;
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

    .v-content {
      height: 95px;
    }

    .v-pic {
      position: relative;
      display: inline-block;
      width: 95px;
      height: 95px;
      background-size: cover;

      i {
        color: white;
        font-size: 20px;
      }

      i.icon-play {
        position: absolute;
        top: 30px;
        left: 25px;
        font-size: 35px;
        cursor: pointer;
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
        margin: 0 0 0 5px;
        flex: 1;

        .v-bar {
          float: left;
          width: 65%;
          position: relative;
          height: 2px;
          background: #cdcdcd;
        }

        .v-bar-to {
          position: absolute;
          top: 0;
          left: 0;
          width: 10%;
          height: 2px;
          background: rgb(173, 122, 134);

          .v-point {
            position: absolute;
            top: 0;
            right: 5px;
            margin-top: -4px;
            margin-right: -10px;
            height: 8px;
            width: 8px;
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
          margin-left: 64%;
          width: 35%;
          right: 0;
          bottom: 10px;
          height: 17px;
          color: #999;
          font-size: 11px;
          padding-left: 7px;
          user-select: none;

          span {
            line-height: 17px;
            vertical-align: middle;
          }

          i {
            cursor: pointer;
          }

          i.icon-volume-max {
            font-size: 18px;
            padding-left: 2px;
            font-size: 18px;
          }
        }
      }
    }
  }
</style>

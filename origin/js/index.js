/*
 * @Author: iwillwen (Chaoyang Gan)
 * @Date: 2018-05-20 10:30:08
 * @Last Modified by: pycoder.Junting
 * @Last Modified time: 2018-05-20 21:00:34
 */


// 初始化浏览器窗口的宽高、字体 Size
const screenSize = {
  width: document.body.offsetWidth,
  height: document.body.offsetHeight
};
const fontSizePixel = 16;

// Messages 默认
const defaultMessage = '老婆最可爱！😘';
let messages = [ defaultMessage ]; // 后续不停点击消息组

// Messages 指定, 根据URL #（hash） 后输入的内容（如: #I Love you）
if (window.location.hash.length > 0) {
  // 浏览器自身会对URI进行encodeURIComponent(URIstring)
  messages = decodeURIComponent(window.location.hash.substr(1)).split('#'); // 过滤第一个#,以#号分割为数组
}

// 显示第一个 message
const staticMessage = messages[0];
const staticMsg = {
  good: true, // 控制垃圾回收的标示
  classes: [ 'msg', 'brighten'],
  message: staticMessage,
  style: {
    left: Math.ceil((screenSize.width / 2) - ((staticMessage.length + 1 /*padding*/) * fontSizePixel / 2)) + 'px',
    top: Math.ceil(((screenSize.height / 2) - (fontSizePixel + 0.6 /*padding*/ / 2)) * (1 - ((0.618 - 0.5) * 2))) + 'px'
  }
};


// 设置网页标题
document.title = staticMessage;

new Vue({
  el: '#echo',

  data: {
    messages,
    msgs: [ staticMsg ],    // messages 容器
  },

  methods: {

    // 控制 fire 效果，并且生成新的 message box
    fire() {
      // 产生第二个 Message 是没有 brighten 🔥的效果，保持所有 message 痒死统一
      if (staticMsg.classes.length > 1) staticMsg.classes.splice(1);

      // 告诉浏览器您希望执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画。
      // 统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。
      window.requestAnimationFrame(this.newMsg);
    },

    // 用户输入了多个 messages 内容, 随机指定新生成的 msg 的显示内容
    randomMsg() {
      const index = Math.round(Math.random() * (this.messages.length - 1))
      return this.messages[index]
    },

    // new message box 设置
    newMsg() {
      // Random message with random position and random size
      // 随机消息、随机位置和随机大小。
      const left = Math.ceil(Math.random() * 0.9 * screenSize.width) + 'px';
      const top = Math.ceil(Math.random() * 0.9 * screenSize.height) + 'px';
      const scale = 1 + Math.random();

      // 定义 message
      const msg = {
        good: true,
        classes: [ 'msg', 'hide' ],
        style: {
          top,
          left,
          transform: `scale(${scale})`
        },
        message: this.randomMsg()
      };

      // 新增 msg
      this.msgs.push(msg);

      // 新产生的 message 挂上定时器任务
      // 100ms 后, 剔除 hide
      setTimeout(() => msg.classes.splice(1), 100);

      setTimeout(() => {
        msg.classes.push('hide'); // 5秒后，填上hide, 隐藏 新产生的 message box

        // 等待动画完成, 500ms 后会
        setTimeout(() => msg.good = false, 500);

        // 2s后 清除该数组以进行垃圾收集
        setTimeout(() => {
          if (this.msgs.length <= 1) return

          // 判读 msgs 中 good 是否还有 ture 状态
          // 实现流程，生成一个新的只包含good数组，左右比对检测是否还有 true 的存在
          const hasMsgs = this.msgs.slice(1)
            .map(({ good }) => good)
            .reduce((left, right) => left || right);

          if (!hasMsgs) this.msgs.splice(1);
        }, 2000);
      }, 5000);
    }
  }
});

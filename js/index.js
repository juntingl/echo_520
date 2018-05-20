/*
 * @Author: pycoder.Junting
 * @Date: 2018-05-20 21:27:24
 * @Last Modified by: pycoder.Junting
 * @Last Modified time: 2018-05-20 23:04:38
 */

//  初始化当前的可视窗口的尺寸、字体大小
const screenSize = {
    width: document.body.offsetWidth,
    height: document.body.offsetHeight,
};
const fontSizePixel = 16;

// 默认 Messages
const defaultMessage = '单身汪～🐶';
let messages = [ defaultMessage ]; // message 容器

// 获取用户自定义 message 内容; #单身汪～🐶#单身汪～🐶
if (window.location.hash.length > 0) {
    // 浏览器自身会对URI进行encodeURIComponent(URIstring)
    // 过滤第一个#,以#号分割为数组
    messages = decodeURIComponent(window.location.hash.substr(1)).split('#')
}

// 第一个固定Messages, 显示效果设置
const staticMessage = messages[0];
const staticMsg = {
    good: true, // 控制垃圾回收的标志
    classes: ['msg', 'brighten'],
    message: staticMessage,
    // 居中显示，可视宽口尺寸一半，减去 message 大小的一半
    style: {
        left: Math.ceil((screenSize.width / 2) - ((staticMessage.length + 1/*padding*/) * fontSizePixel / 2)) + 'px',
        top: Math.ceil(((screenSize.height / 2) - (fontSizePixel + 1/*padding*/ / 2)) * (1 - ((0.618 - 0.5) * 2))) + 'px'
    }

};

// 默认第一个 message 大小计算
// width = （字体内容长度  + padding） * 字体Size
// height = 字体Size + padding

// 设置网页标题
document.title = staticMessage;

new Vue ({
    el: '#echo',

    data: {
        messages, // 用户输入的消息内容组
        msgs: [ staticMsg ] //显示消息容器
    },

    methods: {
        /**
         * 🔥 当 msgs > 1， 控制第一个 message 取消一闪一闪的效果，与其他的 message 保持一致性
         */
        fire() {
            if (staticMsg.classes.length > 1) staticMsg.classes.splice(1);

            // 告诉浏览器您希望执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画。
            // 统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。
            window.requestAnimationFrame(this.newMsg);
        },

        /**
         * 随机消息内容
         * 用户输入N个消息内容
         * @returns string
         */
        randomMsg() {
            const index = Math.round(Math.random() * (this.messages.length - 1)); // 保证只有一个消息内容时，都能得到0
            return this.messages[index];
        },

        newMsg() {
            // 随机大小位置
            const left = Math.floor(Math.random() * screenSize.width * 0.9) + 'px'; // 使用 Math.ceil()也一样
            const top = Math.floor(Math.random() * screenSize.height * 0.9) + 'px'; // 使用 Math.ceil()也一样
            const scale = Math.random() + 1;

            // 定义 新的 message 相关
            const msg = {
                good: true,
                classes: ['msg', 'hide'],
                style: {
                    top,
                    left,
                    transform: `scale(${scale})`
                },
                message: this.randomMsg()
            };

            // 加入显示消息容器
            this.msgs.push(msg);


            // 这个时候添加的 msg 是隐藏的, 让它 100ms 后再显示出来
            setTimeout(() => msg.classes.splice(1), 100);

            // 5秒后，msg 消失
            setTimeout(() => {
                msg.classes.push('hide');

                // 消失动画完成, 500ms后将此 msg 设置为 false，表示可以被回收了
                setTimeout(() => msg.good = false, 500);

                // ♻️ 垃圾回收
                setTimeout(() => {
                    if (this.msgs.length <= 1) return

                    // 判读 msgs 中 good 是否还有 ture 状态
                    // 实现流程，生成一个新的只包含good数组，左右比对检测是否还有 true 的存在
                    const hasMsgs = this.msgs.slice(1) // 前拷贝一份进行判断，不要对原数据产生影响
                        .map(({good}) => good)
                        .reduce((left, right) => left || right);

                    // hasMsgs = false, 重置 msgs
                    if (!hasMsgs) this.msgs.splice(1);
                }, 2000);
            }, 5000);

        }
    }
});

import Tween from './tween.js';

export function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr];
}

export function animate(json, fx, duration, callback) {
    var i = 0;
    var that = this;
    for (; i < this.length; i++) {
        (function (a) {
            clearInterval(that[a].timer);
            var iCur = {};

            //先存储当前值
            for (var attr in json) {
                if (attr == 'opacity') {
                    iCur[attr] = Math.round(getStyle(that[a], 'opacity') * 100);
                } else {
                    iCur[attr] = parseInt(getStyle(that[a], attr));
                }
            }

            var startTime = Date.now();

            that[i].timer = setInterval(function () {
                var iNow = Date.now();
                var t = duration - Math.max(0, startTime - iNow + duration);

                for (var attr in json) {
                    var value = Tween[fx](t, iCur[attr], json[attr] - iCur[attr], duration);
                    if (attr == 'opacity') {
                        that[a].style.opacity = value / 100;
                        that[a].style.filter = 'alpha(opacity=' + value + ')';
                    } else {
                        that[a].style[attr] = value + 'px';
                    }
                }

                if (t == duration) {
                    clearInterval(that[a].timer);
                    callback && callback.call(that[a]);
                }
            }, 13)
        })(i)
    }

}

MQ.fn.extend({
    animate
})
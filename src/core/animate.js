import Tween from './tween.js';

export function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr];
}

export function animate(json, options) {
    var i = 0;
    var that = this;
    var defaultSetting = {
        fx: 'linear',
        duration: 1000,
        callback: function () {}
    };
    options = options || defaultSetting;

    for (var attr in defaultSetting) {
        if (!options[attr]) {
            options[attr] = defaultSetting[attr];
        }
    }

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
                var t = options["duration"] - Math.max(0, startTime - iNow + options["duration"]);

                for (var attr in json) {
                    var value = Tween[options["fx"]](t, iCur[attr], json[attr] - iCur[attr], options["duration"]);
                    if (attr == 'opacity') {
                        that[a].style.opacity = value / 100;
                        that[a].style.filter = 'alpha(opacity=' + value + ')';
                    } else {
                        that[a].style[attr] = value + 'px';
                    }
                }

                if (t == options["duration"]) {
                    clearInterval(that[a].timer);
                    options["callback"] && options["callback"].call(that[a]);
                }
            }, 13)
        })(i)
    }

}

MQ.fn.extend({
    animate
})
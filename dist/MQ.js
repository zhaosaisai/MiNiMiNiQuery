(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (factory());
}(this, (function () { 'use strict';

/*
    init.js主要根据选择器的类型创建出对象。选择器主要分为以下几种类型：
        1、可以转换为false的值:''，undefined，null，false等
        2、原生的dom节点
        3、函数
        4、数组
        5、对象
        6、字符串：分成两种情况--带有<这样的标签的形式--或者是普通的选择器
*/

function init(selector = '') {
    let dom,
        //保存元素对象
    matchTag = /^\s*<(\w+|!)[^>]*>/g,
        //匹配普通的标签的形式
    selectorType = MQ.type(selector),
        //获取选择器的类型
    selectorNode = [1, 9, 11]; //保存节点的类型，其中1--元素节点。9--document节点。11-文档碎片节点,document_fragment

    if (!selector) {
        dom = [];
        dom.selector = null;
    } else if (selectorNode.indexOf(selector.nodeType) !== -1 || selector === window) {
        dom = [selector];
        selector = null;
    } else if (selectorType === 'function') {
        return MQ(document).ready(selector);
    } else if (selectorType === 'array') {
        dom = [selector];
    } else if (selectorType === 'object') {
        dom = [selector];
        selector = null;
    } else if (selectorType === 'string') {
        if (selector.charAt(0) === '<' && matchTag.test(selector)) {
            dom = MQ.parseHTML(selector);
            selector = null;
        } else {
            dom = Array.prototype.slice.call(document.querySelectorAll(selector));
        }
    }

    dom = dom || [];
    MQ.extend(dom, MQ.fn);
    dom.selector = selector;

    return dom;
}

/*
    extend.js：主要实现的是继承的关系
*/

function extend() {
    let val,
        attr,
        targetValue,
        sourceValue,
        isArray,
        clone,
        str,
        target = arguments[0] || {},
        i = 1,
        len = arguments.length,
        deep = false; //是否深复制

    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }

    if (typeof target !== 'object' && MQ.type(target) !== 'function') {
        target = {};
    }

    if (i === len) {
        target = this;
        i--;
    }

    //开始循环复制
    for (; i < len; i++) {
        if ((val = arguments[i]) != null) {
            for (attr in val) {
                targetValue = target[attr];
                sourceValue = val[attr];

                if (target === sourceValue) {
                    //防止死循环
                    continue;
                }

                if (deep && sourceValue && (MQ.isPlainObject(sourceValue) || (isArray = Array.isArray(sourceValue)))) {
                    if (!JSON.stringify) {
                        if (isArray) {
                            clone = targetValue && Array.isArray(targetValue) ? targetValue : [];
                        } else {
                            clone = targetValue && MQ.isPlainObject(targetValue) ? targetValue : {};
                        }
                        target[attr] = extend(deep, clone, sourceValue);
                    } else {
                        str = JSON.stringify(sourceValue);
                        target[attr] = JSON.parse(str);
                    }
                } else if (sourceValue !== undefined) {
                    target[attr] = sourceValue;
                }
            }
        }
    }
    return target;
}

//设置构造函数
function MQ$1(selector = '') {
    return new MQ$1.fn.init(selector);
}

MQ$1.fn = MQ$1.prototype = {
    constructor: MQ$1,
    init
};

//设置init的原型指向MQ的原型
MQ$1.fn.init.prototype = MQ$1.fn;

//设置继承方法
MQ$1.extend = MQ$1.fn.extend = extend;

//设置全局获取变量
window.MQ = window.JY = window.$ = MQ$1;

/*
    这个是实例对象的方法
    is--判断元素是不是和制定的selector匹配
    map--遍历元素
    each--遍历
*/

function is(selector) {
    return this.length > 0 ? MQ.matches(this[0], selector) : false;
}

function map(callback) {
    return MQ(MQ.map(this, (item, i) => {
        return callback.call(item, item, i);
    }));
}

function each(callback) {
    [].every.call(this, (item, i) => {
        return callback.call(item, item, i) !== false;
    });
    return this;
}

MQ.fn.extend({
    is,
    map,
    each
});

/*
    这些方法是添加在MQ这个类上面的。主要由以下几种：
    rootMQ--从document上获取元素
    trim--去除空格
    type--获取类型
    isPlainObject--判断是不是纯粹的JavaScript对象
    isWindow--判断是不是window对象
    isArrayLike--判断是不是数组或者类数组
    flatten--展开数组
    map--映射
    each--遍历
    merge--合并数组
    unique--数组去重
    matches--判断选择器是否和标签匹配
    parseHTML--解析字符串成HTML
*/

function rootMQ(selector) {
    return document.querySelectorAll(selector);
}

function trim(str) {
    const trimLeft = /^[\s\xA0]+/g,
          trimRight = /[\s\xA0]+$/g;
    return str == null ? '' : str.toString().replace(trimLeft, '').replace(trimRight, '');
}

function type(object) {
    let class2type = {},
        type = class2type.toString.call(object),
        typeString = 'Boolean Number String Function RegExp Object Date Array Error';

    if (object == null) {
        return object + '';
    }
    //进行映射
    typeString.split(' ').forEach(value => {
        class2type[`[object ${ value }]`] = value.toLowerCase();
    });

    return typeof object === 'object' || typeof object === 'function' ? class2type[type] : typeof object;
}

function isPlainObject(object) {
    let pro,
        con,
        obj = {},
        hasOwn = obj.hasOwnProperty,
        tostring = obj.toString,
        fnToString = hasOwn.toString,
        objectNactive = fnToString.call(obj);

    if (!object || tostring.call(object) !== '[object Object]') {
        return false;
    }

    pro = Object.getPrototypeOf(object);
    if (!pro) {
        return true;
    }

    con = hasOwn.call(pro, 'constructor') && pro.constructor;
    return typeof con === 'function' && fnToString.call(con) === objectNactive;
}

function isWindow(obj) {
    return obj != null && obj == obj.window;
}

function isArrayLike(object) {
    let len = !!object && 'length' in object && object.length;
    type = MQ.type(object);

    if (type === 'function' || isWindow(object)) {
        return false;
    }

    return type === 'array' || len === 0 || typeof len === 'number' && len > 0 && len - 1 in object;
}

function flatten(arr) {
    let i = 0,
        value,
        len = att.length,
        result = [];
    for (; i < len; ++i) {
        value = arr[i];
        if (Array.isArray(value)) {
            result.push.apply(result, flatten(value));
        } else {
            result.push(value);
        }
    }
    return result;
}

function map$1(items, callback) {
    let i = 0,
        results = [],
        result,
        len;
    if (isArrayLike(items)) {
        len = items.length;
        for (; i < len; i++) {
            result = callback(items[i], i);
            if (result != null) {
                results.push(result);
            }
        }
    } else {
        for (i in items) {
            result = callback(items[i], i);
            if (result != null) {
                results.push(result);
            }
        }
    }
    return flatten(results);
}

function each$1(items, callback) {
    let i = 0,
        len;
    if (isArrayLike(items)) {
        len = items.length;
        for (; i < len; i++) {
            if (callback.call(items[i], i, items) === false) return items;
        }
    } else {
        for (i in items) {
            if (callback.call(items[i], i, items) === false) return items;
        }
    }
}

function merge(arr1, arr2) {
    let i = 0,
        j = arr1.length,
        len = arr2.length;
    if (!(Array.isArray(arr1) && Array.isArray(arr2))) {
        return false;
    }

    for (; i < len; i++) {
        arr1[j++] = arr2[i];
    }

    arr1.length = j;

    return arr1;
}

function unique(arr) {
    let i = 0,
        len = arr.length,
        result = [];

    for (; i < len; i++) {
        if (result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
        }
    }
    return result;
}

function matches(element, selector) {
    if (!element || !selector || element.nodeType != 1) {
        return false;
    }

    let match = element.matches || element.matchesSelector || element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;

    return match.call(element, selector);
}

function parseHTML(str) {
    let doc = document.implementation.createHTMLDocument(str);
    doc.body.innerHTML = str;
    return doc.body.children;
}

MQ.extend({
    find: rootMQ,
    trim,
    type,
    isPlainObject,
    isWindow,
    flatten,
    map: map$1,
    each: each$1,
    merge,
    unique,
    matches,
    parseHTML
});

/*
    和dom操作相关的
*/
const rnowhite = /\S+/g;
const rclass = /[\t\r\n\f]/g;

function ready(callback) {
    if (document && /loaded|interactive|complete/.test(document.readyState) && document.body) {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            callback();
        }, false);
    }
}

function getClass(el) {
    return el.classList ? [].slice.call(el.classList).join(' ') : el.getAttribute && el.getAttribute('class') || '';
}

function addClass(classstr) {
    let i = 0,
        j = 0,
        el,
        classes,
        curClass,
        cur,
        add,
        finalClass;
    if (typeof classstr === 'string' && classstr) {
        classes = classstr.match(rnowhite) || [];
        if (this[i].classList) {
            while (el = this[i++]) {
                while (add = classes[j++]) {
                    if (!el.classList.contains(curClass)) {
                        el.classList.add(curClass);
                    }
                }
            }
        } else {
            while (el = this[i++]) {
                curClass = getClass(el);
                cur = el.nodeType === 1 && ` ${ curClass } `.replace(rclass, '');
                while (add = classes[j++]) {
                    if (cur.indexOf(add) == -1) {
                        cur += add + ' ';
                    }
                    finalClass = MQ.trim(cur);
                    if (cur !== finalClass) {
                        el.className = finalClass;
                    }
                }
            }
        }
    }
}

function removeClass(classstr) {
    let i = 0,
        j = 0,
        el,
        classes,
        curClass,
        cur,
        add,
        finalClass;
    if (!arguments.length) {
        return;
    }
    if (typeof classstr === 'string' && classstr) {
        classes = classstr.match(rnowhite) || [];
        if (this[i].classList) {
            while (el = this[i++]) {
                while (add = classes[j++]) {
                    if (el.classList.contains(curClass)) {
                        el.classList.remove(curClass);
                    }
                }
            }
        } else {
            while (el = this[i++]) {
                curClass = getClass(el);
                cur = el.nodeType === 1 && ` ${ curClass } `.replace(rclass, '');
                while (add = classes[j++]) {
                    if (cur.indexOf(add) !== -1) {
                        cur = cur.replace(add, '');
                    }
                    finalClass = MQ.trim(cur);
                    if (cur !== finalClass) {
                        el.className = finalClass;
                    }
                }
            }
        }
    }
}

function hasClass(classstr) {
    let i = 0,
        el;
    if (this[i].classList) {
        while (el = this[i++]) {
            return el.classList.contains(classstr);
        }
    } else {
        while (el = this[i++]) {
            if (el.nodeType === 1 && `${ getClass(el) }`.replace(rclass, '').indexOf(classstr) !== -1) {
                return true;
            }
        }
    }
    return false;
}

function toggleClass(classstr) {
    let i = 0,
        el;
    if (this[i].classList) {
        while (el = this[i++]) {
            el.classList.toggle(classstr);
        }
    } else {
        while (el = this[i++]) {
            if (!el.hasClass(classstr)) {
                el.addClass(classstr);
            } else {
                el.removeClass(classstr);
            }
        }
    }
    return this;
}

function append(domstr) {
    let doc = MQ.parseHTML(domstr),
        i = 0,
        eles = Array.prototype.slice.apply(doc),
        el;

    while (el = this[i++]) {
        eles.forEach(value => {
            el.appendChild(value);
        });
    }
    return this;
}

function appendTo(selector) {
    let i = 0,
        parents = Array.prototype.slice.apply(MQ.find(selector)),
        son;
    while (son = this[i++]) {
        parents.forEach(el => {
            el.appendChild(son);
        });
    }
    return this;
}

MQ.fn.extend({
    ready,
    getClass,
    addClass,
    removeClass,
    hasClass,
    toggleClass,
    append,
    appendTo
});

const Tween = {
    linear: function (t, b, c, d) {
        //匀速
        return c * t / d + b;
    },
    easeIn: function (t, b, c, d) {
        //加速曲线
        return c * (t /= d) * t + b;
    },
    easeOut: function (t, b, c, d) {
        //减速曲线
        return -c * (t /= d) * (t - 2) + b;
    },
    easeBoth: function (t, b, c, d) {
        //加速减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * (--t * (t - 2) - 1) + b;
    },
    easeInStrong: function (t, b, c, d) {
        //加加速曲线
        return c * (t /= d) * t * t * t + b;
    },
    easeOutStrong: function (t, b, c, d) {
        //减减速曲线
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeBothStrong: function (t, b, c, d) {
        //加加速减减速曲线
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    elasticIn: function (t, b, c, d, a, p) {
        //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    elasticOut: function (t, b, c, d, a, p) {
        //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ((t /= d) == 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    elasticBoth: function (t, b, c, d, a, p) {
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) == 2) {
            return b + c;
        }
        if (!p) {
            p = d * (0.3 * 1.5);
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    backIn: function (t, b, c, d, s) {
        //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    backOut: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 3.70158; //回缩的距离
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    backBoth: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    },
    bounceIn: function (t, b, c, d) {
        //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d - t, 0, c, d) + b;
    },
    bounceOut: function (t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b;
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
        }
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    },
    bounceBoth: function (t, b, c, d) {
        if (t < d / 2) {
            return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
};

function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr];
}

function animate(json, fx, duration, callback) {
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
            }, 13);
        })(i);
    }
}

MQ.fn.extend({
    animate
});

})));
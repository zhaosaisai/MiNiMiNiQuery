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

export function rootMQ(selector) {
    return document.querySelectorAll(selector);
}

export function trim(str) {
    const trimLeft = /^[\s\xA0]+/g,
        trimRight = /[\s\xA0]+$/g;
    return str == null ? '' : str.toString().replace(trimLeft, '').replace(trimRight, '');
}

export function type(object) {
    let class2type = {},
        type = class2type.toString.call(object),
        typeString = 'Boolean Number String Function RegExp Object Date Array Error';

    if (object == null) {
        return object + '';
    }
    //进行映射
    typeString.split(' ').forEach((value) => {
        class2type[`[object ${value}]`] = value.toLowerCase();
    })

    return typeof object === 'object' || typeof object === 'function' ? class2type[type] : typeof object;
}

export function isPlainObject(object) {
    let pro, con,
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

export function isWindow(obj) {
    return obj != null && obj == obj.window;
}

export function isArrayLike(object) {
    let len = !!object && 'length' in object && object.length;
    type = MQ.type(object);

    if (type === 'function' || isWindow(object)) {
        return false;
    }

    return type === 'array' || len === 0 || typeof len === 'number' && len > 0 && (len - 1) in object;
}

export function flatten(arr) {
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

export function map(items, callback) {
    let i = 0,
        results = [],
        result, len;
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

export function each(items, callback) {
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

export function merge(arr1, arr2) {
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

export function unique(arr) {
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

export function matches(element, selector) {
    if (!element || !selector || element.nodeType != 1) {
        return false;
    }

    let match = element.matches || element.matchesSelector || element.webkitMatchesSelector || element.msMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector;

    return match.call(element, selector);
}

export function parseHTML(str) {
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
    map,
    each,
    merge,
    unique,
    matches,
    parseHTML
})
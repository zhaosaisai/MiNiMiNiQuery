/*
    extend.js：主要实现的是继承的关系
*/

function extend() {
    let val, attr, targetValue, sourceValue, isArray, clone, str,
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
                        target[attr] = extend(deep, clone, sourceValue)
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

export default extend;
/*
    这个是实例对象的方法
    is--判断元素是不是和制定的selector匹配
    map--遍历元素
    each--遍历
*/

export function is(selector) {
    return this.length > 0 ? MQ.matches(this[0], selector) : false;
}

export function map(callback) {
    return MQ(MQ.map(this, (item, i) => {
        return callback.call(item, item, i);
    }))
}

export function each(callback) {
    [].every.call(this, (item, i) => {
        return callback.call(item, item, i) !== false;
    })
    return this;
}

MQ.fn.extend({
    is,
    map,
    each
})
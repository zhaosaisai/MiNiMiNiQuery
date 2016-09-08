/*
    这个方法主要是用于在dom树种进行元素的选取
    pushStack--将元素的操作按照顺序进行映射
    find--从子孙中查找元素
    end--回溯到上级
    eq--按照索引获取元素
    first--获取第一个元素
    last--获取最后一个元素
    parent--获取元素的parent
    parent--获取元素的祖先
*/

export function pushStack(els) {
    let ret = MQ.merge([], els);
    res.prevObject = this;
    return ret;
}

export function find(selector) {
    let i = 0,
        result = this.pushStack([]),
        el;

    while (el = this[i++]) {
        result = MQ.merge(result, el.querySelectorAll(selector));
    }

    return result;
}

export function end() {
    return this.prevObject || [];
}

export function eq(index) {
    let len = this.length,
        i = index >= 0 ? index : len + i;
    return this.pushStack(i >= 0 && i < len ? [this[i]] : []);
}

export function first() {
    return this.eq(0);
}

export function last() {
    return this.eq(-1);
}

export function parent(selector) {
    let parents = [],
        parent,
        i = 0,
        len = this.length;
    for (; i < len; i++) {
        if ((parent = this[i].parentNode) != null) {
            if (selector) {
                if (MQ.matches(parent, selector)) {
                    parents.push(parent);
                }
            } else {
                parents.push(parent);
            }
        }
    }
    parents = MQ.unique(parents);
    return MQ(parents);
}

export function parents(selector) {
    let parents = [],
        parent,
        i = 0,
        len = this.length;
    for (; i < len; i++) {
        parent = this[i].parentNode;
        while (parent) {
            if (selector) {
                if (MQ(parent).is(selector)) {
                    parents.push(parent);
                }
            } else {
                parents.push(parent);
            }
            parent = parent.parentNode;
        }
    }

    parents = MQ.unique(parents);
    return MQ(parents);
}

MQ.fn.extend({
    pushStack,
    find,
    eq,
    end,
    first,
    last,
    parent,
    parents
})
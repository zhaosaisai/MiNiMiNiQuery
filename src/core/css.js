export function getStyle(attr) {
    return this[0].currentStyle ? this[0].currentStyle[attr] : getComputedStyle(this[0], null)[attr];
}

MQ.fn.extend({
    getStyle
})
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
    let dom, //保存元素对象
        matchTag = /^\s*<(\w+|!)[^>]*>/g, //匹配普通的标签的形式
        selectorType = MQ.type(selector), //获取选择器的类型
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

export default init;
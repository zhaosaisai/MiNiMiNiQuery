import init from './init.js';
import extend from './extend.js';

//设置构造函数
function MQ(selector = ''){
    return new MQ.fn.init(selector);
}

MQ.fn = MQ.prototype = {
    constructor: MQ,
    init
}

//设置init的原型指向MQ的原型
MQ.fn.init.prototype = MQ.fn;

//设置继承方法
MQ.extend = MQ.fn.extend = extend;

//设置全局获取变量
window.MQ = window.JY = window.$ = MQ;

export default MQ;
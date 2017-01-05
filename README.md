# MiNiMiNiQuery
> 参考了一些类jquery库，整合了一些自己的东西。
> 通过这个小工程可以大致了解jquery内部机制，模块分的很清楚，可以直接阅读源码。如果你喜欢，就给个star吧 :bowtie:

### 模块介绍

**ajax模块**

  * 支持`get`和`post`提交
  * 几个参数
```javascript
   MQ.ajax({
     url:地址。默认是'/',
     type:提交方法。默认是'get',
     dataType:数据类型。text或者json。默认是json,
     data:发送的数据,
     success:成功回调,
     error:错误回调,
     complete:完成回调
   })
```

**animate模块**

  * 进行基本的动画，内部使用tween.js(参考[张鑫旭](https://github.com/zhangxinxu/Tween)),进行动画
  * 支持：  
`linear`,`easeIn`,`easeOu`t,`easeBoth`,`easeInStrong`,`easeOutStrong`,`easeBothStrong`,`elasticIn`,`elasticOutelasticBoth`,`backIn`,`backOut`,`backBoth`,`bounceIn`,`bounceOut`,`bounceBoth`这几种动画形式。
  
  * 几个参数
  
```javascript
   MQ("获取元素").animate({json对象，表示要运动的属性},options)
    options:{
     fx:运动形式，上面动画形式的某一种,默认linear
     duration:期望运动的事件,毫秒单位，默认1000--1s,
     callback:运动结束的回调函数
    }
  ```
  
> 其他模块建议大家直接阅读源码，了解内部机制

# MiNiMiNiQuery
参考了一些类jquery库，整合了一些自己的东西。
### 模块介绍
1. ajax模块
  * 支持get和post提交
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
2. animate模块
  * 进行基本的动画，内部使用tween.js(参考[张鑫旭](https://github.com/zhangxinxu/Tween)),进行动画
  * 支持：linear,easeIn,easeOut,easeBoth,easeInStrong,easeOutStrong,easeBothStrong,elasticIn,elasticOutelasticBoth,backIn,backOut,backBoth,bounceIn,bounceOut,bounceBoth这几种动画形式
  * 几个参数
  ```javascript
   MQ("获取元素").animate({json对象，表示要运动的属性},options)
    --options:{
     fx:运动形式，上面动画形式的某一种,默认linear
     duration:期望运动的事件,毫秒单位，默认1000--1s,
     callback:运动结束的回调函数
    }
  ```
3. #还有，懒，不想写，有一部分我参考其他人的，我都能看懂源码，你也行

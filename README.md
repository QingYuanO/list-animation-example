## 1.动机
在某些需求场景下需要滚动的时候触发一些动画，那么怎么在Taro中实现类似的行为呢？一般会考虑使用` usePageScroll`根据滚动的距离去触发动画，但是这种方法性能不好，如果在滚动的时候频繁的触setData会导致卡顿

那么什么是比较好的方法呢？下面介绍下Taro内的`animate`方法（经测试h5端无法使用）

先看下效果：


![935079d2e3890deedac10ce478017e2e_.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f09df774ac1a46ad8283da68880d0112~tplv-k3u1fbpfcp-watermark.image?)

## 2.animate方法
先来看下定义
```
animate(selector, keyframes, duration, ScrollTimeline)
```
属性        | 类型    | 默认值 | 必填 | 说明                                                 
| --------- | ------ | --- | -- | ---------------------------------------------------------
| selector  | String |     | 是  | 选择器 |
| keyframes | Array  |     | 是  | 关键帧信息                                               | duration  | Number |     | 是  | 动画持续时长（毫秒为单位）
| ScrollTimeline |Object |  | 是|绑定滚动元素的配置


**keyframes**是一个数组，数组的每项类似以下表格内容：
属性              | 类型     | 默认值    | 必填                          | 说明                          |
| --------------- | ------ | ------ | --------------------------- | --------------------------- |
| offset          | Number |        | 否                           | 关键帧的偏移，范围[0-1]              |
| ease            | String | linear | 否                           | 动画缓动函数                      |
| transformOrigin | String | 否      | 基点位置，即 CSS transform-origin |                             |
| 可选的css属性 | String |        | 否                           | 

**ScrollTimeline中对象的结构**

属性                | 类型     | 默认值      | 必填 | 说明                                                      |
| ----------------- | ------ | -------- | -- | ------------------------------------------------------- |
| scrollSource      | String |          | 是  | 指定滚动元素的选择器（只支持 scroll-view），该元素滚动时会驱动动画的进度              |
| orientation       | String | vertical | 否  | 指定滚动的方向。有效值为 horizontal 或 vertical                      |
| startScrollOffset | Number |          | 是  | 指定开始驱动动画进度的滚动偏移量，单位 px                                  |
| endScrollOffset   | Number |          | 是  | 指定停止驱动动画进度的滚动偏移量，单位 px                                  |
| timeRange         | Number |          | 是  | 起始和结束的滚动范围映射的时间长度，该时间可用于与关键帧动画里的时间 (duration) 相匹配，单位 ms

此方法的几个限制：
- h5端无法使用
- ScrollTimeline暂时只能绑定ScollView元素
## 3.使用方法
```ts 
//获取animate方法
const animate = Taro.getCurrentInstance()?.page?.animate;
//定义动画，以下是定义在0-85滚动距离内头像的动画（上面实例的头像）
animate(
  ".avatar",
  [
    {
      borderRadius: "0",
      borderColor: "red",
      transform: "scale(1) translateY(-20px)",
      offset: 0,
    },
    {
      borderRadius: "25%",
      borderColor: "blue",
      transform: "scale(.65) translateY(-20px)",
      offset: 0.5,
    },
    {
      borderRadius: "50%",
      borderColor: "blue",
      transform: `scale(.3) translateY(-20px)`,
      offset: 1,
    },
  ],
  2000,
  {
    scrollSource: "#scroller",
    timeRange: 2000,
    startScrollOffset: 0,
    endScrollOffset: 85,
  }
);
```
注意事项：
- 必须在元素渲染到页面上后再定义动画，也就是说在`useReady()`中定义。
- 如果`useReady()`定义也无效，建议包裹在`Taro.nextTick`中

tip:在微信小程序开发工具中无法看到触发动画时元素css变化

## 4.结尾
其他示例

![048f1e7e8b47b7cec049c3b37e49286c_.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a24c6f6204c4eb09595fcbdd980c14e~tplv-k3u1fbpfcp-watermark.image?)

原微信小程序[文档](https://developers.weixin.qq.com/miniprogram/dev/framework/view/animation.html)

[示例Taro源代码](https://github.com/QingYuanO/list-animation-example)

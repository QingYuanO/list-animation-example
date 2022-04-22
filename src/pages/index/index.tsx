import {
  Icon,
  OpenData,
  ScrollView,
  View,
  Text,
  BaseEventOrigFunction,
  ScrollViewProps,
} from "@tarojs/components";
import Taro, { nextTick, useReady } from "@tarojs/taro";
import { useRef, useState } from "react";
import "./index.less";

definePageConfig({
  navigationStyle: "custom",
});

const menuList = [
  {
    title: "海底捞（xxxx）",
    distance: Math.floor(1000 * Math.random()),
  },
  {
    title: "北京烤鸭（xxxx）",
    distance: Math.floor(1000 * Math.random()),
  },
  {
    title: "海底捞（xxxx）",
    distance: Math.floor(1000 * Math.random()),
  },
  {
    title: "北京烤鸭（xxxx）",
    distance: Math.floor(1000 * Math.random()),
  },
];

const Index = () => {
  const [statusBarHeight, setStatusBarHeight] = useState(
    () => (Taro.getSystemInfoSync().statusBarHeight ?? 0)
  );
  const [left, setLeft] = useState(
    () => Taro.getSystemInfoSync().windowWidth - 17
  );

  const [wording, setWording] = useState("查看更多");

  const [active, setActive] = useState(false);

  const [lastScrollLeft, setLastScrollLeft] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useReady(() => {
    startAnimate();
  });

  const startAnimate = () => {
    const animate = Taro.getCurrentInstance()?.page?.animate;

    Taro.createSelectorQuery()
      .select("#scroller")
      .fields(
        {
          scrollOffset: true,
          size: true,
        },
        (res) => {
          if (animate) {
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
            animate(
              ".nickname",
              [
                {
                  translateY: 0,

                },
                {
                  translateY: -44 - (statusBarHeight ?? 0),
                },
              ],
              1000,
              {
                scrollSource: "#scroller",
                timeRange: 1000,
                startScrollOffset: 120,
                endScrollOffset: 200,
              }
            );

            animate(
              ".search_input",
              [
                {
                  opacity: "0",
                  width: "0%",
                },
                {
                  opacity: "1",
                  width: "100%",
                },
              ],
              1000,
              {
                scrollSource: "#scroller",
                timeRange: 1000,
                startScrollOffset: 120,
                endScrollOffset: 252,
              }
            );

            animate(
              ".search_icon",
              [
                {
                  right: "0",
                  scale: [1],
                },
                {
                  right: Taro.getSystemInfoSync().windowWidth * 0.5 - 20 + "px",
                  scale: [.6],
                },
              ],
              1000,
              {
                scrollSource: "#scroller",
                timeRange: 1000,
                startScrollOffset: 140,
                endScrollOffset: 252,
              }
            );
          }
        }
      )
      .exec();

    Taro.nextTick(() => {
      Taro.createSelectorQuery()
        .select("#scroller2")
        .fields(
          {
            scrollOffset: true,
            size: true,
          },
          (res) => {
            // 绑定滚动元素
            console.log(res);

            const scrollTimeline = {
              scrollSource: "#scroller2",
              orientation: "horizontal",
              timeRange: 1000,
              startScrollOffset: 210 * menuList.length - res.width + 20,
              endScrollOffset: res.scrollWidth - res.width,
            };
            console.log(scrollTimeline);

            if (animate) {
              animate(
                "#transform",
                [
                  {
                    offset: 0,
                    width: "0px",
                  },
                  {
                    offset: 1,
                    width: "30px",
                  },
                ],
                1000,
                scrollTimeline
              );
            }
          }
        )
        .exec();
    });
  };

  const scroll = (e: any) => {
    console.log(e.detail.scrollLeft);

    if (
      e.detail.scrollLeft + Taro.getSystemInfoSync().windowWidth + 3 >=
      e.detail.scrollWidth
    ) {
      if (e.detail.deltaX < 0 && !active) {
        setActive(true);
        setWording("释放跳转");

        console.log(e);
        Taro.vibrateShort();
      } else if (e.detail.deltaX > 0) {
        setActive(false);
        setWording("查看更多");
      }
    } else {
      setActive(false);
    }
    setLastScrollLeft(e.detail.scrollLeft);
  };

  const touchend = () => {
    if (active) {
      Taro.navigateTo({
        url: "/pages/listAnimation/index",
      });
      setActive(false);
      setScrollLeft(
        210 * menuList.length -
          Taro.getSystemInfoSync().windowWidth +
          Math.random()
      );
    } else if (
      lastScrollLeft >
      210 * menuList.length - Taro.getSystemInfoSync().windowWidth
    ) {
      setScrollLeft(
        210 * menuList.length -
          Taro.getSystemInfoSync().windowWidth +
          Math.random()
      );
    }
  };

  return (
    <ScrollView id="scroller" scrollY>
      <View className="nav" style={{ paddingTop: statusBarHeight }}>
        <View className="nickname">
          <OpenData type="userNickName" lang="en"></OpenData>
        </View>
        <View className="search_bar" style={{ top: statusBarHeight }}>
          <View className="search_input">
            <Text>请输入商品名</Text>
          </View>
          <Icon className="search_Icon" type="search" size="15"></Icon>
        </View>
      </View>
      <View className="info" style={{ marginTop: statusBarHeight }}>
        <View className="avatar" style={{ top: statusBarHeight + 44 - 80 - 5 }}>
          <OpenData type="userAvatarUrl"></OpenData>
        </View>
        <View className="other">
          <View>
            <OpenData type="userProvince" lang="zh_CN"></OpenData> ·
            <OpenData type="userCity" lang="zh_CN"></OpenData>
          </View>
          <View className="follow">
            <Text>0</Text> 你关注 / <Text>0</Text> 关注你
          </View>
        </View>
        <View className="intro" onClick={startAnimate}>
          暂无描述
        </View>
        <View className="seperate"></View>
        <View className="menu">
          <ScrollView
            id="scroller2"
            scrollX
            style="width: 100%;"
            onScroll={scroll}
            onTouchEnd={touchend}
            scrollWithAnimation
            scrollLeft={scrollLeft}
          >
            <View
              className="menu_wrap"
              style={{ width: 210 * menuList.length + 70 }}
            >
              {menuList.map((item, idx) => (
                <View key={idx} className="menu_item">
                  <View className="menu_item_image"></View>
                  <View className="menu_item_info">
                    <View className="menu_item_title">{item.title}</View>
                    <View className="menu_item_distance">
                      {item.distance}米
                    </View>
                  </View>
                </View>
              ))}

              <View id="more" className="menu_item_more" style={{ left: left }}>
                <View className="text">{wording}</View>
                <View id="transform" className="transform"></View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View className="seperate"></View>
        <View className="tabs" style={{ top: statusBarHeight + 44 }}>
          <View className="tab_item">
            <View>点菜</View>
            <View className="line"></View>
          </View>
          <View className="tab_item">
            <View>评价</View>
            <View className="line"></View>
          </View>
        </View>
        <View className="list"></View>
        <View className="seperate"></View>
        <View className="list"></View>
      </View>
    </ScrollView>
  );
};

export default Index;

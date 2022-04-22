import { ScrollView, View } from "@tarojs/components";
import Taro,{useReady} from "@tarojs/taro";
import "./index.less";

const ListAnimation = () => {
  return (
    <ScrollView id="scroller" scrollY>
      {new Array(30).fill(1).map((_, idx) => (
        <ListItem key={idx} data={idx} />
      ))}
    </ScrollView>
  );
};

export default ListAnimation;

const ListItem = ({ data }) => {
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
              `.listItem${data}`,
              [
                {
                  transform: "scale(1)",
                  opacity:1,
                  // offset: 0,
                },
                {
                  transform: `scale(.4)`,
                  opacity:0.1,
                  // offset: 1,
                },
              ],
              1500,
              {
                scrollSource: "#scroller",
                timeRange: 1500,
                startScrollOffset: data * 90,
                endScrollOffset: data *90 + 90,
              }
            );
          }
        }
      )
      .exec();
  };
  return (
    <View
      style={{
        height: 80,
        margin: 10,
        borderRadius: 8,
        backgroundColor: "skyblue",
      }}
      className={`listItem${data}`}
    >
      {data}
    </View>
  );
};

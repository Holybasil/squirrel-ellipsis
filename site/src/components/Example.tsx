"use client";

import { useState } from "react";
import SquirrelEllipsis from "squirrel-ellipsis";

const EXAMPLE_TEXT =
  "Roughly a year ago I moved into my new apartment. One of the reasons I picked this apartment was age of the building. The construction was finished in 2015, which ensured pretty good thermal isolation for winters as well as small nice things like Ethernet ports in each room. However, there was one part of my apartment that was too new and too smart for me. ";

const EXAMPLE_TEXT_CHINESE =
  "和所有的婚礼一样，很快就结束了。和所有的婚礼一样，只留下失落心情。其实婚礼结束的瞬间最暧昧。人们大多会没事找事地约会，和在婚礼上遇到的朋友一起喝茶，或者看电影、购物。要不要直接回家？这样想着，不知为什么，我也很想约个人。一方面是心乱，一方面也是因为既然出了家门，就要舞动短裙散散心。朋友的婚礼无可挑剔。一百多年的哥特式西方建筑、祈祷般直上云霄的教堂姿态、透过五颜六色的彩绘玻璃的阳光、高雅的弦乐三重奏、俊美的嘉宾、从拱形天花板照射下来的温暖灯光和宗教氛围……";

const Example = () => {
  const [isExpended, setIsExpended] = useState(false);

  const handleClickMore = () => {
    setIsExpended(true);
  };

  const handleReflow = (clamped, displayedText) => {
    console.log(clamped, displayedText);
  };

  return (
    <div style={{ width: "1200px" }}>
      <SquirrelEllipsis
        text={EXAMPLE_TEXT}
        maxLine={2}
        action={
          <a
            style={{
              fontWeight: 400,
              color: "#5b5b5b",
              textDecorationLine: "underline",
            }}
          >
            More
          </a>
        }
        basedOn="words"
        onReflow={handleReflow}
      />
      <SquirrelEllipsis
        style={{ marginTop: "100px" }}
        text={EXAMPLE_TEXT_CHINESE}
        maxLine={2}
        ellipsis="... —《你的夏天还好吗》"
        action={
          <a
            style={{
              fontWeight: 400,
              color: "#5b5b5b",
              textDecorationLine: "underline",
            }}
          >
            More
          </a>
        }
        basedOn="words"
        onReflow={handleReflow}
      />
    </div>
  );
};

export default Example;

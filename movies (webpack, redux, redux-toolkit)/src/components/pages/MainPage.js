import { useEffect } from "react";

import { goTo } from "../../utils/Utils";

import MainBanner from "../mainBanner/MainBanner";
import MediaSlider from "../mediaSlider/MediaSlider";

function MainPage(props) {
  useEffect(() => {
    goTo();
  }, []);

  return (
    <div className="page">
      <MainBanner />
      <MediaSlider dataRequestType={'topRatedData'} dataType="movie" sliderTitle="TOP-20 movies" />
      <MediaSlider dataRequestType={'topRatedData'} dataType="tv" sliderTitle="TOP-20 tv-shows" />
    </div>
  )
}

export default MainPage;
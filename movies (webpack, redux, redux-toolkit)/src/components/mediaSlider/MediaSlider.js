import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTopRatedData, fetchSimilarData } from "./mediaSliderSlice";

import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import ErrorMessage from "../appErrorMessage/AppErrorMessage";
import Spinner from "../appSpinner/AppSpinner";
import MediaItem from '../mediaItem/MediaItem';

import 'swiper/scss';
import './mediaSlider.scss';

function MediaSlider({sliderTitle, dataRequestType, dataType, id = null}) {
  const mediaSliderDataLoadingStatus = useSelector(state => state.mediaSlider.mediaSliderDataLoadingStatus);
  const topRatedData = useSelector(state => state.mediaSlider.topRatedData);
  const similarData = useSelector(state => state.mediaSlider.similarData);
  const dispatch = useDispatch();
  const swiperPrevRef = useRef();
  const swiperNextRef = useRef();
  let data = dataRequestType === 'topRatedData' ? topRatedData[dataType] : similarData;

  useEffect(() => {
    switch (dataRequestType) {
      case 'topRatedData':
        if(!data.length) {
          dispatch(fetchTopRatedData(dataType));
        }
        break;
      case 'similarData':
        dispatch(fetchSimilarData({dataType, id}));
        break;
    }
  }, []);

  const renderSlides = () => {
    const slides =  data.map(item => {
      return (
        <SwiperSlide className="media-slider__slide" key={item.id}>
          <MediaItem {...item} />
        </SwiperSlide>
      )
    });

    return slides;
  }

  let content = 'Nothing found...';

  if (mediaSliderDataLoadingStatus === "loading") {
    content = <Spinner/>;
  } else if (mediaSliderDataLoadingStatus === "error") {
    content = <ErrorMessage />;
  } else if (data.length) {
    content = renderSlides();
  }

  return (
    <section className='media-slider__section _animateIn'>
      <div className="container">
        <div className="media-slider__top">
          <h2 className="media-slider__title title">
            {sliderTitle}
          </h2>

          <div className="media-slider__nav">
            <button className="media-slider__nav-btn media-slider__nav-btn--prev"
                    type="button"
                    ref={swiperPrevRef}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" />
                      </svg>
            </button>
            <button className="media-slider__nav-btn media-slider__nav-btn--next"
                    type="button"
                    ref={swiperNextRef}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                      </svg>
            </button>
          </div>
        </div>

        <Swiper
          className='media-slider'
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={4}
          navigation={{
            prevEl: swiperPrevRef.current,
            nextEl: swiperNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = swiperPrevRef.current;
            swiper.params.navigation.nextEl = swiperNextRef.current;
          }}
          breakpoints={{
            0: {
              spaceBetween: 20,
              slidesPerView: 1.5,
            },
            640: {
              spaceBetween: 20,
              slidesPerView: 3,
            },
            880: {
              spaceBetween: 20,
              slidesPerView: 4,
            },
            1101: {
              spaceBetween: 30,
              slidesPerView: 4,
            },
          }}
        >
          {content}
        </Swiper>
      </div>
    </section>
  )
}

export default MediaSlider;
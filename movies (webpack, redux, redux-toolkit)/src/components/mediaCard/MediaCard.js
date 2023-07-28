import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSingleData, fetchSingleDataCredits } from "./singleDataSlice";

import SimpleBar from 'simplebar-react';
import { goTo, numberWithSpaces } from '../../utils/Utils';

import ErrorMessage from "../appErrorMessage/AppErrorMessage";
import Spinner from "../appSpinner/AppSpinner";
import MediaSlider from "../mediaSlider/MediaSlider";

import 'simplebar-react/dist/simplebar.min.css';
import "./mediaCard.scss";

function MediaCard({dataType}) {
  const { id } = useParams();
  const singleData = useSelector(state => state.singleData.singleDataInfo);
  const singleDataLoadingStatus = useSelector(state => state.singleData.singleDataLoadingStatus);
  const singleDataCredits = useSelector(state => state.singleData.singleDataCredits);
  const singleDataCreditsLoadingStatus = useSelector(state => state.singleData.singleDataCreditsLoadingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSingleData({dataType, id}));
    dispatch(fetchSingleDataCredits({dataType, id}));
    goTo();
  }, [id]);

  if(singleDataLoadingStatus === 'loading') {
    return <Spinner/>;
  } else if (singleDataLoadingStatus === 'error') {
    return <ErrorMessage/>;
  } else if (!singleData) {
    return 'Nothing found...';
  }

  const { imageBg, image, title, date, genres, rating, runtime, description, budget, revenue } = singleData;
  let ratingColor = { backgroundColor: "#008000" };

  if (rating === 0) {
    ratingColor.backgroundColor = "#686868";
  } else if (rating < 2.5) {
    ratingColor.backgroundColor = "#c20000";
  } else if (rating < 5) {
    ratingColor.backgroundColor = "#ffa500";
  } else if (rating < 7.5) {
    ratingColor.backgroundColor = "#d9dd00";
  }

  const renderGenres = () => {
    if (genres.length) {
      const items = genres.map(({ id, name }) => {
        return <li key={id}>{name}</li>;
      });
      return items;
    } else {
      return <span>Nothing found...</span>;
    }
  };

  const renderActors = () => {
    return singleDataCredits.map(({id, photo, name, character}) => {
      return (
        <div className="media-card__actor" key={id}>
          <div className="media-card__actor-photo">
            {photo ? <img src={photo} alt={name} /> : null}
          </div>
          <div className="media-card__actor-info">
            <div className="media-card__actor-name">{name}</div>
            <div className="media-card__actor-character">{character}</div>
          </div>
        </div>
      )
    })
  };

  let actorsList =  'Actors not found...';

  if (singleDataCreditsLoadingStatus === "loading") {
    actorsList = <Spinner/>;
  } else if (singleDataCreditsLoadingStatus === "error") {
    actorsList = <ErrorMessage />;
  } else if (singleDataCredits.length) {
    actorsList = renderActors();
  }

  return (
    <div className="media-card">
      <div className="media-card__top _animateIn">
        <div className="media-card__bg">
          <img src={imageBg} alt="" />
        </div>

        <div className="container">
          <div className="media-card__title media-card__title--mobile">
            {title} <span>({new Date(date).getFullYear()})</span>
          </div>

          <div className="media-card__poster">
            <div className="media-card__rating" style={ratingColor}>
              <span>{rating}</span>
            </div>
            {image ? <img src={image} alt="#" /> : null}
          </div>

          <div className="media-card__info">
            <h1 className="media-card__title media-card__title--desktop">
              {title} <span>({new Date(date).getFullYear()})</span>
            </h1>

            <div className="media-card__genres">
              <div className="media-card__subtitle">Genre:</div>

              <ul className="media-card__genres-list">
                { renderGenres() }
              </ul>
            </div>

            {runtime ? (
              <div className="media-card__runtime">
                <div className="media-card__subtitle">Runtime:</div>
                <span>{runtime} minutes</span>
              </div>
            ) : null}

            <div className="media-card__description">
              <div className="media-card__subtitle">Description:</div>
              <div className="media-card__txt">{description}</div>
            </div>

            <div className="media-card__info-row">
              {budget ? (
                <div className="media-card__info-row-item">
                  <div className="media-card__subtitle">Budget:</div>
                  <div className="media-card__txt">{numberWithSpaces(budget)} $</div>
                </div>
              ) : null}

              {revenue ? (
                <div className="media-card__info-row-item">
                  <div className="media-card__subtitle">Revenue:</div>
                  <div className="media-card__txt">{numberWithSpaces(revenue)} $</div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="media-card__actors _animateIn">
        <div className="container">
          <div className="media-card__actors-title title">Cast</div>
          <SimpleBar className="simplebar media-card__actors-list-wrapper" forceVisible="y" autoHide={false}>
            <div className="media-card__actors-list">
              { actorsList }
            </div>
          </SimpleBar>
        </div>
      </div>

      <MediaSlider dataRequestType={'similarData'}
                   dataType={dataType}
                   id={id}
                   sliderTitle={(dataType === 'movie') ? 'Similar movies' : 'Similar tv-shows'} />
    </div>
  );
}

export default MediaCard;
import { Link } from 'react-router-dom';

import './mediaItem.scss';

function MediaItem(props) {
  const {dataType, id, title, description, image, date, rating} = props;
  const linkUrl = `/${dataType}/${id}`;
  let ratingColor = {backgroundColor: '#008000'};

  if (rating === 0) {
    ratingColor.backgroundColor = "#686868";
  } else if(rating < 2.5) {
    ratingColor.backgroundColor = '#c20000';
  } else if (rating < 5) {
    ratingColor.backgroundColor = '#ffa500';
  } else if (rating < 7.5) {
    ratingColor.backgroundColor = '#d9dd00';
  }

  return (
    <div className="media-item">
      <Link to={linkUrl} className="media-item__img">
        {image ? <img src={image} /> : null}
      </Link>
      
      <div className="media-item__body">
        <Link to={linkUrl} className="media-item__title">{title}</Link>

        <div className="media-item__info">
          <div className="media-item__date">{date}</div>
          <div className="media-item__rating" style={ratingColor}><span>{rating}</span></div>
        </div>

        <div className="media-item__desr">
          {description.length > 90 ? description.substr(0, 87) + '...' : description}
        </div>
      </div>
    </div>
  )
}

export default MediaItem;
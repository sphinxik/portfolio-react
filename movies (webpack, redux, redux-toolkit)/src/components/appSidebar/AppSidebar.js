import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchDataGenres, setActiveDataGenres, setDataFilters } from './filtersSlice';
import Select from "react-select";
import ReactSlider from "react-slider";

import ErrorMessage from "../appErrorMessage/AppErrorMessage";
import Spinner from "../appSpinner/AppSpinner";
import "./appSidebar.scss";

function AppSidebar({ dataType }) {
  const sortDataOptions = useSelector(state => state.filters.sortDataOptions);
  const genresLoadingStatus = useSelector(state => state.filters.genresLoadingStatus);
  const activeDataGenres = useSelector(state => state.filters.activeDataGenres);
  const dataGenres = useSelector(state => state.filters.dataGenres);
  const dispatch = useDispatch();

  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const refSortSelect = useRef();
  const refDateSlider = useRef();
  const refRatingSlider = useRef();
  const refDateFromInput = useRef();
  const refDateToInput = useRef();
  const refRatingInput = useRef();
  const filterDateDefaultValue = [1965, new Date().getFullYear()];
  const filterRatingDefaultValue = 6;

  useEffect(() => {
    document.addEventListener('click', toggleMobileSidebar);
    return () => {
      document.removeEventListener('click', toggleMobileSidebar);
    }
  }, []);

  useEffect(() => {
    if(refSortSelect.current) {
      refSortSelect.current.setValue('');
    }

    if(refDateSlider.current) {
      refDateSlider.current.state.value = filterDateDefaultValue;
      refDateFromInput.current.value = filterDateDefaultValue[0];
      refDateToInput.current.value = filterDateDefaultValue[1];
    }

    if(refRatingSlider.current) {
      refRatingSlider.current.state.value = [filterRatingDefaultValue];
      refRatingInput.current.value = filterRatingDefaultValue;
    }

    dispatch(setDataFilters(null));
    dispatch(setActiveDataGenres(""));
    dispatch(fetchDataGenres(dataType));
  }, [dataType]);

  const toggleMobileSidebar = (e) => {
    if(e.target.closest('.media-catalog__filter-btn')) {
      setSidebarMobileOpen(true);
    }

    if(e.target.closest('.sidebar-close__btn') || (!e.target.closest('.sidebar') && !e.target.closest('.media-catalog__filter-btn') && !e.target.closest('.sidebar-select__menu'))) {
      setSidebarMobileOpen(false);
    }
  }

  const onFiltersSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formResult = {};

    formData.forEach((value, key) => {
      if (key === "genres") {
        formResult[key] ? (formResult[key] += `,${value}`) : (formResult[key] = value);
      } else {
        formResult[key] = value;
      }
    });

    if (formResult.genres) {
      dispatch(setActiveDataGenres(formResult.genres));
    }

    setSidebarMobileOpen(false);
    dispatch(setDataFilters(formResult));
  };

  const renderGenresItems = () => {
    return dataGenres.map(({ id, name }) => {
      const isChecked = activeDataGenres.includes(id);
      
      return (
        <li key={dataType + '_' + id}>
          <label className="check-label"> 
            <input className="check-input" type="checkbox" name="genres" value={id} defaultChecked={isChecked} />
            <span className="check-custom">{name}</span>
          </label>
        </li>
      );
    });
  };

  let genresItems = 'Not found...';

  if (genresLoadingStatus === "loading") {
    genresItems = <Spinner/>;
  } else if (genresLoadingStatus === "error") {
    genresItems = <ErrorMessage />;
  } else if (dataGenres.length) {
    genresItems = renderGenresItems();
  }

  return (
    <aside className={"sidebar _animateIn " + (sidebarMobileOpen ? 'is-active' : '')}>
      <button className="sidebar-close__btn" type="button">
        <span></span>
        <span></span>
      </button>

      <form onSubmit={onFiltersSubmit} className="sidebar-filters">
        <div className="sidebar-filters__item">
          <div className="sidebar-filters__title">Sort by</div>
          <div className="sidebar-filters__item-body">
            <Select
              ref={refSortSelect}
              className="sidebar-select"
              classNamePrefix="sidebar-select"
              name="sortBy"
              defaultValue={""}
              isSearchable={false}
              options={sortDataOptions}
            />
          </div>
        </div>

        <div className="sidebar-filters__item">
          <div className="sidebar-filters__title">Release Dates</div>
          <div className="sidebar-filters__item-body">
            <div className="sidebar-filters__date-range">
              <ReactSlider
                ref={refDateSlider}
                className="sidebar-filters__date-slider range-slider"
                thumbClassName="range-slider__thumb"
                trackClassName="range-slider__track"
                defaultValue={filterDateDefaultValue}
                min={filterDateDefaultValue[0]}
                max={filterDateDefaultValue[1]}
                pearling
                minDistance={0}
                onChange={(values, index) => {
                  refDateFromInput.current.value = values[0];
                  refDateToInput.current.value = values[1];
                }}
              />

              <div className="sidebar-filters__date-range-row">
                <input className="sidebar-filters__date-input" ref={refDateFromInput} type="text" name="dateFrom" defaultValue={filterDateDefaultValue[0]} readOnly />
                <input className="sidebar-filters__date-input" ref={refDateToInput} type="text" name="dateTo" defaultValue={filterDateDefaultValue[1]} readOnly />
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar-filters__item">
          <div className="sidebar-filters__title">Genres</div>
          <div className="sidebar-filters__item-body">
            <ul className="sidebar-filters__genres">
              {genresItems}
            </ul>
          </div>
        </div>

        <div className="sidebar-filters__item">
          <div className="sidebar-filters__title">Rating (min)</div>
          <div className="sidebar-filters__item-body">
            <input type="hidden" name="rating" ref={refRatingInput} defaultValue={filterRatingDefaultValue} />
            <ReactSlider
              ref={refRatingSlider}
              className="sidebar-filters__rating-slider range-slider range-slider--oneThumb"
              thumbClassName="range-slider__thumb"
              trackClassName="range-slider__track"
              defaultValue={filterRatingDefaultValue}
              min={0}
              max={10}
              pearling
              minDistance={0}
              renderThumb={(props, state) => (
                <div {...props}>
                  <span>{state.valueNow}</span>
                </div>
              )}
              onAfterChange={(values, index) => {
                refRatingInput.current.value = values;
              }}
            />
          </div>
        </div>

        <button className="sidebar-filters__btn" type="submit">
          Filter
        </button>
      </form>
    </aside>
  );
}

export default AppSidebar;

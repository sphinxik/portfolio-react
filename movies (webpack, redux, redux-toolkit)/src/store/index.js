import { configureStore } from '@reduxjs/toolkit';
import data from "../components/pages/dataSlice";
import filters from "../components/appSidebar/filtersSlice";
import singleData from "../components/mediaCard/singleDataSlice";
import mediaSlider from "../components/mediaSlider/mediaSliderSlice"

const stringMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'string') {
    return next({
      type: action
    });
  }
  return next(action);
};

const store = configureStore({
  reducer: {data, filters, singleData, mediaSlider},
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;

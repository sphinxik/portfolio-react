import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import useTMDBService from '../../services/TMDBService';

const initialState = {
  mediaSliderDataLoadingStatus: "idle",
  topRatedData: {
    movie: [],
    tv: [],
  },
  similarData: [],
};

export const fetchTopRatedData = createAsyncThunk(
  'mediaSlider/fetchTopRatedData',
  async (dataType) => {
    const { getTopRatedData } = useTMDBService();
    const data = await getTopRatedData(dataType);
    return {dataType, data};
  }
);

export const fetchSimilarData = createAsyncThunk(
  'mediaSlider/fetchSimilarData',
  async (fetchSettings) => {
    const { getSimilarData } = useTMDBService();
    return await getSimilarData(fetchSettings.dataType, fetchSettings.id);
  }
);

const mediaSliderSlice = createSlice({
  name: 'mediaSlider',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopRatedData.pending, (state) => {
        state.mediaSliderDataLoadingStatus = 'loading';
      })
      .addCase(fetchTopRatedData.fulfilled, (state, action) => {
        state.mediaSliderDataLoadingStatus = 'idle';
        state.topRatedData[action.payload.dataType] = action.payload.data;
      })
      .addCase(fetchTopRatedData.rejected, (state) => {
        state.mediaSliderDataLoadingStatus = 'error';
      })
      .addCase(fetchSimilarData.pending, (state) => {
        state.mediaSliderDataLoadingStatus = 'loading';
      })
      .addCase(fetchSimilarData.fulfilled, (state, action) => {
        state.mediaSliderDataLoadingStatus = 'idle';
        state.similarData = action.payload;
      })
      .addCase(fetchSimilarData.rejected, (state) => {
        state.mediaSliderDataLoadingStatus = 'error';
      })
      .addDefaultCase(() => {})
  }
});

const { actions, reducer } = mediaSliderSlice;
export default reducer;
export const {} = actions;
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for this slice
const initialState = {
  isLoading: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  // Reducers define how the state can be updated
  reducers: {
    showLoader: (state) => {
      state.isLoading = true;
    },
    hideLoader: (state) => {
      state.isLoading = false;
    },
  },
});

// Export the actions so they can be dispatched from any component
export const { showLoader, hideLoader } = loadingSlice.actions;

// Export the reducer to be included in the main store
export default loadingSlice.reducer;

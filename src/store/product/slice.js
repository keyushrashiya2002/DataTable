// Import statements for fetchProduct function and createAsyncThunk
import { createSlice } from "@reduxjs/toolkit";
import { getProduct } from "./thunk";

// Initial state definition
let initialState = {
  isSubmitting: false,
  formError: {},
  success: null,
  loading: false,
  error: null,
  data: [],
  itemDetails: {},
  filter: {},
};

// Create slice
const slice = createSlice({
  name: "Product",
  initialState,
  reducers: {
    setProductFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearProductFilter: (state, action) => {
      state.filter = {};
    },
  },
  // Extra reducers to handle async actions
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error && action.error.message
            ? action.payload || action.payload.message
            : "An error occurred during fetch product";
      });
  },
});

export const { setProductFilter, resetProductFormError, clearProductFilter } =
  slice.actions;
export default slice.reducer;
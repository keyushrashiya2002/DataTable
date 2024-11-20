import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../../helpers/fakebackend_helper";

export const getProduct = createAsyncThunk(
  "getProduct",
  async (values, { rejectWithValue, getState }) => {
    try {
      const { filter } = getState().Product;
      // Call the fetchProduct function to authenticate user
      const response = await getProducts({ ...values, ...filter });

      // Return response data
      return response;
    } catch (error) {
      // Handle errors
      const errorMessage =
        error.response?.data?.message || // Check if error message is available in response
        error.message || // Otherwise, use generic error message
        "Oops! Something went wrong.";

      // Reject with error message
      return rejectWithValue(errorMessage);
    }
  }
);

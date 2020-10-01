import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../axios-orders";

const initialState = {
  orderBurgerStatus: null,
  orderBurgerError: null,
};

export const orderBurger = createAsyncThunk(
  "contactData/orderBurger",
  async ({ order, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/orders.json?auth=" + token, order);
      return response.data;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err.message);
    }
  }
);

const contactDataSlice = createSlice({
  name: "contactData",
  initialState,
  reducers: {
    orderBurgerRefreshed(state, action) {
      state.orderBurgerStatus = "idle";
      state.orderBurgerError = null;
    },
  },
  extraReducers: {
    [orderBurger.pending]: (state) => {
      state.orderBurgerStatus = "loading";
    },
    [orderBurger.fulfilled]: (state) => {
      state.orderBurgerStatus = "succeeded";
    },
    [orderBurger.rejected]: (state, action) => {
      state.orderBurgerStatus = "failed";
      state.orderBurgerError = action.payload;
    },
  },
});

export const { orderBurgerRefreshed } = contactDataSlice.actions;

export default contactDataSlice.reducer;

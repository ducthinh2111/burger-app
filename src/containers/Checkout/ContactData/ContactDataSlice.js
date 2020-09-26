import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../../axios-orders';

const initialState = {
  orderBurgerStatus: "idle",
  orderBurgerError: null,
};

export const orderBurger = createAsyncThunk(
  "contactData/orderBurger",
  async (order) => {
    const response = await axios.post("/orders.json", order);
    return response.data;
  }
);

const contactDataSlice = createSlice({
  name: "contactData",
  initialState,
  reducers: {
    orderBurgerRefreshed(state) {
      state.orderBurgerStatus = "idle";
    },
  },
  extraReducers: {
    [orderBurger.pending]: (state) => {
      state.orderBurgerStatus = 'loading';
    },
    [orderBurger.fulfilled]: (state) => {
      state.orderBurgerStatus = 'succeeded';
    },
    [orderBurger.rejected]: (state, action) => {
      state.orderBurgerStatus = 'failed';
      state.orderBurgerError = action.error.message;
    }
  }
});

export const { orderBurgerRefreshed } = contactDataSlice.actions;

export default contactDataSlice.reducer;

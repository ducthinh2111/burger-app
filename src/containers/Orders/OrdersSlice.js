import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "../../axios-orders";
import { normalize, schema } from "normalizr";

export const orderEntity = new schema.Entity("orders");

const orderAdapter = createEntityAdapter();

const initialState = orderAdapter.getInitialState({
  fetchOrdersStatus: "idle",
  fetchOrdersError: null,
});

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const res = await axios.get("/orders.json");
  const fetchedOrders = Object.keys(res.data).map((key) => {
    return { id: key, ...res.data[key] };
  });
  const normalized = normalize(fetchedOrders, [orderEntity]);
  console.log(normalized);
  return normalized.entities;
});

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    fetchOrdersRefreshed(state) {
      state.fetchOrdersStatus = "idle";
    },
  },
  extraReducers: {
    [fetchOrders.pending]: (state, action) => {
      state.fetchOrdersStatus = "loading";
    },
    [fetchOrders.fulfilled]: (state, action) => {
      state.fetchOrdersStatus = "succeeded";
      orderAdapter.upsertMany(state, action.payload.orders);
    },
    [fetchOrders.rejected]: (state, action) => {
      state.fetchOrdersStatus = "failed";
      state.fetchOrdersError = action.error.message;
    },
  },
});

export const { fetchOrdersRefreshed } = ordersSlice.actions;

export default ordersSlice.reducer;

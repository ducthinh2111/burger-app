import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios-orders";
import produce from "immer";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

const initialState = {
  ingredients: null,
  totalPrice: 0,
  fetchIngredientsStatus: "idle",
  fetchIngredientsError: null,
  purchasable: false,
};

const updatePurchaseState = (ingredients) => {
  const sum = Object.keys(ingredients)
    .map((key) => {
      return ingredients[key];
    })
    .reduce((sum, el) => sum + el, 0);

  return sum > 0;
};

export const fetchIngredients = createAsyncThunk(
  "burgerBuilder/fetchIngredients",
  async () => {
    const response = await axios.get("/ingredients.json");
    return response.data;
  }
);

const burgerBuilderSlice = createSlice({
  name: "burgerBuilder",
  initialState,
  reducers: {
    purchaseStateUpdated(state) {
      state.purchasable = updatePurchaseState(state.ingredients);
      state.totalPrice = Object.keys(state.ingredients).reduce((price, e) => {
        return (price += INGREDIENT_PRICES[e] * state.ingredients[e]);
      }, 0);
    },
    ingredientAdded(state, action) {
      state.ingredients[action.payload.type]++;
      state.totalPrice += INGREDIENT_PRICES[action.payload.type];
      state.purchasable = updatePurchaseState(state.ingredients);
    },
    ingredientRemoved(state, action) {
      if (state.ingredients[action.payload.type] > 0) {
        state.ingredients[action.payload.type]--;
        state.totalPrice -= INGREDIENT_PRICES[action.payload.type];
        state.purchasable = updatePurchaseState(state.ingredients);
      }
    },
    fetchIngredientsRefreshed(state) {
      state.fetchIngredientsStatus = "idle";
      state.ingredients = null;
      state.totalPrice = 0;
      state.purchasable = false;
    },
  },
  extraReducers: {
    [fetchIngredients.pending]: (state, action) => {
      state.fetchIngredientsStatus = "loading";
    },
    [fetchIngredients.fulfilled]: (state, action) => {
      state.fetchIngredientsStatus = "succeeded";
      state.ingredients = produce(action.payload, (draft) => {});
    },
    [fetchIngredients.rejected]: (state, action) => {
      state.fetchIngredientsStatus = "failed";
      state.fetchIngredientsError = action.error.message;
    },
  },
});

export const {
  ingredientAdded,
  ingredientRemoved,
  purchaseStateUpdated,
  fetchIngredientsRefreshed,
} = burgerBuilderSlice.actions;

export default burgerBuilderSlice.reducer;

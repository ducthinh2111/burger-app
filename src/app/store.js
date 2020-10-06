import { configureStore, compose } from "@reduxjs/toolkit";
import burgerBuilderReducer from "../containers/BurgerBuilder/burgerBuilderSlice";
import contactDataReducer from "../containers/Checkout/ContactData/ContactDataSlice";
import ordersReducer from "../containers/Orders/OrdersSlice";
import authReducer from "../containers/Auth/AuthSlice";

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSIONS_COMPOSE__
    : null || compose;

export default configureStore({
  reducer: {
    burgerBuilder: burgerBuilderReducer,
    contactData: contactDataReducer,
    orders: ordersReducer,
    auth: authReducer,
  },
  composeEnhancers: [composeEnhancers],
});

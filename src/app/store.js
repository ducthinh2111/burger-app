import { configureStore } from "@reduxjs/toolkit";
import burgerBuilderReducer from "../containers/BurgerBuilder/burgerBuilderSlice";
import contactDataReducer from "../containers/Checkout/ContactData/ContactDataSlice";
import ordersReducer from "../containers/Orders/OrdersSlice";
import authReducer from "../containers/Auth/AuthSlice";

export default configureStore({
  reducer: {
    burgerBuilder: burgerBuilderReducer,
    contactData: contactDataReducer,
    orders: ordersReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV === "development",
});

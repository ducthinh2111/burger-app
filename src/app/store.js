import { configureStore } from "@reduxjs/toolkit";
import burgerBuilderReducer from "../containers/BurgerBuilder/burgerBuilderSlice";
import contactDataReducer from "../containers/Checkout/ContactData/ContactDataSlice";
import ordersReducer from "../containers/Orders/OrdersSlice";

export default configureStore({
  reducer: {
    burgerBuilder: burgerBuilderReducer,
    contactData: contactDataReducer,
    orders: ordersReducer,
  },
});

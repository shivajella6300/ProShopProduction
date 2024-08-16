//import "bootstrap/dist/css/bootstrap.min.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import AdminRoute from "./components/AdminRoute.js";
import PrivateRoute from "./components/PrivateRoute.js";
import reportWebVitals from "./reportWebVitals";
import OrderListScreen from "./screens/admin/OrderListScreen.js";
import ProductEditScreen from "./screens/admin/ProductEditScreen.js";
import ProductListScreen from "./screens/admin/ProductListScreen.js";
import CartScreen from "./screens/CartScreen.js";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen.js";
import OrderScreen from "./screens/OrderScreen.js";
import PaymentScreen from "./screens/PaymentScreen.js";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.js";
import ProductScreen from "./screens/ProductScreen";
import ProfileScreen from "./screens/ProfileScreen.js";
import RegisterScreen from "./screens/RegisterScreen.js";
import ShippingScreen from "./screens/ShippingScreen.js";
import store from "./store.js";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/placeorder" element={<PlaceOrderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderListScreen />} />
        <Route path="/admin/productlist" element={<ProductListScreen />} />
        <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
      </Route>
    </Route>
  )
);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();

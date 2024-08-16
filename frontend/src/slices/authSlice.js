import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: 
  {
    setCredentials: (state, action) => 
    {
      //This is Storing in the Redux state here;
      state.userInfo = action.payload;
      //This is storage Local Storing;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },

    logout: (state, action) => {
      state.userInfo = null;
      // NOTE: here we need to also remove the cart from storage so the next
      // logged in user doesn't inherit the previous users cart and shipping
      localStorage.removeItem("userInfo");
      // localStorage.clear();
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

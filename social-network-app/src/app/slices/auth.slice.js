import { createSlice } from "@reduxjs/toolkit";
import {
  getDataFromLocalStorage,
  setDataToLocalStorage,
} from "../../utils/localStorageUtils";
import { authApi } from "../services/auth.service";

const defaultState = {
  auth: null,
  token: null,
  isAuthenticated: false,
};

const initialState = getDataFromLocalStorage("authSnw")
  ? getDataFromLocalStorage("authSnw")
  : defaultState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      setDataToLocalStorage("authSnw", defaultState);
      return defaultState;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.auth = action.payload.auth;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;

        setDataToLocalStorage("authSnw", state);
      }
    );
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

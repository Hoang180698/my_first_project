import { createSlice } from "@reduxjs/toolkit";
import {
  getDataFromLocalStorage,
  setDataToLocalStorage,
} from "../../utils/localStorageUtils";
import { authApi } from "../services/auth.service";
import { userApi } from "../services/user.service";

const defaultState = {
  auth: null,
  token: null,
  refreshToken: null,
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
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = action.payload.isAuthenticated;

        setDataToLocalStorage("authSnw", state);
      }
    );
    builder.addMatcher(
      userApi.endpoints.updateUser.matchFulfilled,
      (state, action) => {
        // console.log(action.payload)
        state.auth = action.payload;
        setDataToLocalStorage("authSnw", state);
      }
    );
    builder.addMatcher(
      userApi.endpoints.uploadAvatar.matchFulfilled,
      (state, action) => {
        // console.log(action.payload)
        state.auth.avatar = action.payload.url;
        setDataToLocalStorage("authSnw", state);
      },
    );
    builder.addMatcher(
      userApi.endpoints.deleteAvatar.matchFulfilled,
      (state, action) => {
        // console.log(action.payload)
        state.auth.avatar = null;
        setDataToLocalStorage("authSnw", state);
      },
    );
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, action) => {
        // console.log(action.payload)
        state.token = action.payload.accessToken;
        setDataToLocalStorage("authSnw", state);
      },
    );
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

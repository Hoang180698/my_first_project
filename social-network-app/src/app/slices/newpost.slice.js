import { createSlice } from '@reduxjs/toolkit'
import { postApi } from '../services/posts.service';

const initialState = {
    count: 0,
}

const newpostSlice = createSlice({
  name: "newpost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      postApi.endpoints.createPost.matchFulfilled,
      (state) => {
        state.count += 1;
        return state;
      }
    );
    builder.addMatcher(
        postApi.endpoints.createPostWithImages.matchFulfilled,
        (state) => {
          state.count += 1;
          return state;
        }
      );
  },
});

export const {} = newpostSlice.actions

export default newpostSlice.reducer
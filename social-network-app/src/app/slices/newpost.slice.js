import { createSlice } from '@reduxjs/toolkit'
import { postApi } from '../services/posts.service';

const initialState = {
    postIds: [],
}

const newpostSlice = createSlice({
  name: "newpost",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      postApi.endpoints.createPost.matchFulfilled,
      (state, action) => {
        state.postIds.push(action.payload.id);
        return state;
      }
    );
  },
});

export const {} = newpostSlice.actions

export default newpostSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentConversationId: 0,
}

const currentConversationIdSlice = createSlice({
  name: "currentConversationId",
  initialState,
  reducers: {
    setCurrentConversationId: (state, action) => {
        state.currentConversationId = action.payload.id;
    }
  },
});

export const { setCurrentConversationId } = currentConversationIdSlice.actions;

export default currentConversationIdSlice.reducer
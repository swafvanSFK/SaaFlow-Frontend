import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversation: []
    },
    reducers: {
        setConversation: (state, action) => {
            state.conversation = action.payload
        },
        addConversation: (state, action) => {
            state.conversation.unshift(action.payload)
        }
    }
})

export const { setConversation, addConversation } = conversationSlice.actions
export default conversationSlice.reducer
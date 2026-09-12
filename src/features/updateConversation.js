import api from "../../utils/axios"

const updateConversation = async (payload) => {
    try {
        const { data } = await api.post("/api/chat/update-conversation", payload)
        return data
    } catch (error) {
        console.log("Error in creating conversation", error)
        return []
    }
}

export default updateConversation
import api from "../../utils/axios.js"

const getCurrentUser = async () => {
    try {
        const {data} = await api.get("/api/me")
        return data
    } catch (error) {
        console.log('Error getting current user ------------ > ', error)
        return null
    }
}

export default getCurrentUser
import api from "../../utils/axios.js"

const getCurrentUser = async () => {
    try {
        const {data} = await api.get("/api/me")
        console.log('current user data-------------- >', data)
    } catch (error) {
        console.log('Error getting current user ------------ > ', error)
    }
}

export default getCurrentUser
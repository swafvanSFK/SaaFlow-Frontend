import api from "../../utils/axios"

const logout = async () => {
    try {
        const { data } = await api.get('/api/auth/logout')
        console.log('data----------------- >', data)
    } catch (error) {
        console.log(error)
    }
}


export default logout
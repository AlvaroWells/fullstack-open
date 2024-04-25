import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => { //->recuperamos por parámetro las credenciales del login
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }


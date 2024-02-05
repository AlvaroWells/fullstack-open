import axios from "axios";
const baseUrl = 'http://localhost:3001/persons'


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(res => res.data)
}

const createObject = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(res => res.data)
}

const updateObject = (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson)
  return request.then(res => res.data)
}

const deleteObject = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(res => res.data)
}



export default { getAll, createObject, deleteObject, updateObject }
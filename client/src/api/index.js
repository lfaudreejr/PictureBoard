import axios from 'axios'
import * as auth from '../authentication/AuthService'

export const getToken = () => {
  return localStorage.getItem('access_token')
}

function getId () {
  const profile = auth.getUserProfile()
  return profile.id
}

/**
 * Exports
 */

// Post requests
export const post = (route, body) => {
  return axios.post(route, body, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Profile: getId()
    }
  })
}
// Get requests
export const get = (route) => {
  return axios.get(route, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Profile: getId()
    }
  })
}
// Put requests
export const put = (route, body) => {
  return axios.put(route, body, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Profile: getId()
    }
  })
}
// Delete requests
export const destroy = (route) => {
  return axios.delete(route, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Profile: getId()
    }
  })
}

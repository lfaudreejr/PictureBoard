import auth0 from 'auth0-js'
import EventEmitter from 'eventemitter3'
import * as api from '../api'
import config from '../config'
import router from '../router'

const getAuth = (() => {
  let auth
  return () => {
    if (auth) {
      return auth
    } else {
      auth = new auth0.WebAuth({
        domain: config.DOMAIN,
        clientID: config.CLIENT_ID,
        redirectUri: config.REDIRECT_URI,
        audience: 'https://photoboard.herokuapp.com/api',
        responseType: 'token id_token',
        scope: 'openid profile'
      })
      return auth
    }
  }
})()

function loginToApi () {
  return api.post('/api/user/profile', {_id: api.getId()}).then((data) => console.log(data)).catch((err) => console.error(err.message))
}

function setSession (authResult) {
  let expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())
  localStorage.setItem('access_token', authResult.accessToken)
  localStorage.setItem('id_token', authResult.idToken)
  localStorage.setItem('expires_at', expiresAt)
  return authNotifier.emit('authChange', { authenticated: true })
}

function getProfile (authResult) {
  getAuth().client.userInfo(authResult.accessToken, (err, user) => {
    if (err) console.log(err)
    localStorage.setItem('id', JSON.stringify(user.sub))
    localStorage.setItem('profile', JSON.stringify(user))
    authNotifier.emit('profileChange', { currentUser: api.getId() })
    return setTimeout(() => {
      loginToApi()
    }, 1000)
  })
}
function isAuthenticated () {
  // Check whether the current time is past the
  // access token's expiry time
  let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
  return new Date().getTime() < expiresAt
}
/**
 * Exports
*/
export const login = () => getAuth().authorize()
export const handleLogin = () => getAuth().parseHash(async (err, authResult) => {
  if (authResult && authResult.accessToken && authResult.idToken) {
    await setSession(authResult)
    await getProfile(authResult)
    return router.replace('/')
  } else if (err) {
    setTimeout(() => router.replace('/'), 1000)
    console.error(err)
  }
})
export const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('id_token')
  localStorage.removeItem('expires_at')
  localStorage.removeItem('profile')
  localStorage.removeItem('id')
  authNotifier.emit('authChange', { authenticated: false })
  authNotifier.emit('profileChange', { currentUser: null })
  router.replace('/')
}
export const authNotifier = new EventEmitter()
export const authenticated = isAuthenticated()
export const currentUser = api.getId()

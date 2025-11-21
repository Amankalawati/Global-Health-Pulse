import client from './client'

// optional `params` (e.g. { country: 'India' }) will be forwarded as query params
export async function getGlobalCovid(params){
  return (await client.get('/external/covid/global', { params })).data
}

// returns the full axios response so callers may inspect headers (e.g. X-Data-Source)
export async function getGlobalCovidWithMeta(params){
  return await client.get('/external/covid/global', { params })
}
export async function getCountriesCovid(){
  return (await client.get('/external/covid/countries')).data
}
export async function listIssues(q){
  return (await client.get('/issues', {params:{q}})).data
}

// Blood module APIs
export async function registerDonor(payload){
  return (await client.post('/blood/donors', payload)).data
}
export async function searchDonors(params){
  return (await client.get('/blood/donors', {params})).data
}
export async function getBloodStock(){
  return (await client.get('/blood/stock')).data
}
export async function createBloodRequest(payload){
  return (await client.post('/blood/requests', payload)).data
}

// Auth
export async function apiRegister(payload){
  return (await client.post('/register', payload)).data
}

export async function apiLogin(payload){
  return (await client.post('/login', payload)).data
}

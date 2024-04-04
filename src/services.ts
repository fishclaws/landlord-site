import { NameSearchResult, SearchResult } from "./ResultTypes"

const api_path = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '/api'

export function getAddresses(address: string) {
  return fetch(`${api_path}/search?address=${address}`)
    .then(data => {
      return data.json().then((json: SearchResult) => {
        return json
      })
    })
}

export function findByName(name: string) {
  return fetch(`${api_path}/find?name=${name}`)
    .then(data => {
      return data.json().then((json: NameSearchResult) => {
        return json
      })
    })
}

export function submitResponse(submission: any) {
  return fetch(`${api_path}/submit-review`,
    {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(submission),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
}
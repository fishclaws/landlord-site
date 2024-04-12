import { NameSearchResult, SearchResult } from "./ResultTypes"

const api_path = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '/api'

export function getAddresses(address: string) {
  return fetch(`${api_path}/search?address=${address.replaceAll('#', '%23')}`)
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

export function submitContact(contact: any) {
  return fetch(`${api_path}/submit-contact`,
    {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(contact),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
}

// export function login(credential: string): any {
//   return fetch(`${api_path}/auth/google/callback`,
//   {
//     method: 'GET',
//     mode: 'no-cors',
//     headers: {
//       "Content-Type": "application/json",
//       'Authorization': `Bearer ${credential}`,
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
// }

export function admin(password: string) {
  return fetch(`${api_path}/admin?password=${password}`,
  {
    method: 'GET',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(response => response.json())
}

export function determine(password: string, id: number, approve: string) {
  return fetch(`${api_path}/determine?password=${password}&id=${id}&approve=${approve}`,
  {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export function getAllReviews() {
  return fetch(`${api_path}/all-reviews`,
  {
    method: 'GET',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(response => response.json())
}
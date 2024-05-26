import { NameSearchResult, SearchResult } from "./ResultTypes"
import { CreateUser, User } from "./UserType"

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

export function findPropertyManager(name: string) {
  return fetch(`${api_path}/property_manager?name=${name}`)
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

export function submitReport(report: any) {
  return fetch(`${api_path}/submit-report`,
    {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(report),
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

export function admin(jwt: string) {
  return fetch(`${api_path}/admin`,
  {
    method: 'GET',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(response => response.json())
}

export function determine(jwt: string, id: number, approve: string) {
  return fetch(`${api_path}/determine?id=${id}&approve=${approve}`,
  {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

export function resolveReport(jwt: string, id: number) {
  return fetch(`${api_path}/resolve?id=${id}`,
  {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
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

export function login(token: string) {
  return fetch(`${api_path}/auth/login`,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        'token': token
      })
    }
  ).then(response => response.json())
}

export function getAllUsers(jwt: string): Promise<User[]> {
  return fetch(`${api_path}/users/all`,
  {
    method: 'GET',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
  }
).then(response => response.json())
}

export function updateUser(jwt: string, user: User) {
  return fetch(`${api_path}/users/update`,
  {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify({user})
  }
).then(response => response.json())
}

export function createUser(jwt: string, user: CreateUser): Promise<User[]> {
  return fetch(`${api_path}/users/create`,
  {
    method: 'POST',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify({user})
  }
).then(response => response.json())
}

export function deleteUser(jwt: string, userId: number): Promise<User[]> {
  return fetch(`${api_path}/users/delete`,
  {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    },
    body: JSON.stringify({userId})
  }
).then(response => response.json())
}
import { SearchResult } from "./ResultTypes"

export function getAddresses(address: string) {
  return fetch(`http://localhost:3001/search?address=${address}`)
    .then(data => {
      return data.json().then((json: SearchResult) => {
        return json
      })
    })
}

export function submitResponse(submission: any) {
  return fetch(`http://localhost:3001/submit-review`,
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
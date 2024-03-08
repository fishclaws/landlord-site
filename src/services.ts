import { SearchResult } from "./ResultTypes"

  export function getAddresses(address: string) {
    return fetch(`http://localhost:3001/search?address=${address}`)
      .then(data => {
        return data.json().then((json: SearchResult) => {
          return json
        })
      })
  }
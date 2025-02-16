export async function fetchData({ URL }) {
    try {
      const response = await fetch(URL)
  
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status}, ${response.statusText}`)
      }
  
      const format = await response.json()
  
  
      return format
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Fetch error: ${error.name}`)
        throw error
      }
    }
  }
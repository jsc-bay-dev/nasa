import useSWR from 'swr';
import './App.css'

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.state} - ${response.statusText}`)
  }

  return response.json();
}

function App() {
  const API_KEY = 'GJi5Y9SQHC1A01m7GnIdQVKunnRnOWobtZZGjeWL'
  const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`


  const { data, error, isLoading, mutate } = useSWR(API_URL, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
    errorRetryCount: 3,
    errorRetryInterval: 5000
  })

  if (isLoading) {
    return <div className="isLoading">Loading...</div>
  }

  const LoadingComponent = () => (
    <div className="app">
      <header className="header">
        <h1>NASA Astronomy Picture of the Day</h1>
      </header>
      <main className="main">
        <div className="loading" role="status" aria-live="polite">
          <div className="loading-spinner" aria-hidden="true"></div>
          Loading today's astronomy picture...
        </div>
      </main>
    </div>
  )

if (error) {
  return <div className="error">Error: {error.masssage}</div>
}


return (
  <div className="app">
    <div className="header">NASA Astronomy Photo of the Day</div>
    <div className="main">
      <div className="astronomy_photo_of_the_day">
        <h1 className="apod_title">{data?.title}</h1>
        <img className="astronomy_photo_of_the_day" id="apod_image" src={data?.url} alt={data?.title}></img>
        <p className="astronomy_photo_of_the_day" id="apod_caption">{data?.explanation}</p>
        <p className="astronomy_photo_of_the_day" id="apod_date">{data?.date}</p>
        <p className="astronomy_photo_of_the_day" id="apod_copyright">{data?.copyright && ` | © ${data.copyright}`}</p>
      </div>
    </div>
  </div>
)
}

export default App

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

const ErrorComponent = ({ error }) => (
    <div className="app">
      <header className="header">
        <h1>NASA Astronomy Picture of the Day</h1>
      </header>
      <main className="main">
        <div className="error" role="alert">
          <h2>Oops! Something went wrong</h2>
          <p>{error?.message || 'Failed to load astronomy picture'}</p>
          <button 
            onClick={() => mutate()} 
            className="retry-button"
            aria-label="Retry loading the astronomy picture"
          >
            Try Again
          </button>
        </div>
      </main>
    </div>
  )

const MediaComponent = ({ data }) => {
    const isVideo = data?.media_type === 'video'
    
    if (isVideo) {
      return (
        <iframe 
          src={data.url}
          title={data.title}
          className="media-content video-content"
          width="100%"
          height="400"
          frameBorder="0"
          allowFullScreen
          loading="lazy"
        />
      )
    }

    return (
      <img 
        src={data.url} 
        alt={data.title}
        className="media-content image-content"
        loading="lazy"
        onError={(e) => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'block'
        }}
      />
    )
  }

  if (isLoading) return <LoadingComponent />
  if (error) return <ErrorComponent error={error} />
  if (!data) return <ErrorComponent error={{ message: 'No data received' }} />
}

export default App

import './App.css'
import useSWR from 'swr'

// Enhanced fetcher function with better error handling
const fetcher = async (url) => {
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${response.statusText}`)
  }
  
  return response.json()
}

function App() {
  const API_KEY = 'GJi5Y9SQHC1A01m7GnIdQVKunnRnOWobtZZGjeWL'
  const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`

  // Use SWR with additional options for better performance
  const { data, error, isLoading, mutate } = useSWR(API_URL, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  })

  // Loading component
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

  // Error component with retry functionality
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

  // Media component for handling images and videos
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

  // Handle different states
  if (isLoading) return <LoadingComponent />
  if (error) return <ErrorComponent error={error} />
  if (!data) return <ErrorComponent error={{ message: 'No data received' }} />

  return (
    <div className="app">
      <header className="header">
        <h1>NASA Astronomy Picture of the Day</h1>
        <p className="header-subtitle">Discover the cosmos! Each day a different image or photograph of our fascinating universe.</p>
      </header>
      
      <main className="main">
        <article className="astronomy_photo_of_the_day">
          <header className="content-header">
            <h2>{data.title}</h2>
            <div className="metadata">
              <time dateTime={data.date} className="date">
                {new Date(data.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </time>
              {data.copyright && (
                <span className="copyright" aria-label={`Copyright ${data.copyright}`}>
                  © {data.copyright}
                </span>
              )}
            </div>
          </header>

          <div className="media-container">
            <MediaComponent data={data} />
            <div className="image-error" style={{ display: 'none' }}>
              <p>Failed to load image</p>
              <button onClick={() => mutate()}>Retry</button>
            </div>
          </div>

          <div className="content-description">
            <h3>About this image</h3>
            <p className="explanation">{data.explanation}</p>
          </div>

          {data.hdurl && (
            <div className="actions">
              <a 
                href={data.hdurl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hd-link"
                aria-label="View high-definition version in new tab"
              >
                View HD Version
              </a>
            </div>
          )}
        </article>
      </main>

      <footer className="app-footer">
        <p>
          Powered by{' '}
          <a 
            href="https://api.nasa.gov/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Visit NASA API website"
          >
            NASA API
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App

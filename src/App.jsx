import useSWR from 'swr';
import './App.css'

function App() {

  const api_key = 'GJi5Y9SQHC1A01m7GnIdQVKunnRnOWobtZZGjeWL';
  const api_url = `https://api.nasa.gov/planetary/apod?api_key=${api_key}`;

  const fetcher = (...args) => fetch(...args).then(res => res.json());

  const { data, error, isLoading } = useSWR(api_url, fetcher)

  if (isLoading) {
    return <div className="isLoading">Loading...</div>
  }

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

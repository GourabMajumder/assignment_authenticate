import EntryPoint from './components'
import Nav from './components/nav'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/login'
import EachWatchList from './components/eachWatchList';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className='p-4 xl:p-0'>
            <Nav />
            <EntryPoint />
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/watchlist/:id" element={<EachWatchList />} />
      </Routes>
    </Router>
  )
}

export default App

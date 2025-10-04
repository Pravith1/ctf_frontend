import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AnswerSolving from './pages/AnswerSolving.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <Link to="/">Home</Link>
        <Link to="/answer">Answer Solving</Link>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <div>
                <a href="https://vite.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
              </div>
              <h1>Vite + React</h1>
              <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </button>
                <p>
                  Edit <code>src/App.jsx</code> and save to test HMR
                </p>
              </div>
              <p className="read-the-docs">
                Click on the Vite and React logos to learn more
              </p>
            </div>
          }
        />
        <Route path="/answer" element={<AnswerSolving />} />
      </Routes>
    </>
  )
}

export default App

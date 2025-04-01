import { Routes, Route } from 'react-router'
import { ProjectContextProvider } from './context/ProjectContext'

import Portfolio from './pages/Portfolio'
import Home from './pages/Home'

function App() {

  return (
    <ProjectContextProvider>
      <div className='main-container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/portfolio' element={<Portfolio />} />
        </Routes>
      </div>
    </ProjectContextProvider>
  )
}

export default App

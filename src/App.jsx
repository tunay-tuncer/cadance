import { Routes, Route } from 'react-router'
import { ProjectContextProvider } from './context/ProjectContext'

import Portfolio from './pages/Portfolio'
import Home from './pages/Home'
import Project from './pages/Project'
function App() {

  return (
    <ProjectContextProvider>
      <div className='main-container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/portfolio' element={<Portfolio />} />
          <Route path='/project/:id' element={<Project />} />
        </Routes>
      </div>
    </ProjectContextProvider>
  )
}

export default App

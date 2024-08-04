import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  }, [])

  return (
    <div className='app'>
      <Outlet />
    </div>
  )
}

export default App

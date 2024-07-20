import { Outlet, useNavigate } from 'react-router-dom'
import { useGlobalState } from './global'
import { useEffect } from 'react'
import './App.css'

function App () {
  const navigate = useNavigate()
  const { user } = useGlobalState()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  return (
    <div className='app'>
      <Outlet />
    </div>
  )
}

export default App

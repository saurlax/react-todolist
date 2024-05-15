import { useEffect, useState } from 'react'
import './App.css'

function App () {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    const storage = localStorage.getItem('todos')
    if (storage) {
      setTodos(JSON.parse(storage))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  return (
    <div className='app'>
      <h1>Todo List</h1>
      {todos.map((todo: any, index: number) => (
        <div></div>
      ))}
    </div>
  )
}

export default App

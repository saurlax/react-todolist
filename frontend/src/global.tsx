import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  username: string
  token: string
}

interface Todo {
  id: number
  name: string
  deadline: number
  completed: boolean
}

interface GlobalState {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  todos: Todo[]
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined)

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  )
  const [todos, setTodos] = useState<Todo[]>([])

  return (
    <GlobalStateContext.Provider value={{ user, setUser, todos, setTodos }}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

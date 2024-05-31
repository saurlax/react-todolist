import { Button, Checkbox, DatePicker, Input, List, message } from 'antd'
import { useEffect, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import './TodoList.css'

interface Todo {
  id: number
  name: string
  deadline: number
  completed: boolean
}

function TodoList () {
  const [todos, setTodos] = useState<Todo[]>()
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState<number>()
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    const storage = localStorage.getItem('todos')
    if (storage) {
      setTodos(JSON.parse(storage))
    } else {
      setTodos([])
    }
  }, [])

  useEffect(() => {
    if (todos) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos])

  const addTodo = () => {
    if (todos) {
      if (deadline && name !== '') {
        setTodos([
          ...todos,
          { id: Date.now(), name, deadline, completed: false }
        ])
        setName('')
        setDeadline(undefined)
      } else {
        messageApi.error('请填写任务名称和截止时间')
      }
    }
  }

  const deleteTodo = (id: number) => {
    if (todos) {
      const newTodos = todos.filter(todo => todo.id !== id)
      setTodos(newTodos)
    }
  }

  const editTodo = (id: number, completed: boolean) => {
    if (todos) {
      const newTodos = todos.map(todo => {
        if (todo.id === id) todo.completed = completed
        return todo
      })
      setTodos(newTodos)
    }
  }

  return (
    <div className='todolist'>
      {contextHolder}
      <h1>Todo List</h1>
      <div>
        <Input
          placeholder='输入任务名称'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <DatePicker
          placeholder='选择截止时间'
          value={deadline ? dayjs(deadline) : null}
          onChange={date => {
            setDeadline(date?.valueOf())
          }}
        />
        <Button type='primary' onClick={addTodo}>
          添加
        </Button>
      </div>
      <List
        dataSource={todos}
        renderItem={todo => (
          <List.Item
            actions={[
              <Checkbox
                onChange={e => {
                  editTodo(todo.id, e.target.checked)
                }}
              />,
              <DeleteOutlined
                onClick={() => {
                  deleteTodo(todo.id)
                }}
              />
            ]}
          >
            <div
              className={`todo ${todo.completed ? 'completed' : ''} ${
                new Date(todo.deadline) < new Date() ? 'overdue' : ''
              }`}
            >
              <div>{todo.name}</div>
              <div>截止时间：{dayjs(todo.deadline).format('YYYY-MM-DD')}</div>
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}

export default TodoList

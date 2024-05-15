import { Button, Checkbox, DatePicker, Input, List, message } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import './TodoList.css'

interface Todo {
  name: string
  deadline: string
  completed: boolean
}

function TodoList () {
  const [todos, setTodos] = useState<Todo[]>()
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState<string>()
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
        setTodos([...todos, { name, deadline, completed: false }])
        setName('')
        setDeadline(undefined)
      } else {
        messageApi.error('请填写任务名称和截止时间')
      }
    }
  }

  const deleteTodo = (name: string) => {
    if (todos) {
      const newTodos = todos.filter(todo => todo.name !== name)
      setTodos(newTodos)
    }
  }

  const editTodo = (name: string, completed: boolean) => {
    if (todos) {
      const newTodos = todos.map(todo => {
        if (todo.name === name) todo.completed = completed
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
            setDeadline(date?.toISOString())
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
                  editTodo(todo.name, e.target.checked)
                }}
              />,
              <DeleteOutlined
                onClick={() => {
                  deleteTodo(todo.name)
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
              <div>截止时间：{moment(todo.deadline).format('YYYY-MM-DD')}</div>
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}

export default TodoList

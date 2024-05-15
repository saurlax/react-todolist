import { Button, Checkbox, DatePicker, Input, List, message } from 'antd'
import moment from 'moment'
import { useEffect, useState } from 'react'
import './TodoList.css'
import { DeleteOutlined } from '@ant-design/icons'

interface Todo {
  name: string
  deadline: Date
  completed: boolean
}

function TodoList () {
  const [todos, setTodos] = useState<Todo[]>()
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState<Date>()
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
    console.log(todos)
    if (todos) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos])

  const addTodo = () => {
    if (todos) {
      if (deadline && name !== '') {
        setTodos([...todos, { name, deadline, completed: false }])
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
        <DatePicker placeholder='选择截止时间' onChange={setDeadline} />
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
            <div className='todo'>
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

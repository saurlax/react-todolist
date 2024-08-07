import { Button, Checkbox, DatePicker, Input, List, message, Space } from 'antd'
import { useEffect, useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import './TodoList.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface Todo {
  id: string
  name: string
  deadline: number
  completed: boolean
}

function TodoList() {
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState<number>()
  const [todos, setTodos] = useState<Todo[]>([])
  const [messageApi, contextHolder] = message.useMessage()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/todos', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      setTodos(res.data)
    }).catch(err => {
      if (err.response.status === 401) {
        logout()
      } else {
        messageApi.error(err.response.data.message)
      }
    })
  }, [])

  const addTodo = () => {
    if (todos) {
      if (deadline && name !== '') {
        axios.post('/api/todo', {
          name,
          deadline,
          completed: false
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(resp => {
          setTodos([
            ...todos,
            { id: resp.data.id, name, deadline, completed: false }
          ])
          setName('')
          setDeadline(undefined)
          messageApi.success('添加成功')
        }).catch(err => {
          messageApi.error(err.response.data.message)
        })
      } else {
        messageApi.error('请填写任务名称和截止时间')
      }
    }
  }

  const editTodo = (id: string, completed: boolean) => {
    if (todos) {
      axios.put(`/api/todo/${id}`, { completed }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(() => {
        const newTodos = todos.map(todo => {
          if (todo.id === id) todo.completed = completed
          return todo
        })
        setTodos(newTodos)
        messageApi.success('修改成功')
      }).catch(err => {
        messageApi.error(err.response.data.message)
      })
    }
  }

  const deleteTodo = (id: string) => {
    if (todos) {
      axios.delete(`/api/todo/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(() => {
        const newTodos = todos.filter(todo => todo.id !== id)
        setTodos(newTodos)
        messageApi.success('删除成功')
      }).catch(err => {
        messageApi.error(err.response.data.message)
      })
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
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
        <Space>
          <DatePicker
            placeholder='选择截止时间'
            value={deadline ? dayjs(deadline) : null}
            onChange={date => {
              setDeadline(date?.valueOf())
            }}
          />
          <Button type='primary' onClick={addTodo}>添加</Button>
          <Button danger onClick={logout}>退出登录</Button>
        </Space>
      </div>
      <List
        dataSource={todos}
        renderItem={todo => (
          <List.Item
            actions={[
              <Checkbox
                defaultChecked={todo.completed}
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
              className={`todo ${todo.completed ? 'completed' : ''} ${new Date(todo.deadline) < new Date() ? 'overdue' : ''
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

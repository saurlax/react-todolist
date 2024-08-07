import { Button, Input, message } from 'antd'
import axios from 'axios'
import { useState } from 'react'
import crypto from 'crypto-js'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const validate = () => {
    const usernameRegex = /^[a-zA-Z0-9]+$/
    const passwordRegex = /^.{8,}$/

    if (!usernameRegex.test(username)) {
      messageApi.error('账号只能包含字母和数字')
      return false
    }

    if (!passwordRegex.test(password)) {
      messageApi.error('密码至少8位')
      return false
    }

    return true
  }

  const loginUser = () => {
    if (!validate()) return

    const payload = {
      username: crypto.SHA256(username).toString(),
      password: crypto.SHA256(password).toString()
    }
    axios
      .post('/api/login', payload)
      .then(res => {
        localStorage.setItem('token', res.data.token)
        navigate('/')
      })
      .catch(err => {
        messageApi.error(err.response.data)
      })
  }

  const registerUser = () => {
    if (!validate()) return

    const payload = {
      username: crypto.SHA256(username).toString(),
      password: crypto.SHA256(password).toString()
    }
    axios
      .post('/api/register', payload)
      .then(_ => {
        messageApi.success('注册成功，请登录')
      })
      .catch(err => {
        messageApi.error(err.response.data)
      })
  }

  return (
    <div className='login'>
      {contextHolder}
      <h1>Login</h1>
      <Input
        placeholder='账号'
        value={username}
        onChange={e => {
          setUsername(e.target.value)
        }}
      />
      <Input
        placeholder='密码'
        type='password'
        value={password}
        onChange={e => {
          setPassword(e.target.value)
        }}
      />
      <div className='action'>
        <Button onClick={registerUser}>注册</Button>
        <Button type='primary' onClick={loginUser}>
          登录
        </Button>
      </div>
    </div>
  )
}

export default Login

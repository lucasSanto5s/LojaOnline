import React from 'react'
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  App,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { loginSuccess, type AppUser } from '@/store/slices/authSlice'

const { Title } = Typography

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const users = useAppSelector((s) => s.auth.users)

  const [loading, setLoading] = React.useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)

    const { email, password } = values

    // Procura usuário com o email informado
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      setLoading(false)
      message.error('Usuário não encontrado.')
      return
    }

    // Verifica senha
    if (user.password !== password) {
      setLoading(false)
      message.error('Senha incorreta.')
      return
    }

    // Sucesso → login
    dispatch(loginSuccess(user))
    message.success(`Bem-vindo, ${user.name}!`)

    setLoading(false)
    navigate('/')
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 80,
      }}
    >
      <Card style={{ width: 420 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          Login
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Informe o email' },
              { type: 'email', message: 'Email inválido' },
            ]}
          >
            <Input placeholder="admin@admin.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Informe a senha' }]}
          >
            <Input.Password placeholder="********" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ marginTop: 8 }}
          >
            Entrar
          </Button>
        </Form>

        <p style={{ marginTop: 16, fontSize: 12, textAlign: 'center' }}>
          Dica: admin@admin.com / admin123 • user@demo.com / user123
        </p>
      </Card>
    </div>
  )
}

export default LoginPage
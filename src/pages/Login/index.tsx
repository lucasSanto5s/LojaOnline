import React from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/store';
import { loginSuccess } from '@/store/slices/authSlice';

const { Title } = Typography;

type FormValues = { email: string; password: string };

const Login: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const onFinish = (values: FormValues) => {
    setLoading(true);
    try {
      // usuários seed guardados em localStorage pela ensureSeed
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find((u: any) => u.email === values.email && u.password === values.password);
      if (!found) {
        message.error('Usuário ou senha inválidos');
      } else {
        dispatch(loginSuccess({ id: found.id, name: found.name, email: found.email, role: found.role }));
        message.success('Login realizado com sucesso');
        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo, { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display:'flex', justifyContent:'center', marginTop: 48 }}>
      <Card style={{ width: 360 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Login</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Informe o email' }, { type: 'email' }]}>
            <Input placeholder="admin@admin.com" />
          </Form.Item>
          <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Informe a senha' }]}>
            <Input.Password placeholder="admin123" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Entrar
          </Button>
        </Form>
        <div style={{ marginTop: 12, fontSize: 12, opacity: 0.7 }}>
          Dica: admin@admin.com / admin123 • user@demo.com / user123
        </div>
      </Card>
    </div>
  );
};

export default Login;

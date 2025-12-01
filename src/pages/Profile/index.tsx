// src/pages/Profile/index.tsx
import React from 'react'
import {
  Typography,
  Card,
  Avatar,
  Tag,
  Descriptions,
  Button,
  Space,
  Drawer,
  Form,
  Input,
  App,
  Divider,
  Table,
} from 'antd'
import { UserOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { loginSuccess, type AppUser } from '@/store/slices/authSlice'
import type { Order } from '@/store/slices/ordersSlice'

const { Title, Text } = Typography

type ProfileFormValues = {
  name: string
  email: string
  avatar?: string
}

function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR')
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { message } = App.useApp()

  const currentUser = useAppSelector((s) => s.auth.currentUser)
  const allUsers = useAppSelector((s) => s.auth.users)
  const orders = useAppSelector((s) => s.orders.items)

  const [openEdit, setOpenEdit] = React.useState(false)
  const [form] = Form.useForm<ProfileFormValues>()

  React.useEffect(() => {
    if (!currentUser) {
      message.warning('Você precisa estar logado para acessar o perfil.')
      navigate('/login')
    }
  }, [currentUser, message, navigate])

  if (!currentUser) return null

  const fullUser = allUsers.find((u) => u.id === currentUser.id)

  const handleOpenEdit = () => {
    form.setFieldsValue({
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
    })
    setOpenEdit(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()

    // atualiza no auth.users
    if (fullUser) {
      const updatedUser: AppUser = {
        ...fullUser,
        name: values.name.trim(),
        email: values.email.trim(),
        avatar: values.avatar?.trim(),
      }

      // reaproveitamos loginSuccess para sincronizar currentUser + localStorage
      dispatch(loginSuccess(updatedUser))
    } else {
      // fallback: só atualiza currentUser mesmo
      const updatedAuthUser: AppUser = {
        ...currentUser,
        name: values.name.trim(),
        email: values.email.trim(),
        avatar: values.avatar?.trim(),
      }
      dispatch(loginSuccess(updatedAuthUser))
    }

    message.success('Perfil atualizado com sucesso.')
    setOpenEdit(false)
  }

  const roleColor = currentUser.role === 'admin' ? 'geekblue' : 'green'
  const roleLabel = currentUser.role.toUpperCase()

  const myOrders = React.useMemo(
    () => orders.filter((o) => o.userId === currentUser.id),
    [orders, currentUser.id],
  )

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => formatDate(value),
      sorter: (a: Order, b: Order) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'Items',
      key: 'itemsCount',
      render: (_: any, record: Order) =>
        `${record.items.reduce((acc, it) => acc + it.qty, 0)} item(s)`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value: number) => `US$ ${value.toFixed(2)}`,
      sorter: (a: Order, b: Order) => a.total - b.total,
    },
  ]

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2} style={{ margin: 0 }}>
          User Profile
        </Title>

        {/* Card principal */}
        <Card>
          <Space align="center" size={32}>
            <Avatar
              size={96}
              src={currentUser.avatar}
              icon={!currentUser.avatar && <UserOutlined />}
            >
              {!currentUser.avatar &&
                currentUser.name?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Space direction="vertical" size={4}>
              <Title level={3} style={{ margin: 0 }}>
                {currentUser.name}
              </Title>
              <Text type="secondary">{currentUser.email}</Text>
              <Tag color={roleColor}>{roleLabel}</Tag>
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={handleOpenEdit}
              >
                Edit Profile
              </Button>
            </Space>
          </Space>
        </Card>

        {/* Detalhes + histórico */}
        <Card>
          <Title level={4}>Personal Information</Title>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Name">
              {currentUser.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {currentUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={roleColor}>{roleLabel}</Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Title level={4}>Purchase History</Title>
          {myOrders.length === 0 ? (
            <Text type="secondary">
              Você ainda não possui compras registradas.
            </Text>
          ) : (
            <Table<Order>
              rowKey="id"
              columns={columns}
              dataSource={myOrders}
              size="small"
              pagination={false}
            />
          )}
        </Card>
      </Space>

      {/* Drawer de edição */}
      <Drawer
        title="Edit Profile"
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        destroyOnClose
        width={420}
        maskClosable={false}
      >
        <Form<ProfileFormValues> layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Informe o nome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Informe o email' },
              { type: 'email', message: 'Email inválido' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="avatar"
            label="Avatar URL"
            tooltip="URL de uma imagem para usar como foto de perfil"
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Space
            style={{
              marginTop: 16,
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              Save
            </Button>
          </Space>
        </Form>
      </Drawer>
    </>
  )
}

export default ProfilePage

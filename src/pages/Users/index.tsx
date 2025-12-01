import React from 'react'
import {
  Typography,
  Table,
  Button,
  Space,
  Tag,
  Drawer,
  Form,
  Input,
  Select,
  Tooltip,
  App,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  type AppUser,
  type Role,
  addUser,
  updateUser,
  deleteUser,
} from '@/store/slices/authSlice'

const { Title, Text } = Typography
const { Option } = Select

type FormValues = {
  id?: string
  name: string
  email: string
  password?: string
  role: Role
  avatar?: string
}

const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { message, modal } = App.useApp()

  const currentUser = useAppSelector((s) => s.auth.currentUser)
  const users = useAppSelector((s) => s.auth.users)
  const isAdmin = currentUser?.role === 'admin'

  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<AppUser | null>(null)
  const [form] = Form.useForm<FormValues>()

  // ====== GUARD DE ACESSO ======
  if (!currentUser) {
    return (
      <Text>
        Esta página é restrita. Faça login para acessar o gerenciamento de usuários.
      </Text>
    )
  }

  if (!isAdmin) {
    return (
      <Text>
        Apenas usuários com perfil <b>ADMIN</b> podem gerenciar usuários.
      </Text>
    )
  }

  // ====== AÇÕES ======

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ role: 'user' })
    setOpen(true)
  }

  const openEdit = (user: AppUser) => {
    setEditing(user)
    form.setFieldsValue({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      avatar: user.avatar,
    })
    setOpen(true)
  }

  const handleDelete = (user: AppUser) => {
    modal.confirm({
      title: 'Confirmar exclusão',
      content: `Deseja realmente excluir o usuário ${user.name}?`,
      okText: 'Excluir',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(deleteUser(user.id))
        message.success('Usuário removido com sucesso.')
      },
    })
  }

  const onSubmit = async () => {
    const values = await form.validateFields()

    if (editing) {
      // atualização: preserva createdAt e outros campos não exibidos no form
      const updated: AppUser = {
        ...editing,
        name: values.name.trim(),
        email: values.email.trim(),
        role: values.role,
        avatar: values.avatar?.trim() || undefined,
        // só sobrescreve password se o usuário informar algo
        password: values.password && values.password.length > 0
          ? values.password
          : editing.password,
      }

      dispatch(updateUser(updated))
      message.success('Usuário atualizado com sucesso.')
    } else {
      // criação: usa addUser do slice (gera id e createdAt)
      dispatch(
        addUser({
          name: values.name.trim(),
          email: values.email.trim(),
          role: values.role,
          avatar: values.avatar?.trim() || undefined,
          password: values.password, // opcional
        }),
      )
      message.success('Usuário criado com sucesso.')
    }

    setOpen(false)
  }

  // ====== COLUNAS TABELA ======

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: Role) => (
        <Tag color={role === 'admin' ? 'geekblue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string | undefined) =>
        value ? new Date(value).toLocaleDateString('pt-BR') : '-',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: AppUser) => (
        <Space>
          <Tooltip title="Editar usuário">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Excluir usuário">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <>
      {/* HEADER DA PÁGINA */}
      <Space
        style={{
          marginBottom: 24,
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Users Management
        </Title>

        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New User
        </Button>
      </Space>

      {/* TABELA */}
      <Table<AppUser>
        rowKey="id"
        columns={columns as any}
        dataSource={users}
        pagination={false}
      />

      {/* DRAWER CRIAR / EDITAR */}
      <Drawer
        title={editing ? 'Edit User' : 'New User'}
        open={open}
        onClose={() => setOpen(false)}
        width={420}
        destroyOnClose
        maskClosable={false}
      >
        <Form<FormValues> layout="vertical" form={form}>
          {/* hidden id para edição */}
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

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
              { required: true, message: 'Informe o e-mail' },
              { type: 'email', message: 'E-mail inválido' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label={editing ? 'Password (deixe em branco para não alterar)' : 'Password'}
            rules={
              editing
                ? []
                : [{ required: true, message: 'Informe a senha' }]
            }
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Selecione o papel' }]}
          >
            <Select>
              <Option value="admin">ADMIN</Option>
              <Option value="user">USER</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="avatar"
            label="Avatar URL"
            tooltip="Opcional: URL de imagem para o perfil"
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Space
            style={{
              marginTop: 16,
              justifyContent: 'flex-end',
              width: '100%',
            }}
          >
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={onSubmit}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </Space>
        </Form>
      </Drawer>
    </>
  )
}

export default UsersPage

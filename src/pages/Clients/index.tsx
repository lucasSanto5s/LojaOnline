import React from 'react'
import {
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Tooltip,
  Drawer,
  Form,
  Input,
  Select,
  DatePicker,
  App,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  type Client,
  type ClientStatus,
  setClients,
  createClient,
  updateClient,
  deleteClient,
} from '@/store/slices/clientsSlice'

const { Title } = Typography
const { Option } = Select

// === helpers ===
function capitalizeFirstLetter(str: string) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('pt-BR')
}

function randomPastDateISO(maxYears = 5) {
  const now = new Date()
  const past = new Date()
  past.setFullYear(now.getFullYear() - maxYears)

  const t = past.getTime() + Math.random() * (now.getTime() - past.getTime())
  return new Date(t).toISOString()
}

type FormValues = {
  id?: number
  status: ClientStatus
  firstName: string
  lastName: string
  email: string
  createdAt?: string
  address: string
  phone: string
}

const ClientsPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { message, modal } = App.useApp()

  const user = useAppSelector((s) => s.auth.currentUser)
  const isAdmin = user?.role === 'admin'

  const clients = useAppSelector((s) => s.clients.items)
  const loaded = useAppSelector((s) => s.clients.loaded)

  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Client | null>(null)
  const [form] = Form.useForm<FormValues>()

  // === carregar da API só na primeira vez (se não houver nada no localStorage/Redux) ===
  React.useEffect(() => {
    if (loaded || clients.length > 0) return

    ;(async () => {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        const data: any[] = await res.json()

        const mapped: Client[] = data.map((u) => {
          const parts = String(u.name ?? '').split(' ')
          const firstName = parts.shift() ?? ''
          const lastName = parts.length > 0 ? parts.join(' ') : firstName

          const addressObj = u.address ?? {}
          const address = [addressObj.street, addressObj.suite, addressObj.city]
            .filter(Boolean)
            .join(', ')

          const status: ClientStatus =
            Math.random() > 0.2 ? 'activated' : 'deactivated'

          return {
            id: u.id,
            firstName,
            lastName,
            email: u.email ?? '',
            createdAt: randomPastDateISO(),
            address,
            phone: u.phone ?? '',
            status,
          }
        })

        dispatch(setClients(mapped))
      } catch {
        message.error('Erro ao carregar clientes da API.')
      }
    })()
  }, [loaded, clients.length, dispatch, message])

  // === ações ===
  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({
      status: 'activated',
    } as Partial<FormValues>)
    setOpen(true)
  }

  const openEdit = (client: Client) => {
    setEditing(client)
    form.setFieldsValue({
      id: client.id,
      status: client.status,
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      createdAt: client.createdAt,
      address: client.address,
      phone: client.phone,
    })
    setOpen(true)
  }

  const handleDeleteClick = (client: Client) => {
    if (!isAdmin) {
      message.warning('Apenas administradores podem excluir clientes.')
      return
    }

    modal.confirm({
      title: 'Confirmar exclusão',
      content: `Deseja realmente excluir o cliente ${client.firstName} ${client.lastName}?`,
      okText: 'Excluir',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: () => {
        dispatch(deleteClient(client.id))
        message.success('Cliente excluído com sucesso.')
      },
    })
  }

  const onSubmit = async () => {
    const values = await form.validateFields()

    const payload: Omit<Client, 'id'> & { id?: number } = {
      id: values.id,
      status: values.status,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      createdAt:
        values.createdAt && typeof values.createdAt === 'string'
          ? values.createdAt
          : values.createdAt
          ? (values.createdAt as any).toISOString()
          : randomPastDateISO(),
      address: values.address.trim(),
      phone: values.phone.trim(),
    }

    if (editing) {
      dispatch(updateClient(payload as Client))
      message.success('Cliente atualizado com sucesso.')
    } else {
      const { id, ...withoutId } = payload
      dispatch(createClient(withoutId))
      message.success('Cliente criado com sucesso.')
    }

    setOpen(false)
  }

  // === colunas (Name agrupando First/Last Name) ===
  const columns = [
    {
      title: 'Name',
      children: [
        {
          title: 'First Name',
          dataIndex: 'firstName',
          key: 'firstName',
          sorter: (a: Client, b: Client) =>
            a.firstName.localeCompare(b.firstName),
          render: (value: string) => capitalizeFirstLetter(value),
        },
        {
          title: 'Last Name',
          dataIndex: 'lastName',
          key: 'lastName',
          render: (value: string) => capitalizeFirstLetter(value),
        },
      ],
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: Client, b: Client) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a: Client, b: Client) => a.status.localeCompare(b.status),
      render: (value: ClientStatus) => (
        <Tag color={value === 'activated' ? 'green' : 'red'}>
          {value.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Client) => (
        <Space>
          <Tooltip title={isAdmin ? 'Editar cliente' : 'Somente admin'}>
            <Button
              size="small"
              icon={<EditOutlined />}
              disabled={!isAdmin}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Tooltip title={isAdmin ? 'Excluir cliente' : 'Somente admin'}>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={!isAdmin}
              onClick={() => handleDeleteClick(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Space
        style={{
          marginBottom: 24,
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          List of Clients
        </Title>

        {isAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Client
          </Button>
        )}
      </Space>

      <Table<Client>
        rowKey="id"
        columns={columns as any}
        dataSource={clients}
        pagination={false}
      />

      <Drawer
        open={open}
        title={editing ? 'Edit User' : 'New Client'}
        onClose={() => setOpen(false)}
        width={480}
        destroyOnClose
        maskClosable={false}
      >
        <Form<FormValues>
          layout="vertical"
          form={form}
          initialValues={{
            status: 'activated',
          }}
        >
          {/* hidden id para edição */}
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="State"
            rules={[{ required: true, message: 'Selecione o estado' }]}
          >
            <Select>
              <Option value="activated">ACTIVATED</Option>
              <Option value="deactivated">DEACTIVATED</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Informe o primeiro nome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Informe o sobrenome' }]}
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
            name="createdAt"
            label="Created At"
            rules={[{ required: true, message: 'Informe a data de criação' }]}
            getValueProps={(value: any) =>
              value
                ? {
                    value:
                      typeof value === 'string'
                        ? (window as any).moment?.(value)
                        : value,
                  }
                : {}
            }
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Informe o endereço' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Informe o telefone' }]}
          >
            <Input />
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

export default ClientsPage

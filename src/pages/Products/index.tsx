import React from 'react'
import {
  Typography, List, Image, Rate, Button, Flex, Space, Input,
  Drawer, Form, InputNumber, Popconfirm, App, Select
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchAllProducts } from '@/services/fakestore'
import { CATEGORIES, setAll, setQuery, addProduct, updateProduct, removeProduct, type Product } from '@/store/slices/productsSlice'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

const Products: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const user = useAppSelector(s => s.auth.currentUser)
  const isAdmin = user?.role === 'admin'

  const products = useAppSelector(s => s.products.items)
  const loaded = useAppSelector(s => s.products.loaded)
  const query = useAppSelector(s => s.products.query)

  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Product | null>(null)
  const [form] = Form.useForm()

  // carrega base inicial se não houver nada
  React.useEffect(() => {
    if (loaded || products.length > 0) return
    ;(async () => {
      try {
        const api = await fetchAllProducts()
        const mapped: Product[] = api.map(p => ({
          id: p.id,
          title: p.title,
          price: Number(p.price),
          description: p.description,
          image: p.image,
          category: p.category,
          rating: p.rating,
        }))
        dispatch(setAll(mapped))
      } catch {}
    })()
  }, [loaded, products.length, dispatch])

  // === ações ===
  const onBuy = (p: Product) => {
    if (!user) {
      message.warning('Faça login para adicionar itens ao carrinho.')
      navigate('/login')
      return
    }
    dispatch({
      type: 'cart/addItem',
      payload: { id: p.id, title: p.title, price: p.price, image: p.image, qty: 1 }
    })
    message.success('Produto adicionado ao carrinho')
  }

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    form.setFieldsValue(p)
    setOpen(true)
  }

  const onSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      dispatch(updateProduct({ ...(editing as Product), ...values }))
      message.success('Produto atualizado')
    } else {
      dispatch(addProduct(values))
      message.success('Produto criado')
    }
    setOpen(false)
  }

  const onDelete = (id: number) => {
    dispatch(removeProduct(id))
    message.success('Produto excluído')
  }

  const list = React.useMemo(
    () => products.filter(p => p.title.toLowerCase().includes(query.toLowerCase().trim())),
    [products, query]
  )

  return (
    <>
      {/* === Header da Página === */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          List of Products
        </Title>
        {isAdmin && (
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Product
          </Button>
        )}
      </Flex>

      {/* === Lista === */}
      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
        dataSource={list}
        renderItem={(p) => (
          <List.Item key={p.id}>
            <div
              style={{
                background: 'var(--ant-color-bg-container)',
                border: '1px solid var(--ant-color-border)',
                borderRadius: 8,
                padding: 16,
                height: '100%',
              }}
            >
              <Flex vertical gap={8}>
                <div style={{ display: 'grid', placeItems: 'center', height: 180 }}>
                  <Image src={p.image} alt={p.title} width={160} height={160} style={{ objectFit: 'contain' }} preview />
                </div>

                <Text strong ellipsis={{ tooltip: p.title }}>{p.title}</Text>

                {p.category && (
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {p.category}
                  </Text>
                )}

                <Paragraph type="secondary" ellipsis={{ rows: 2, tooltip: p.description }} style={{ margin: 0 }}>
                  {p.description}
                </Paragraph>

                <Flex justify="space-between" align="center" style={{ marginTop: 8 }}>
                  <div>
                    {p.rating && <Rate disabled value={p.rating.rate} allowHalf />}
                    <div style={{ fontWeight: 600, marginTop: 6 }}>Price: US$ {p.price.toFixed(2)}</div>
                  </div>

                  <Space>
                    {isAdmin && (
                      <>
                        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(p)} />
                        <Popconfirm
                          title="Excluir produto?"
                          okText="Excluir"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => onDelete(p.id)}
                        >
                          <Button size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      </>
                    )}
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      onClick={() => onBuy(p)}
                    >
                      Buy
                    </Button>
                  </Space>
                </Flex>
              </Flex>
            </div>
          </List.Item>
        )}
      />

      {/* === Drawer de Criação/Edição === */}
      <Drawer
        title={editing ? 'Edit Product' : 'New Product'}
        open={open}
        onClose={() => setOpen(false)}
        width={420}
        destroyOnClose
        maskClosable={false}
      >
        <Form layout="vertical" form={form} initialValues={{ price: 0 }}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Informe o título' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Informe a descrição' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Selecione a categoria' }]}
          >
            <Select
              placeholder="Selecione a categoria"
              options={CATEGORIES.map(c => ({ label: c, value: c }))}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          <Form.Item name="price" label="Price (US$)" rules={[{ required: true, message: 'Informe o preço' }]}>
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="image" label="Image URL" rules={[{ required: true, message: 'Informe a URL da imagem' }]}>
            <Input placeholder="https://..." />
          </Form.Item>

          <Flex justify="end" gap={8}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={onSubmit}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </Flex>
        </Form>
      </Drawer>
    </>
  )
}

export default Products

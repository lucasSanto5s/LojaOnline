import React from 'react'
import {
  Drawer, List, Avatar, Button, Space, Typography, Popconfirm, App, Divider,
} from 'antd'
import {
  MinusOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined,
} from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectCart, selectCartTotal, increment, decrement, remove, clear } from '@/store/slices/cartSlice'
import { useNavigate } from 'react-router-dom'

type Props = {
  open: boolean
  onClose: () => void
}

const { Text, Title } = Typography

const CartDrawer: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const items = useAppSelector(selectCart)
  const total = useAppSelector(selectCartTotal)
  const user = useAppSelector(s => s.auth.currentUser)

  const finalize = () => {
    if (!user) {
      message.warning('Você precisa estar logado para finalizar a compra.')
      onClose()
      navigate('/login')
      return
    }

    if (items.length === 0) {
      message.info('Seu carrinho está vazio.')
      return
    }

    message.success('Compra finalizada com sucesso! 🎉')
    dispatch(clear())
    onClose()
  }

  const clearAll = () => {
    if (items.length === 0) return
    dispatch(clear())
    message.success('Carrinho limpo.')
  }

  return (
    <Drawer
      title={<Space><ShoppingCartOutlined /> <span>Meu Carrinho</span></Space>}
      placement="right"
      open={open}
      onClose={onClose}
      width={420}
    >
      <List
        dataSource={items}
        locale={{ emptyText: 'Nenhum produto no carrinho' }}
        renderItem={(it) => (
          <List.Item
            actions={[
              <Space key="qty">
                <Button size="small" icon={<MinusOutlined />} onClick={() => dispatch(decrement(it.id))} />
                <Text strong>{it.qty}</Text>
                <Button size="small" icon={<PlusOutlined />} onClick={() => dispatch(increment(it.id))} />
              </Space>,
              <Button
                key="rm"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => dispatch(remove(it.id))}
              />,
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar shape="square" size={48} src={it.image} />}
              title={<Text ellipsis={{ tooltip: it.title }}>{it.title}</Text>}
              description={<Text type="secondary">US$ {it.price.toFixed(2)}</Text>}
            />
            <div><Text>US$ {(it.price * it.qty).toFixed(2)}</Text></div>
          </List.Item>
        )}
      />

      <Divider />

      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 8 }}>
        <Title level={5} style={{ margin: 0 }}>Total</Title>
        <Title level={4} style={{ margin: 0 }}>US$ {total.toFixed(2)}</Title>
      </Space>

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Popconfirm
          title="Limpar carrinho?"
          okText="Limpar"
          okButtonProps={{ danger: true }}
          onConfirm={clearAll}
        >
          <Button danger>Limpar</Button>
        </Popconfirm>

        <Button type="primary" onClick={finalize}>
          Finalizar compra
        </Button>
      </Space>
    </Drawer>
  )
}

export default CartDrawer

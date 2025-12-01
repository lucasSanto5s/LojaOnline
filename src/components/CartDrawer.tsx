import React from 'react'
import {
  Drawer,
  List,
  Avatar,
  Button,
  Space,
  Typography,
  Popconfirm,
  App,
  Divider,
} from 'antd'
import {
  MinusOutlined,
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  selectCart,
  selectCartTotal,
  increment,
  decrement,
  remove,
  clear,
} from '@/store/slices/cartSlice'
import { addOrder } from '@/store/slices/ordersSlice'

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
  const user = useAppSelector((s) => s.auth.currentUser)

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

    // cria o pedido no Redux + localStorage
    dispatch(
      addOrder({
        userId: user.id,
        createdAt: new Date().toISOString(),
        total,
        items: items.map((it: any) => ({
          id: it.id,
          title: it.title,
          price: it.price,
          qty: it.qty,
          image: it.image,
        })),
      }),
    )

    dispatch(clear())
    onClose()
    message.success('Compra finalizada com sucesso! 🎉')
  }

  return (
    <Drawer
      title="Cart"
      open={open}
      onClose={onClose}
      width={420}
      destroyOnClose
      maskClosable
    >
      {items.length === 0 ? (
        <Text type="secondary">Seu carrinho está vazio.</Text>
      ) : (
        <>
          <List
            dataSource={items}
            itemLayout="horizontal"
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <Button
                    key="minus"
                    size="small"
                    icon={<MinusOutlined />}
                    onClick={() => dispatch(decrement(item.id))}
                  />,
                  <Text key="qty">x{item.qty}</Text>,
                  <Button
                    key="plus"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => dispatch(increment(item.id))}
                  />,
                  <Popconfirm
                    key="del"
                    title="Remover item?"
                    okText="Remover"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => dispatch(remove(item.id))}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar shape="square" src={item.image} />}
                  title={item.title}
                  description={`US$ ${item.price.toFixed(2)}`}
                />
              </List.Item>
            )}
          />

          <Divider />

          <Space
            style={{ width: '100%', justifyContent: 'space-between' }}
            align="center"
          >
            <Title level={4} style={{ margin: 0 }}>
              Total: US$ {total.toFixed(2)}
            </Title>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={finalize}
            >
              Finalizar Compra
            </Button>
          </Space>
        </>
      )}
    </Drawer>
  )
}

export default CartDrawer
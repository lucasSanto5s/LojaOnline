import React from 'react'
import { Drawer, Empty } from 'antd'

type Props = { open: boolean; onClose: () => void }
const CartDrawer: React.FC<Props> = ({ open, onClose }) => {
  return (
    <Drawer title="Cart" open={open} onClose={onClose}>
      <Empty description="Seu carrinho está vazio" />
    </Drawer>
  )
}
export default CartDrawer

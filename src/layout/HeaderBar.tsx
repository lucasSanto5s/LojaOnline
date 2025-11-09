import React from 'react'
import {
  Menu, Input, Space, Button, Avatar, Badge, Switch,
} from 'antd'
import {
  ShoppingCartOutlined, UserOutlined, LoginOutlined,
} from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { toggleTheme } from '@/store/slices/uiSlice'
import { logout } from '@/store/slices/authSlice'
import Logo from '@/components/Logo'
import CartDrawer from '@/components/CartDrawer'

const HeaderBar: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const theme = useAppSelector((s) => s.ui.theme)
  const user = useAppSelector((s) => s.auth.currentUser)
  const cartCount = useAppSelector((s) => s.cart.items.reduce((acc, it) => acc + it.qty, 0))
  const [openCart, setOpenCart] = React.useState(false)
  const showSearch = location.pathname.startsWith('/products')

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo />
        </Link>

        {/* Menu central */}
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={[
            { key: '/', label: <Link to="/">Home</Link> },
            { key: '/products', label: <Link to="/products">Products</Link> },
            { key: '/clients', label: <Link to="/clients">Clients</Link> },
          ]}
          style={{ background: 'transparent', borderBottom: 'none', flex: 1, justifyContent: 'center' }}
        />

        {/* Ações direita */}
        <Space size="middle" align="center">
          {showSearch && (
            <Input.Search placeholder="Find Product" enterButton style={{ width: 260 }} />
          )}

          <Switch
            checked={theme === 'dark'}
            onChange={() => dispatch(toggleTheme())}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />

          {user ? (
            <>
              <span style={{ textTransform: 'uppercase' }}>{user.name}</span>
              <Avatar icon={<UserOutlined />} />
              <Button
                type="text"
                icon={<Badge count={cartCount} size="small"><ShoppingCartOutlined /></Badge>}
                onClick={() => setOpenCart(true)}
              >
                Cart
              </Button>
              <Button icon={<LoginOutlined />} onClick={() => { dispatch(logout()); navigate('/login') }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button icon={<LoginOutlined />} onClick={() => navigate('/login')}>Login</Button>
              <Button
                type="text"
                icon={<Badge count={cartCount} size="small"><ShoppingCartOutlined /></Badge>}
                onClick={() => setOpenCart(true)}
              >
                Cart
              </Button>
            </>
          )}
        </Space>
      </div>

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  )
}

export default HeaderBar

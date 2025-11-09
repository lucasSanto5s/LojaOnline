import React from 'react'
import {
  Typography,
  Row,
  Col,
  Card,
  Image,
  Spin,
  notification,
  Space,
} from 'antd'
import { EyeFilled } from '@ant-design/icons'
import { fetchTopProducts, type ApiProduct } from '@/services/fakestore'

const { Title, Paragraph } = Typography

const Home: React.FC = () => {
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState<ApiProduct[]>([])

  // carrega Top 5
  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data = await fetchTopProducts(5)
        if (alive) setItems(data)
      } catch (e) {
        notification.error({
          message: 'Erro ao carregar produtos',
          description:
            'Não foi possível carregar os itens da Fake Store API. Tente novamente em alguns instantes.',
        })
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const onEyeClick = () => {
    notification.error({
      message: 'Ops! Algo deu errado',
      description:
        'Este é um exemplo de alerta de erro acionado pelo ícone de visualização.',
    })
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Title>Welcome to the Shop</Title>

        <Space align="center" style={{ marginTop: 8, marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0 }}>
            Top 5 Products
          </Title>
          <EyeFilled
            onClick={onEyeClick}
            style={{ cursor: 'pointer', fontSize: 18, opacity: 0.8 }}
            title="Mostrar notificação de erro"
          />
        </Space>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {items.map((p) => (
            <Col key={p.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{ height: '100%' }}
                bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              >
                <div style={{ display: 'grid', placeItems: 'center' }}>
                  {/* preview ativo por padrão; imagem do PDF centralizada */}
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={160}
                    height={160}
                    style={{ objectFit: 'contain' }}
                    preview
                  />
                </div>

                <Paragraph strong ellipsis={{ rows: 1 }} style={{ marginTop: 8 }}>
                  {p.title}
                </Paragraph>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                  {p.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default Home

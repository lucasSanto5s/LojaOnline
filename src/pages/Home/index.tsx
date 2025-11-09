import React from 'react'
import {
  Typography,
  Row,
  Col,
  Card,
  Image,
  Spin,
  notification,
  Button,
  App,
} from 'antd'
import { EyeFilled } from '@ant-design/icons'
import { fetchTopProducts, type ApiProduct } from '@/services/fakestore'

const { Title, Paragraph } = Typography

const Home: React.FC = () => {
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState<ApiProduct[]>([])
  const { notification: appNotification } = App.useApp()

  React.useEffect(() => {
    let alive = true
      ; (async () => {
        try {
          const data = await fetchTopProducts(5)
          if (alive) setItems(data)
        } catch {
          appNotification.error({
            message: 'Erro ao carregar produtos',
            description:
              'Não foi possível carregar os itens da Fake Store API. Tente novamente em instantes.',
          })
        } finally {
          if (alive) setLoading(false)
        }
      })()
    return () => {
      alive = false
    }
  }, [appNotification])

  const showEyeError = () => {
    appNotification.error({
      message: 'Ops! Algo deu errado',
      description:
        'Exemplo de alerta de erro acionado pelo ícone de visualização.',
    })
  }

  return (
    <div style={{ width: '100%', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Title>Welcome to the Shop</Title>
        <Title level={3} style={{ marginTop: 0 }}>
          Top 5 Products
        </Title>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row
          gutter={[24, 24]}
          justify="center"
          style={{
            marginTop: 16,
            maxWidth: 1400,
            marginInline: 'auto',
          }}
        >
          {items.map((p) => (
            <Col key={p.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{
                  textAlign: 'center',
                  borderRadius: 8,
                }}
                bodyStyle={{
                  padding: 12,                 // compacto
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 140,
                    height: 140,               // menor
                    margin: '0 auto 8px',
                  }}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={140}
                    height={140}
                    style={{ objectFit: 'contain' }}
                    preview
                  />
                </div>

                <Paragraph
                  strong
                  ellipsis={{ rows: 1 }}
                  style={{ margin: 0 }}        // tira espaço extra
                >
                  {p.title}
                </Paragraph>

                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  style={{ margin: '4px 0 8px' }}
                >
                  {p.description}
                </Paragraph>

                <Button
                  type="text"
                  icon={<EyeFilled />}
                  onClick={showEyeError}
                  style={{ padding: 0, height: 24, lineHeight: 1, alignSelf: 'center' }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default Home

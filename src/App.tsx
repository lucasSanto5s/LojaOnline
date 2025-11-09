import React from 'react'
import RoutesConfig from '@/routes'
import AppLayout from '@/layout/AppLayout'

const App: React.FC = () => {
  return (
    <AppLayout>
      <RoutesConfig />
    </AppLayout>
  )
}
export default App

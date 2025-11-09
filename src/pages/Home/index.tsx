import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <>
      <Title style={{ textAlign: 'center', marginTop: 24 }}>Welcome to the Shop</Title>
      <Title level={3} style={{ textAlign: 'center' }}>Top 5 Products</Title>
      {/* Implementaremos a lista da Fake Store depois */}
    </>
  );
};

export default Home;

import React from 'react';
import { Typography } from 'antd';
const { Title } = Typography;

const Clients: React.FC = () => {
  return (
    <>
      <Title level={2}>List of Clients</Title>
      {/* Aqui virá a Table com Drawer/Modal exatamente como no PDF */}
    </>
  );
};

export default Clients;

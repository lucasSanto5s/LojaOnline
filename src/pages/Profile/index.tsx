import React from 'react';
import { Typography } from 'antd';
const { Title } = Typography;

const Profile: React.FC = () => {
  return (
    <>
      <Title level={2}>My Profile</Title>
      {/* Dados do usuário logado + histórico de compras */}
    </>
  );
};

export default Profile;

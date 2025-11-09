import React from 'react';
import { Typography } from 'antd';
const { Title } = Typography;

const Users: React.FC = () => {
  return (
    <>
      <Title level={2}>User Management (Admin)</Title>
      {/* CRUD de usuários local (admin only) */}
    </>
  );
};

export default Users;

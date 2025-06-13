
import React from 'react';
import { useAuthStore } from '../../store/auth-store';
import UserProfile from './UserProfile';

const UserMenu: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return <UserProfile />;
};

export default UserMenu;

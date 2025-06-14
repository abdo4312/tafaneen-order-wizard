
import React from 'react';
import { User, LogOut, Settings, ShoppingBag, Mail, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Button from '../Button';

const UserProfile: React.FC = () => {
  const { user, profile, logout } = useAuthStore();

  if (!user) return null;

  const displayName = profile?.name || user.email?.split('@')[0] || 'المستخدم';
  const userEmail = user.email || '';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const createdAt = profile?.created_at || user.created_at || new Date().toISOString();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="hidden md:inline font-medium">{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 text-right bg-white shadow-lg border" style={{ direction: 'rtl' }}>
        {/* User Info Header */}
        <div className="px-4 py-3 bg-red-50 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-red-900">{displayName}</p>
              <div className="flex items-center gap-1 text-sm text-red-700">
                <Mail className="w-3 h-3" />
                <span>{userEmail}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                <Calendar className="w-3 h-3" />
                <span>عضو منذ {formatDate(createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="py-2">
          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <div className="text-right">
              <p className="font-medium text-gray-900">طلباتي السابقة</p>
              <p className="text-xs text-gray-500">عرض تاريخ الطلبات</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
            <Settings className="w-5 h-5 text-gray-600" />
            <div className="text-right">
              <p className="font-medium text-gray-900">إعدادات الحساب</p>
              <p className="text-xs text-gray-500">إدارة بياناتك الشخصية</p>
            </div>
          </DropdownMenuItem>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Logout */}
        <div className="p-2">
          <DropdownMenuItem 
            className="flex items-center gap-3 px-4 py-3 cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-md"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <div className="text-right">
              <p className="font-medium">تسجيل الخروج</p>
              <p className="text-xs text-red-500">الخروج من حسابك</p>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;

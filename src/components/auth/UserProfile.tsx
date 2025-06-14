
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
      <DropdownMenuContent align="end" className="w-72 text-right" style={{ direction: 'rtl' }}>
        <div className="px-4 py-3 bg-red-50">
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
        
        <DropdownMenuSeparator />
        
        <div className="px-2 py-1">
          <DropdownMenuItem className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium">طلباتي السابقة</p>
              <p className="text-xs text-gray-500">عرض الطلبات</p>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50">
            <Settings className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium">إعدادات الحساب</p>
              <p className="text-xs text-gray-500">إدارة تفضيلاتك</p>
            </div>
          </DropdownMenuItem>
        </div>
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <DropdownMenuItem 
            className="flex items-center gap-3 py-3 cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <div>
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

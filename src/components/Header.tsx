
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  showLogo?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, showLogo = false }) => {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-red-500 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          {showLogo && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-sm">T</span>
              </div>
            </div>
          )}
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        
        {showLogo && (
          <div className="text-right">
            <div className="text-xs opacity-90">STUDIO & PRINT</div>
            <div className="font-bold">TAFANEEN</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

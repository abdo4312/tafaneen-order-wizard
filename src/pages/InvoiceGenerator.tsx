import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InvoiceGenerator from '../components/invoice/InvoiceGenerator';

const InvoiceGeneratorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="إنشاء فاتورة مخصصة" 
        onBack={() => navigate('/')}
      />
      
      <div className="py-6">
        <InvoiceGenerator />
      </div>
    </div>
  );
};

export default InvoiceGeneratorPage;
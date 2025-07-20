
export const DELIVERY_AREAS = [
  {
    id: 'gate1',
    name: 'البوابة الأولى',
    price: 20
  },
  {
    id: 'gate2', 
    name: 'البوابة الثانية',
    price: 20
  },
  {
    id: 'gate3',
    name: 'البوابة الثالثة', 
    price: 20
  },
  {
    id: 'gate4',
    name: 'البوابة الرابعة',
    price: 25
  },
  {
    id: 'officers_housing',
    name: 'مساكن الضباط',
    price: 30
  }
];

export const PAYMENT_METHODS = [
  {
    id: 'cod',
    name: 'الدفع عند الاستلام',
    icon: '💰',
    feePercentage: 0
  },
  {
    id: 'vodafone_cash',
    name: 'فودافون كاش',
    icon: '📱',
    feePercentage: 1,
    number: '01066334002'
  },
  {
    id: 'instapay',
    name: 'انستا باي', 
    icon: '💳',
    feePercentage: 0,
    number: '01066334002'
  }
];

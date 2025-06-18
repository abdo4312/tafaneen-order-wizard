import { PrintingPrices } from '../types';

export const PRINTING_PRICES: PrintingPrices = {
  single: {
    bw: {
      a4: {
        normal: 1,
        glossy: 3,
        coated: 2
      },
      a3: {
        normal: 2,
        glossy: 6,
        coated: 4
      }
    },
    color: {
      a4: {
        normal: 3,
        glossy: 8,
        coated: 5
      },
      a3: {
        normal: 6,
        glossy: 15,
        coated: 10
      }
    }
  },
  double: {
    bw: {
      a4: {
        normal: 1.5,
        glossy: 4,
        coated: 3
      },
      a3: {
        normal: 3,
        glossy: 8,
        coated: 6
      }
    },
    color: {
      a4: {
        normal: 4,
        glossy: 10,
        coated: 7
      },
      a3: {
        normal: 8,
        glossy: 18,
        coated: 12
      }
    }
  }
};

export const PRINTING_OPTIONS = {
  printType: [
    { value: 'single', label: 'وجه واحد' },
    { value: 'double', label: 'وجهين' }
  ],
  colorType: [
    { value: 'bw', label: 'أبيض وأسود' },
    { value: 'color', label: 'ملون' }
  ],
  paperSize: [
    { value: 'a4', label: 'A4' },
    { value: 'a3', label: 'A3' }
  ],
  paperType: [
    { value: 'normal', label: 'ورق عادي' },
    { value: 'glossy', label: 'ورق فوتوجلوسي لامع' },
    { value: 'coated', label: 'ورق كوشيه' }
  ]
};
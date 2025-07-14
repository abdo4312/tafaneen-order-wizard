import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// تكوين PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface FilePageInfo {
  pageCount: number;
  sheetsRequired: number;
  fileType: 'pdf' | 'word' | 'image';
  fileName: string;
  fileSize: number;
  isValidSize: boolean;
  preview?: string;
}

export interface PrintCalculation {
  totalPages: number;
  sheetsRequired: number;
  printType: 'single' | 'double';
  copies: number;
  totalSheets: number;
  costPerSheet: number;
  totalCost: number;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export const countPages = async (file: File): Promise<FilePageInfo> => {
  const fileInfo: FilePageInfo = {
    pageCount: 1,
    sheetsRequired: 1,
    fileType: 'image',
    fileName: file.name,
    fileSize: file.size,
    isValidSize: file.size <= MAX_FILE_SIZE
  };

  if (!fileInfo.isValidSize) {
    throw new Error(`حجم الملف كبير جداً. الحد الأقصى المسموح: ${formatFileSize(MAX_FILE_SIZE)}`);
  }

  try {
    if (file.type === 'application/pdf') {
      fileInfo.fileType = 'pdf';
      const result = await countPdfPages(file);
      fileInfo.pageCount = result.pageCount;
      fileInfo.preview = result.preview;
    } else if (
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      fileInfo.fileType = 'word';
      const result = await countWordPages(file);
      fileInfo.pageCount = result.pageCount;
      fileInfo.preview = result.preview;
    } else if (file.type.startsWith('image/')) {
      fileInfo.fileType = 'image';
      fileInfo.pageCount = 1;
      fileInfo.preview = await createImagePreview(file);
    }

    // حساب عدد الأوراق المطلوبة (افتراضياً وجه واحد)
    fileInfo.sheetsRequired = fileInfo.pageCount;

  } catch (error) {
    console.error('خطأ في حساب عدد الصفحات:', error);
    throw error;
  }

  return fileInfo;
};

const countPdfPages = async (file: File): Promise<{pageCount: number, preview?: string}> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // إنشاء معاينة للصفحة الأولى
    let preview: string | undefined;
    try {
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        preview = canvas.toDataURL();
      }
    } catch (previewError) {
      console.warn('فشل في إنشاء معاينة PDF:', previewError);
    }
    
    return { pageCount: pdf.numPages, preview };
  } catch (error) {
    console.error('خطأ في قراءة ملف PDF:', error);
    throw new Error('فشل في قراءة ملف PDF. تأكد من أن الملف غير تالف.');
  }
};

const countWordPages = async (file: File): Promise<{pageCount: number, preview?: string}> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    // حساب تقريبي لعدد الصفحات بناءً على طول النص
    const htmlContent = result.value;
    const textLength = htmlContent.replace(/<[^>]*>/g, '').length;
    
    // تقدير محسن: حوالي 2500 حرف لكل صفحة (متوسط أكثر دقة)
    const estimatedPages = Math.max(1, Math.ceil(textLength / 2500));
    
    // إنشاء معاينة HTML مبسطة
    const preview = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-height: 300px; overflow: hidden;">
        ${htmlContent.substring(0, 1000)}${htmlContent.length > 1000 ? '...' : ''}
      </div>
    `;
    
    return { pageCount: estimatedPages, preview };
  } catch (error) {
    console.error('خطأ في قراءة ملف Word:', error);
    throw new Error('فشل في قراءة ملف Word. تأكد من أن الملف غير تالف.');
  }
};

const createImagePreview = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('فشل في قراءة الصورة'));
      }
    };
    reader.onerror = () => reject(new Error('فشل في قراءة الصورة'));
    reader.readAsDataURL(file);
  });
};

export const calculateSheetsRequired = (pageCount: number, printType: 'single' | 'double'): number => {
  if (printType === 'single') {
    return pageCount; // كل صفحة تحتاج ورقة منفصلة
  } else {
    return Math.ceil(pageCount / 2); // صفحتان في كل ورقة
  }
};

export const calculatePrintingCost = (
  pageCount: number,
  printType: 'single' | 'double',
  colorType: 'bw' | 'color',
  paperSize: 'a4' | 'a3',
  paperType: 'normal' | 'glossy' | 'coated',
  copies: number,
  pricePerPage: number
): PrintCalculation => {
  const sheetsRequired = calculateSheetsRequired(pageCount, printType);
  const totalSheets = sheetsRequired * copies;
  const totalCost = pageCount * pricePerPage * copies;

  return {
    totalPages: pageCount,
    sheetsRequired,
    printType,
    copies,
    totalSheets,
    costPerSheet: pricePerPage,
    totalCost
  };
};

export const formatFileType = (fileType: string): string => {
  switch (fileType) {
    case 'pdf':
      return 'PDF';
    case 'word':
      return 'مستند Word';
    case 'image':
      return 'صورة';
    default:
      return 'غير معروف';
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];
  
  return allowedTypes.includes(file.type);
};

export const getFileTypeError = (file: File): string | null => {
  if (!validateFileType(file)) {
    return 'نوع الملف غير مدعوم. يرجى اختيار ملف PDF أو Word أو صورة (JPG/PNG)';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return `حجم الملف كبير جداً. الحد الأقصى المسموح: ${formatFileSize(MAX_FILE_SIZE)}`;
  }
  
  return null;
};
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// تكوين PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface FilePageInfo {
  pageCount: number;
  fileType: 'pdf' | 'word' | 'image';
  fileName: string;
  fileSize: number;
}

export const countPages = async (file: File): Promise<FilePageInfo> => {
  const fileInfo: FilePageInfo = {
    pageCount: 1,
    fileType: 'image',
    fileName: file.name,
    fileSize: file.size
  };

  try {
    if (file.type === 'application/pdf') {
      fileInfo.fileType = 'pdf';
      fileInfo.pageCount = await countPdfPages(file);
    } else if (
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      fileInfo.fileType = 'word';
      fileInfo.pageCount = await countWordPages(file);
    } else if (file.type.startsWith('image/')) {
      fileInfo.fileType = 'image';
      fileInfo.pageCount = 1; // كل صورة = صفحة واحدة
    }
  } catch (error) {
    console.error('خطأ في حساب عدد الصفحات:', error);
    // في حالة الخطأ، نعتبر الملف صفحة واحدة
    fileInfo.pageCount = 1;
  }

  return fileInfo;
};

const countPdfPages = async (file: File): Promise<number> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
  } catch (error) {
    console.error('خطأ في قراءة ملف PDF:', error);
    return 1;
  }
};

const countWordPages = async (file: File): Promise<number> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    // حساب تقريبي لعدد الصفحات بناءً على طول النص
    const htmlContent = result.value;
    const textLength = htmlContent.replace(/<[^>]*>/g, '').length;
    
    // تقدير: حوالي 3000 حرف لكل صفحة (متوسط)
    const estimatedPages = Math.max(1, Math.ceil(textLength / 3000));
    
    return estimatedPages;
  } catch (error) {
    console.error('خطأ في قراءة ملف Word:', error);
    return 1;
  }
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

export const calculatePrintingCost = (
  pageCount: number,
  printType: string,
  colorType: string,
  paperSize: string,
  paperType: string,
  copies: number,
  pricePerPage: number
): number => {
  return pageCount * pricePerPage * copies;
};
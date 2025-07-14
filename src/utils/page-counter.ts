import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// تكوين PDF.js مع معالجة أفضل للأخطاء
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface FilePageInfo {
  pageCount: number;
  sheetsRequired: number;
  fileType: 'pdf' | 'word' | 'image';
  fileName: string;
  fileSize: number;
  isValidSize: boolean;
  isValidFormat: boolean;
  preview?: string;
  diagnostics?: FileDiagnostics;
}

export interface FileDiagnostics {
  isCorrupted: boolean;
  hasPassword: boolean;
  pdfVersion?: string;
  errorDetails?: string;
  processingTime: number;
  fileIntegrity: 'good' | 'warning' | 'error';
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
const PDF_PROCESSING_TIMEOUT = 30000; // 30 seconds

export const countPages = async (file: File): Promise<FilePageInfo> => {
  const startTime = Date.now();
  
  const fileInfo: FilePageInfo = {
    pageCount: 1,
    sheetsRequired: 1,
    fileType: 'image',
    fileName: file.name,
    fileSize: file.size,
    isValidSize: file.size <= MAX_FILE_SIZE,
    isValidFormat: true,
    diagnostics: {
      isCorrupted: false,
      hasPassword: false,
      processingTime: 0,
      fileIntegrity: 'good'
    }
  };

  // التحقق الأولي من حجم الملف
  if (!fileInfo.isValidSize) {
    throw new Error(`حجم الملف كبير جداً. الحد الأقصى المسموح: ${formatFileSize(MAX_FILE_SIZE)}`);
  }

  // التحقق من صيغة الملف
  const formatValidation = validateFileFormat(file);
  if (!formatValidation.isValid) {
    fileInfo.isValidFormat = false;
    fileInfo.diagnostics!.fileIntegrity = 'error';
    fileInfo.diagnostics!.errorDetails = formatValidation.error;
    throw new Error(formatValidation.error);
  }

  try {
    if (file.type === 'application/pdf') {
      fileInfo.fileType = 'pdf';
      const result = await processPdfWithDiagnostics(file);
      fileInfo.pageCount = result.pageCount;
      fileInfo.preview = result.preview;
      fileInfo.diagnostics = { ...fileInfo.diagnostics, ...result.diagnostics };
    } else if (
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      fileInfo.fileType = 'word';
      const result = await processWordWithDiagnostics(file);
      fileInfo.pageCount = result.pageCount;
      fileInfo.preview = result.preview;
      fileInfo.diagnostics = { ...fileInfo.diagnostics, ...result.diagnostics };
    } else if (file.type.startsWith('image/')) {
      fileInfo.fileType = 'image';
      fileInfo.pageCount = 1;
      fileInfo.preview = await createImagePreview(file);
    }

    // حساب عدد الأوراق المطلوبة (افتراضياً وجه واحد)
    fileInfo.sheetsRequired = fileInfo.pageCount;
    fileInfo.diagnostics!.processingTime = Date.now() - startTime;

  } catch (error) {
    fileInfo.diagnostics!.processingTime = Date.now() - startTime;
    fileInfo.diagnostics!.fileIntegrity = 'error';
    fileInfo.diagnostics!.errorDetails = error instanceof Error ? error.message : 'خطأ غير معروف';
    
    console.error('خطأ في معالجة الملف:', error);
    throw error;
  }

  return fileInfo;
};

const validateFileFormat = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  // التحقق من نوع الملف
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `نوع الملف غير مدعوم: ${file.type}. الأنواع المدعومة: PDF, Word, JPG, PNG`
    };
  }

  // التحقق من امتداد الملف
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return {
      isValid: false,
      error: 'امتداد الملف غير صحيح. يرجى التأكد من أن الملف له امتداد صحيح'
    };
  }

  // التحقق من الحد الأدنى لحجم الملف
  if (file.size < 100) { // أقل من 100 بايت
    return {
      isValid: false,
      error: 'الملف صغير جداً أو قد يكون تالفاً'
    };
  }

  return { isValid: true };
};

const processPdfWithDiagnostics = async (file: File): Promise<{
  pageCount: number;
  preview?: string;
  diagnostics: Partial<FileDiagnostics>;
}> => {
  const diagnostics: Partial<FileDiagnostics> = {
    isCorrupted: false,
    hasPassword: false,
    fileIntegrity: 'good'
  };

  try {
    // قراءة الملف مع timeout
    const arrayBuffer = await Promise.race([
      file.arrayBuffer(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('انتهت مهلة قراءة الملف')), PDF_PROCESSING_TIMEOUT)
      )
    ]);

    // التحقق من سلامة البيانات
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      diagnostics.isCorrupted = true;
      diagnostics.fileIntegrity = 'error';
      throw new Error('الملف فارغ أو تالف');
    }

    // التحقق من header PDF
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdfHeader = String.fromCharCode(...uint8Array.slice(0, 5));
    if (pdfHeader !== '%PDF-') {
      diagnostics.isCorrupted = true;
      diagnostics.fileIntegrity = 'error';
      throw new Error('الملف ليس PDF صالح - header غير صحيح');
    }

    // استخراج إصدار PDF
    const headerLine = String.fromCharCode(...uint8Array.slice(0, 20));
    const versionMatch = headerLine.match(/%PDF-(\d+\.\d+)/);
    if (versionMatch) {
      diagnostics.pdfVersion = versionMatch[1];
    }

    // محاولة تحميل PDF
    let pdf;
    try {
      pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0, // تقليل الرسائل
        stopAtErrors: false // المتابعة رغم الأخطاء البسيطة
      }).promise;
    } catch (pdfError: any) {
      // التحقق من أخطاء محددة
      if (pdfError.name === 'PasswordException') {
        diagnostics.hasPassword = true;
        diagnostics.fileIntegrity = 'error';
        throw new Error('الملف محمي بكلمة مرور. يرجى إزالة الحماية أولاً');
      } else if (pdfError.name === 'InvalidPDFException') {
        diagnostics.isCorrupted = true;
        diagnostics.fileIntegrity = 'error';
        throw new Error('ملف PDF تالف أو غير صالح');
      } else {
        diagnostics.fileIntegrity = 'error';
        diagnostics.errorDetails = pdfError.message;
        throw new Error(`خطأ في قراءة PDF: ${pdfError.message}`);
      }
    }

    // التحقق من عدد الصفحات
    if (!pdf.numPages || pdf.numPages <= 0) {
      diagnostics.isCorrupted = true;
      diagnostics.fileIntegrity = 'error';
      throw new Error('لا يمكن تحديد عدد صفحات PDF');
    }

    // تحذير للملفات الكبيرة
    if (pdf.numPages > 1000) {
      diagnostics.fileIntegrity = 'warning';
      diagnostics.errorDetails = 'ملف كبير جداً - قد يستغرق وقتاً أطول للمعالجة';
    }

    // إنشاء معاينة للصفحة الأولى
    let preview: string | undefined;
    try {
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 }); // تقليل الحجم لسرعة أكبر
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        preview = canvas.toDataURL('image/jpeg', 0.7); // ضغط الصورة
      }
    } catch (previewError) {
      console.warn('فشل في إنشاء معاينة PDF:', previewError);
      diagnostics.errorDetails = 'تم تحليل الملف بنجاح لكن فشل في إنشاء المعاينة';
    }
    
    return { 
      pageCount: pdf.numPages, 
      preview,
      diagnostics 
    };

  } catch (error) {
    diagnostics.fileIntegrity = 'error';
    diagnostics.errorDetails = error instanceof Error ? error.message : 'خطأ غير معروف';
    
    // محاولة تشخيص أكثر تفصيلاً
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('انتهت مهلة')) {
        throw new Error('الملف كبير جداً أو الاتصال بطيء. يرجى المحاولة مرة أخرى أو استخدام ملف أصغر');
      } else if (error.message.includes('memory') || error.message.includes('ذاكرة')) {
        throw new Error('الملف كبير جداً للمعالجة. يرجى تقليل حجم الملف أو تقسيمه');
      }
    }
    
    throw error;
  }
};

const processWordWithDiagnostics = async (file: File): Promise<{
  pageCount: number;
  preview?: string;
  diagnostics: Partial<FileDiagnostics>;
}> => {
  const diagnostics: Partial<FileDiagnostics> = {
    isCorrupted: false,
    fileIntegrity: 'good'
  };

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // التحقق من سلامة البيانات
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      diagnostics.isCorrupted = true;
      diagnostics.fileIntegrity = 'error';
      throw new Error('ملف Word فارغ أو تالف');
    }

    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    // التحقق من وجود محتوى
    if (!result.value || result.value.trim().length === 0) {
      diagnostics.isCorrupted = true;
      diagnostics.fileIntegrity = 'error';
      throw new Error('ملف Word فارغ أو لا يحتوي على نص');
    }

    // حساب تقريبي محسن لعدد الصفحات
    const htmlContent = result.value;
    const textContent = htmlContent.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    
    // تقدير محسن: 250-300 كلمة لكل صفحة (متوسط أكثر دقة)
    const estimatedPages = Math.max(1, Math.ceil(wordCount / 275));
    
    // تحذير للملفات الكبيرة
    if (estimatedPages > 500) {
      diagnostics.fileIntegrity = 'warning';
      diagnostics.errorDetails = 'ملف كبير جداً - التقدير قد يكون غير دقيق';
    }

    // إنشاء معاينة HTML مبسطة
    const preview = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-height: 400px; overflow: hidden; border: 1px solid #ddd; border-radius: 8px; background: white;">
        <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
          معاينة المستند - تقدير: ${estimatedPages} صفحة (${wordCount} كلمة)
        </div>
        ${htmlContent.substring(0, 2000)}${htmlContent.length > 2000 ? '<div style="color: #999; font-style: italic; margin-top: 10px;">...</div>' : ''}
      </div>
    `;
    
    return { 
      pageCount: estimatedPages, 
      preview,
      diagnostics 
    };

  } catch (error) {
    diagnostics.fileIntegrity = 'error';
    diagnostics.errorDetails = error instanceof Error ? error.message : 'خطأ في معالجة Word';
    
    console.error('خطأ في قراءة ملف Word:', error);
    throw new Error('فشل في قراءة ملف Word. تأكد من أن الملف غير تالف وغير محمي بكلمة مرور.');
  }
};

const createImagePreview = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // التحقق من نوع الصورة
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف ليس صورة صالحة'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        // التحقق من أن النتيجة صورة صالحة
        const img = new Image();
        img.onload = () => {
          resolve(e.target!.result as string);
        };
        img.onerror = () => {
          reject(new Error('الصورة تالفة أو غير صالحة'));
        };
        img.src = e.target.result as string;
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
  const validation = validateFileFormat(file);
  if (!validation.isValid) {
    return validation.error!;
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return `حجم الملف كبير جداً. الحد الأقصى المسموح: ${formatFileSize(MAX_FILE_SIZE)}`;
  }
  
  return null;
};

// دالة تشخيص شاملة للملف
export const diagnoseFile = async (file: File): Promise<FileDiagnostics> => {
  const startTime = Date.now();
  
  try {
    const fileInfo = await countPages(file);
    return fileInfo.diagnostics || {
      isCorrupted: false,
      hasPassword: false,
      processingTime: Date.now() - startTime,
      fileIntegrity: 'good'
    };
  } catch (error) {
    return {
      isCorrupted: true,
      hasPassword: false,
      processingTime: Date.now() - startTime,
      fileIntegrity: 'error',
      errorDetails: error instanceof Error ? error.message : 'خطأ غير معروف'
    };
  }
};
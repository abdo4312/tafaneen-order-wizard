import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2, FileCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { countPages, FilePageInfo, formatFileType } from '../../utils/page-counter';

interface DocumentUploadProps {
  file: File | null;
  onFileSelect: (file: File | null, pageInfo?: FilePageInfo) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ file, onFileSelect }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pageInfo, setPageInfo] = useState<FilePageInfo | null>(null);

  const analyzeFile = async (selectedFile: File) => {
    setIsAnalyzing(true);
    try {
      const info = await countPages(selectedFile);
      setPageInfo(info);
      onFileSelect(selectedFile, info);
    } catch (error) {
      console.error('خطأ في تحليل الملف:', error);
      onFileSelect(selectedFile);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];
      
      if (allowedTypes.includes(selectedFile.type)) {
        await analyzeFile(selectedFile);
      } else {
        alert('نوع الملف غير مدعوم. يرجى اختيار ملف PDF أو Word أو صورة');
      }
    }
  }, [onFileSelect]);

  const handleRemoveFile = () => {
    onFileSelect(null);
    setPageInfo(null);
    // Reset the input value to allow selecting the same file again
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];
      
      if (allowedTypes.includes(droppedFile.type)) {
        await analyzeFile(droppedFile);
      } else {
        alert('نوع الملف غير مدعوم. يرجى اختيار ملف PDF أو Word أو صورة');
      }
    }
  }, [onFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        رفع المستند
      </h3>
      
      {!file ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-blue-600 mb-4">جاري تحليل الملف وحساب عدد الصفحات...</p>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">اسحب الملف هنا أو اضغط لاختيار ملف</p>
              <p className="text-sm text-gray-500 mb-4">
                الأنواع المدعومة: PDF, Word, JPEG, PNG
              </p>
            </>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={isAnalyzing}
          />
          {!isAnalyzing && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              اختيار ملف
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button
              onClick={handleRemoveFile}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {pageInfo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">تم تحليل الملف بنجاح</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <div className="flex justify-between">
                  <span>نوع الملف:</span>
                  <span className="font-medium">{formatFileType(pageInfo.fileType)}</span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الصفحات:</span>
                  <span className="font-bold text-lg text-green-600">{pageInfo.pageCount} صفحة</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
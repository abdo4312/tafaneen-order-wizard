import React, { useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '../ui/button';

interface DocumentUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ file, onFileSelect }) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
        onFileSelect(selectedFile);
      } else {
        alert('نوع الملف غير مدعوم. يرجى اختيار ملف PDF أو Word أو صورة');
      }
    }
  }, [onFileSelect]);

  const handleRemoveFile = () => {
    onFileSelect(null);
  };

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
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">اسحب الملف هنا أو اضغط لاختيار ملف</p>
          <p className="text-sm text-gray-500 mb-4">
            الأنواع المدعومة: PDF, Word, JPEG, PNG
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
              اختيار ملف
            </Button>
          </label>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default DocumentUpload;
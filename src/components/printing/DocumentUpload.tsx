import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2, FileCheck, AlertTriangle, Eye, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { countPages, FilePageInfo, formatFileType, formatFileSize, getFileTypeError } from '../../utils/page-counter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface DocumentUploadProps {
  file: File | null;
  onFileSelect: (file: File | null, pageInfo?: FilePageInfo) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ file, onFileSelect }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pageInfo, setPageInfo] = useState<FilePageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const analyzeFile = async (selectedFile: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // التحقق من نوع وحجم الملف
      const fileError = getFileTypeError(selectedFile);
      if (fileError) {
        throw new Error(fileError);
      }

      const info = await countPages(selectedFile);
      setPageInfo(info);
      onFileSelect(selectedFile, info);
    } catch (error) {
      console.error('خطأ في تحليل الملف:', error);
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ في تحليل الملف';
      setError(errorMessage);
      onFileSelect(selectedFile);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      await analyzeFile(selectedFile);
    }
  }, []);

  const handleRemoveFile = () => {
    onFileSelect(null);
    setPageInfo(null);
    setError(null);
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
      await analyzeFile(droppedFile);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const PreviewModal = () => {
    if (!pageInfo?.preview) return null;

    return (
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>معاينة الملف: {pageInfo.fileName}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {pageInfo.fileType === 'image' ? (
              <img 
                src={pageInfo.preview} 
                alt="معاينة الملف" 
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            ) : pageInfo.fileType === 'pdf' ? (
              <img 
                src={pageInfo.preview} 
                alt="معاينة الصفحة الأولى" 
                className="max-w-full h-auto rounded-lg shadow-lg border"
              />
            ) : (
              <div 
                dangerouslySetInnerHTML={{ __html: pageInfo.preview }} 
                className="bg-white p-4 rounded-lg shadow-lg border max-h-96 overflow-auto"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        رفع المستند للطباعة
      </h3>
      
      {!file ? (
        <div className="space-y-4">
          {/* Upload Area */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin" />
                <p className="text-blue-600 mb-4 font-medium">جاري تحليل الملف وحساب عدد الصفحات...</p>
                <p className="text-sm text-blue-500">يرجى الانتظار، قد يستغرق هذا بضع ثوانٍ</p>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">اسحب الملف هنا أو اضغط لاختيار ملف</h4>
                <p className="text-gray-600 mb-4">
                  سيتم تحليل الملف تلقائياً وحساب عدد الصفحات والتكلفة
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
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 cursor-pointer">
                اختيار ملف للطباعة
              </Button>
            )}
          </div>

          {/* Supported Formats */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">الملفات المدعومة:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div>
                    <div className="font-medium mb-1">📄 مستندات PDF</div>
                    <div className="text-xs">حساب تلقائي دقيق للصفحات</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">📝 مستندات Word</div>
                    <div className="text-xs">.doc, .docx</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">🖼️ الصور</div>
                    <div className="text-xs">JPG, PNG (كل صورة = صفحة)</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-blue-600">
                  <strong>الحد الأقصى لحجم الملف:</strong> 50 ميجابايت
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {pageInfo?.preview && (
                <Button
                  onClick={() => setShowPreview(true)}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  معاينة
                </Button>
              )}
              <Button
                onClick={handleRemoveFile}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
                إزالة
              </Button>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">خطأ في تحليل الملف</span>
              </div>
              <p className="text-sm text-red-700 mb-3">{error}</p>
              <Button
                onClick={() => analyzeFile(file)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2"
              >
                إعادة المحاولة
              </Button>
            </div>
          )}
          
          {/* Success Display */}
          {pageInfo && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">تم تحليل الملف بنجاح ✅</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{pageInfo.pageCount}</div>
                  <div className="text-sm text-green-700">إجمالي الصفحات</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-lg font-medium text-green-600 mb-1">{formatFileType(pageInfo.fileType)}</div>
                  <div className="text-sm text-green-700">نوع الملف</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-lg font-medium text-green-600 mb-1">
                    {pageInfo.isValidSize ? '✅ مناسب' : '⚠️ كبير'}
                  </div>
                  <div className="text-sm text-green-700">حجم الملف</div>
                </div>
              </div>

              {!pageInfo.isValidSize && (
                <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded p-3">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ حجم الملف كبير. قد يستغرق التحليل والطباعة وقتاً أطول من المعتاد.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <PreviewModal />
    </div>
  );
};

export default DocumentUpload;
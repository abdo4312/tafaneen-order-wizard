import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2, FileCheck, AlertTriangle, Eye, Info, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { countPages, FilePageInfo, formatFileType, formatFileSize, getFileTypeError, diagnoseFile, FileDiagnostics } from '../../utils/page-counter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';

interface DocumentUploadProps {
  file: File | null;
  onFileSelect: (file: File | null, pageInfo?: FilePageInfo) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ file, onFileSelect }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pageInfo, setPageInfo] = useState<FilePageInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const analyzeFile = async (selectedFile: File, isRetry: boolean = false) => {
    setIsAnalyzing(true);
    setError(null);
    
    if (isRetry) {
      setRetryCount(prev => prev + 1);
    } else {
      setRetryCount(0);
    }
    
    try {
      console.log(`🔍 بدء تحليل الملف: ${selectedFile.name} (المحاولة ${retryCount + 1})`);
      
      // التحقق من نوع وحجم الملف
      const fileError = getFileTypeError(selectedFile);
      if (fileError) {
        throw new Error(fileError);
      }

      const info = await countPages(selectedFile);
      console.log('✅ تم تحليل الملف بنجاح:', info);
      
      setPageInfo(info);
      onFileSelect(selectedFile, info);
      
      // عرض تحذيرات إذا وجدت
      if (info.diagnostics?.fileIntegrity === 'warning') {
        console.warn('⚠️ تحذير:', info.diagnostics.errorDetails);
      }
      
    } catch (error) {
      console.error('❌ خطأ في تحليل الملف:', error);
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
    setRetryCount(0);
    // Reset the input value to allow selecting the same file again
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleRetry = () => {
    if (file) {
      analyzeFile(file, true);
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

  const runDiagnostics = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    try {
      const diagnostics = await diagnoseFile(file);
      console.log('🔧 تشخيص الملف:', diagnostics);
      setShowDiagnostics(true);
    } catch (error) {
      console.error('خطأ في التشخيص:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  const DiagnosticsModal = () => {
    if (!pageInfo?.diagnostics) return null;

    const diagnostics = pageInfo.diagnostics;

    return (
      <Dialog open={showDiagnostics} onOpenChange={setShowDiagnostics}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>تشخيص الملف: {pageInfo.fileName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* حالة الملف العامة */}
            <div className={`p-4 rounded-lg border ${
              diagnostics.fileIntegrity === 'good' ? 'bg-green-50 border-green-200' :
              diagnostics.fileIntegrity === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {diagnostics.fileIntegrity === 'good' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : diagnostics.fileIntegrity === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">
                  {diagnostics.fileIntegrity === 'good' ? 'الملف سليم' :
                   diagnostics.fileIntegrity === 'warning' ? 'تحذيرات' : 'مشاكل في الملف'}
                </span>
              </div>
              {diagnostics.errorDetails && (
                <p className="text-sm">{diagnostics.errorDetails}</p>
              )}
            </div>

            {/* تفاصيل التشخيص */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">حالة الملف</div>
                <div className="font-medium">
                  {diagnostics.isCorrupted ? '❌ تالف' : '✅ سليم'}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">كلمة مرور</div>
                <div className="font-medium">
                  {diagnostics.hasPassword ? '🔒 محمي' : '🔓 غير محمي'}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">وقت المعالجة</div>
                <div className="font-medium">{diagnostics.processingTime}ms</div>
              </div>
              
              {diagnostics.pdfVersion && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">إصدار PDF</div>
                  <div className="font-medium">{diagnostics.pdfVersion}</div>
                </div>
              )}
            </div>

            {/* نصائح الإصلاح */}
            {diagnostics.fileIntegrity !== 'good' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 نصائح لحل المشكلة:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {diagnostics.isCorrupted && (
                    <>
                      <li>• جرب فتح الملف في برنامج PDF أو Word للتأكد من سلامته</li>
                      <li>• قم بإعادة تحميل الملف من مصدره الأصلي</li>
                      <li>• تأكد من اكتمال تحميل الملف</li>
                    </>
                  )}
                  {diagnostics.hasPassword && (
                    <li>• قم بإزالة كلمة المرور من الملف قبل رفعه</li>
                  )}
                  <li>• جرب تحويل الملف إلى PDF جديد</li>
                  <li>• تأكد من تحديث متصفحك إلى أحدث إصدار</li>
                </ul>
              </div>
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
                {retryCount > 0 && (
                  <p className="text-xs text-blue-400 mt-2">المحاولة رقم {retryCount + 1}</p>
                )}
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
              {pageInfo?.diagnostics && (
                <Button
                  onClick={() => setShowDiagnostics(true)}
                  variant="outline"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Info className="w-4 h-4 mr-1" />
                  تشخيص
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
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <AlertDescription>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-red-800">خطأ في تحليل الملف:</span>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                  
                  {retryCount > 0 && (
                    <p className="text-xs text-red-600">عدد المحاولات: {retryCount}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={handleRetry}
                      disabled={isAnalyzing}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      إعادة المحاولة
                    </Button>
                    
                    <Button
                      onClick={runDiagnostics}
                      disabled={isAnalyzing}
                      variant="outline"
                      className="text-sm px-4 py-2"
                    >
                      <Info className="w-4 h-4 mr-1" />
                      تشخيص المشكلة
                    </Button>
                  </div>
                  
                  {/* نصائح سريعة */}
                  <div className="bg-red-100 border border-red-200 rounded p-3 mt-3">
                    <h5 className="font-medium text-red-800 mb-2">💡 نصائح سريعة:</h5>
                    <ul className="text-xs text-red-700 space-y-1">
                      <li>• تأكد من أن الملف يفتح بشكل صحيح على جهازك</li>
                      <li>• جرب ملف أصغر حجماً أو أقل تعقيداً</li>
                      <li>• تأكد من أن الملف غير محمي بكلمة مرور</li>
                      <li>• جرب تحويل الملف إلى PDF جديد</li>
                    </ul>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Success Display */}
          {pageInfo && !error && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">تم تحليل الملف بنجاح ✅</span>
                {pageInfo.diagnostics?.processingTime && (
                  <span className="text-xs text-green-600">
                    ({pageInfo.diagnostics.processingTime}ms)
                  </span>
                )}
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

              {/* تحذيرات */}
              {pageInfo.diagnostics?.fileIntegrity === 'warning' && (
                <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-yellow-800 text-sm font-medium">تحذير:</p>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    {pageInfo.diagnostics.errorDetails}
                  </p>
                </div>
              )}

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
      <DiagnosticsModal />
    </div>
  );
};

export default DocumentUpload;
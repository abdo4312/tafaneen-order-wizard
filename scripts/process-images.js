const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// تحديد المسارات
const sourceDir = path.resolve(__dirname, '../attached_assets');
const publicAssetsDir = path.resolve(__dirname, '../client/public/assets');
const distAssetsDir = path.resolve(__dirname, '../dist/public/assets');

// التأكد من وجود المجلدات
function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// تحويل اسم الملف إلى اسم URL-friendly
function sanitizeFileName(fileName) {
    // حذف الأحرف غير المسموح بها في URLs
    return fileName
        .replace(/[^a-z0-9.-]/gi, '-') // استبدال الأحرف غير المسموح بها بـ -
        .replace(/--+/g, '-')          // تقليل الشرطات المتكررة إلى واحدة
        .toLowerCase();                 // تحويل إلى أحرف صغيرة
}

// معالجة ونسخ الصور
async function processAndCopyImages(source, dest) {
    ensureDirectoryExists(dest);
    
    // قراءة جميع الملفات من المجلد المصدر
    const files = fs.readdirSync(source);
    const imageMap = {};

    for (const file of files) {
        const sourceFile = path.join(source, file);
        const newFileName = sanitizeFileName(file);
        const destFile = path.join(dest, newFileName);
        
        try {
            // معالجة الصورة مع sharp
            await sharp(sourceFile)
                .resize(800, 800, { // تحجيم الصورة مع الحفاظ على النسبة
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ // تحويل إلى JPEG مع جودة جيدة
                    quality: 85,
                    progressive: true
                })
                .toFile(destFile);
            
            // تخزين تعيين الاسم القديم إلى الجديد
            imageMap[file] = newFileName;
            console.log(`تمت معالجة ونسخ: ${file} => ${newFileName}`);
        } catch (error) {
            console.error(`خطأ في معالجة الملف ${file}:`, error);
        }
    }

    // إنشاء ملف تعيين لأسماء الصور
    const mapFilePath = path.join(dest, 'image-map.json');
    fs.writeFileSync(mapFilePath, JSON.stringify(imageMap, null, 2));
    
    return imageMap;
}

// التنفيذ الرئيسي
async function main() {
    try {
        console.log('بدء معالجة الصور...');
        
        // معالجة الصور للمجلد العام
        const imageMap = await processAndCopyImages(sourceDir, publicAssetsDir);
        
        // إذا كان مجلد dist موجوداً، نسخ الصور المعالجة إليه
        if (fs.existsSync(path.dirname(distAssetsDir))) {
            ensureDirectoryExists(distAssetsDir);
            // نسخ الصور المعالجة إلى مجلد dist
            const files = fs.readdirSync(publicAssetsDir);
            files.forEach(file => {
                const sourcePath = path.join(publicAssetsDir, file);
                const destPath = path.join(distAssetsDir, file);
                fs.copyFileSync(sourcePath, destPath);
            });
        }
        
        console.log('تم الانتهاء من معالجة ونسخ الصور بنجاح!');
        return imageMap;
    } catch (error) {
        console.error('حدث خطأ:', error);
        process.exit(1);
    }
}

// تشغيل السكريبت
main();

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تحديد المسارات
const sourceDir = path.resolve(__dirname, '../attached_assets');
const publicDir = path.resolve(__dirname, '../public');
const clientPublicDir = path.resolve(__dirname, '../client/public');
const distDir = path.resolve(__dirname, '../dist');
const imagesDir = 'images';

// التأكد من وجود المجلدات
async function ensureDirectoryExists(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

// نسخ الملفات من مجلد لآخر
async function copyFiles(source, dest) {
    // التأكد من وجود المجلد المصدر
    try {
        await fs.access(source);
    } catch {
        console.error(`المجلد المصدر غير موجود: ${source}`);
        return;
    }

    // التأكد من وجود المجلد الهدف
    const targetDir = path.join(dest, imagesDir);
    ensureDirectoryExists(targetDir);

    // قراءة محتويات المجلد المصدر وفلترة الصور
    const files = await fs.readdir(source);
    
    // تعيين أسماء الملفات الجديدة
    const fileMapping = {
        'WhatsApp Image 2025-07-18 at 4.44.59 PM_1753004100081.jpeg': 'bravo-mega-notebook.jpeg',
        'WhatsApp Image 2025-07-18 at 4.46.10 PM_1753004188486.jpeg': 'bravo-classic-notebook-pen.jpeg',
        'WhatsApp Image 2025-07-18 at 4.47.14 PM_1753004277535.jpeg': 'bravo-hardcover-notebook-a5.jpeg',
        'files_2723941-1752961293443-كشكول سلك 4 فواصل 200 A4 Hello-صورة-1_1753003363031.jpg': 'notebook-wire-4-dividers-200-a4-hello-1.jpg',
        'files_2723941-1752961293443-كشكول سلك 4 فواصل 200 A4 Hello-صورة-1_1753000650566.jpg': 'notebook-wire-4-dividers-200-a4-hello-2.jpg'
    };
    
    // نسخ كل ملف
    for (const file of files) {
        const sourceFile = path.join(source, file);
        const newFileName = fileMapping[file] || file;
        const destFile = path.join(targetDir, newFileName);

        // نسخ الملف فقط إذا كان صورة
        if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
            await fs.copyFile(sourceFile, destFile);
            console.log(`تم نسخ الملف: ${file} -> ${newFileName}`);
        }
    }
}

// تنفيذ عملية النسخ
async function main() {
    try {
        // نسخ الملفات إلى المجلد العام
        await copyFiles(sourceDir, publicDir);
        
        // نسخ الملفات إلى مجلد client/public
        await copyFiles(sourceDir, clientPublicDir);

        // نسخ الملفات إلى مجلد dist
        await ensureDirectoryExists(distDir);
        await copyFiles(sourceDir, distDir);

        console.log('تم نسخ جميع الملفات بنجاح!');
    } catch (error) {
        console.error('حدث خطأ أثناء نسخ الملفات:', error);
    }
}

main();

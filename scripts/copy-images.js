import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تحديد المسارات
const sourceDir = path.resolve(__dirname, '../attached_assets');
const publicDir = path.resolve(__dirname, '../public');
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
    
    // نسخ كل ملف
    for (const file of files) {
        const sourceFile = path.join(source, file);
        const destFile = path.join(targetDir, file);

        // نسخ الملف فقط إذا كان صورة
        if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
            await fs.copyFile(sourceFile, destFile);
            console.log(`تم نسخ الملف: ${file}`);
        }
    }
}

// تنفيذ عملية النسخ
async function main() {
    try {
        // نسخ الملفات إلى المجلد العام
        await copyFiles(sourceDir, publicDir);

        // نسخ الملفات إلى مجلد dist
        await ensureDirectoryExists(distDir);
        await copyFiles(sourceDir, distDir);

        console.log('تم نسخ جميع الملفات بنجاح!');
    } catch (error) {
        console.error('حدث خطأ أثناء نسخ الملفات:', error);
    }
}

main();

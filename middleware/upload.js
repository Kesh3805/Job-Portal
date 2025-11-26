import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'others';
    
    if (file.fieldname === 'resume') {
      folder = 'resumes';
    } else if (file.fieldname === 'logo') {
      folder = 'logos';
    } else if (file.fieldname === 'avatar') {
      folder = 'avatars';
    }
    
    const dest = path.join(uploadDir, folder);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    resume: ['.pdf', '.doc', '.docx'],
    logo: ['.jpg', '.jpeg', '.png', '.svg'],
    avatar: ['.jpg', '.jpeg', '.png'],
    document: ['.pdf', '.doc', '.docx', '.txt']
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const fieldType = file.fieldname;

  if (allowedTypes[fieldType] && allowedTypes[fieldType].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${fieldType}. Allowed types: ${allowedTypes[fieldType]?.join(', ')}`), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

export default upload;

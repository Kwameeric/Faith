export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
  sizeThreshold?: number; // Only compress if file is larger than this (bytes)
  forceJpeg?: boolean;
  preserveQuality?: boolean; // Use higher quality for detailed images (AI, photos)
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxWidth: 1600,           // Larger max for better AI image quality
  maxHeight: 1600,
  quality: 0.85,            // Higher quality preserves AI detail
  mimeType: 'image/jpeg',
  sizeThreshold: 100 * 1024,
  forceJpeg: false,
  preserveQuality: false,
};

/**
 * Detect if file is likely an AI-generated image
 * AI images tend to be large PNGs with complex patterns
 */
function isLikelyAiImage(file: File): boolean {
  // AI generators often produce large PNGs (2MB+) with high resolution
  return file.size > 2 * 1024 * 1024 && file.type === 'image/png';
}

/**
 * Compress an image file with smart settings for AI images
 */
export async function compressImage(file: File, userOptions: CompressOptions = {}): Promise<string> {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };

  // Auto-detect AI images and use higher quality
  const isAi = isLikelyAiImage(file);
  const effectiveQuality = options.preserveQuality || isAi ? 0.88 : options.quality;
  const effectiveMaxWidth = options.preserveQuality || isAi ? 1800 : options.maxWidth;
  const effectiveMaxHeight = options.preserveQuality || isAi ? 1800 : options.maxHeight;

  // Determine target format
  let targetMime = options.mimeType;
  if (options.forceJpeg) {
    targetMime = 'image/jpeg';
  } else if (file.size > 1024 * 1024) {
    // Large files (> 1MB) → convert to JPEG for better compression
    targetMime = 'image/jpeg';
  } else if (file.type === 'image/png' && file.size <= 1024 * 1024) {
    // Small PNGs (likely logos/icons) → keep as PNG
    targetMime = 'image/png';
  }

  if (isAi) {
    console.log(`🎨 Detected AI image: ${file.name} (${formatFileSize(file.size)}) - using high-quality compression`);
  }

  return new Promise((resolve, reject) => {
    // Skip compression for very small files
    if (file.size < options.sizeThreshold && file.type === targetMime) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate new dimensions while preserving aspect ratio
          if (width > effectiveMaxWidth || height > effectiveMaxHeight) {
            const ratio = Math.min(effectiveMaxWidth / width, effectiveMaxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // White background for JPEG
          if (targetMime === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          // Best quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL(targetMime, effectiveQuality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Estimate localStorage usage
 */
export function estimateStorageUsage(): { used: number; total: number; percentage: number } {
  let totalSize = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += key.length + value.length;
      }
    }
  }
  // Approximate: assume 5MB limit (varies by browser)
  const total = 5 * 1024 * 1024;
  const percentage = (totalSize / total) * 100;
  return { used: totalSize, total, percentage };
}

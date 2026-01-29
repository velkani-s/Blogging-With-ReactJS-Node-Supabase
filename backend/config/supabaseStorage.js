const { createClient } = require("@supabase/supabase-js");
const path = require("path");

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/**
 * Upload file to Supabase Storage
 * @param {Buffer} file - File buffer
 * @param {string} bucket - Bucket name ('blog-images', 'product-images')
 * @param {string} fileName - File name
 * @returns {Promise<{url: string, path: string}>}
 */
const uploadFile = async (file, bucket, fileName) => {
  try {
    // Generate unique file name with timestamp
    const timestamp = Date.now();
    const ext = path.extname(fileName);
    const name = path.basename(fileName, ext);
    const uniqueName = `${name}-${timestamp}${ext}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    throw new Error(`File upload error: ${error.message}`);
  }
};

/**
 * Delete file from Supabase Storage
 * @param {string} filePath - File path in storage
 * @param {string} bucket - Bucket name
 * @returns {Promise<boolean>}
 */
const deleteFile = async (filePath, bucket) => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    return true;
  } catch (error) {
    throw new Error(`File delete error: ${error.message}`);
  }
};

/**
 * Extract file path from public URL
 * @param {string} url - Public URL
 * @returns {string}
 */
const getFilePathFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // URL format: /storage/v1/object/public/bucket-name/file-path
    return pathParts.slice(5).join("/");
  } catch (error) {
    return "";
  }
};

/**
 * Get public URL from file path
 * @param {string} filePath - File path in storage
 * @param {string} bucket - Bucket name
 * @returns {string}
 */
const getPublicUrl = (filePath, bucket) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

module.exports = {
  supabase,
  uploadFile,
  deleteFile,
  getFilePathFromUrl,
  getPublicUrl,
};

import cloudinary from './cloudinary';

export function uploadImage(buffer: Buffer, folder = 'productos'): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Error subiendo imagen a Cloudinary'));
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

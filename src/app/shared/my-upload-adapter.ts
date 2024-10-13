export class MyUploadAdapter {
    loader: any;
    url: string;
    uploadedImageUrl: string | null = null;  // Store uploaded image URL
  
    constructor(loader: any, url: string) {
      this.loader = loader;
      this.url = url;  // This is the URL for image upload
    }
  
    // Starts the upload process.
    upload() {
      return this.loader.file
        .then((file: any) => {
          const formData = new FormData();
          formData.append('file', file);
  
          return fetch(this.url, {
            method: 'POST',
            body: formData,
          })
          .then(response => response.json())
          .then(data => {
            this.uploadedImageUrl = data.result.url;  // Save the uploaded image URL
            console.log('Upload successful:', data.result.url);
            
            return { default: data.result.url };      // Return the image URL to CKEditor
          })
          .catch(error => {
            console.error('Upload failed:', error);
            return Promise.reject(error);      // Ensure the error is returned
          });
        })
        .catch((error: any) => {
          console.error('Failed to get file:', error);
          return Promise.reject(error);        // Ensure the promise is rejected in case of error
        });
    }
  
    // Aborts the upload process.
    abort() {
      // Optionally, implement abort logic
    }
  }
  
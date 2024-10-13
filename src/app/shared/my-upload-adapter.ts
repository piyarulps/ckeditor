export class MyUploadAdapter {
    loader: any;
    url: string;
    uploadedImageUrl: string | null = null; 
  
    constructor(loader: any, url: string) {
      this.loader = loader;
      this.url = url;  
    }
  
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
            this.uploadedImageUrl = data.result.url;  
            console.log('Upload successful:', data.result.url);
            
            return { default: data.result.url };      
          })
          .catch(error => {
            console.error('Upload failed:', error);
            return Promise.reject(error);      
          });
        })
        .catch((error: any) => {
          console.error('Failed to get file:', error);
          return Promise.reject(error);        
        });
    }
  
    
    abort() {
      
    }
  }
  
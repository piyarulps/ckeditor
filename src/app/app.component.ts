import { Component } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MyUploadAdapter } from './shared/my-upload-adapter';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public Editor = ClassicEditor;
  public editorData = '<p>Insert your text or image here!</p>';
  private previousImageUrls: string[] = []; // Track previous image URLs
  private uploadAdapter: MyUploadAdapter | null = null;

  public editorConfig = {
    toolbar: [
      'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
      'insertImage', 'blockQuote', 'undo', 'redo'
    ],
    image: {
      resizeUnit: '%',
      toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side', '|', 'resizeImage:25', 'resizeImage:50', 'resizeImage:75', 'resizeImage:original'],
      styles: [
        'full', 'side'
      ],
      resizeOptions: [
        {
          name: 'resizeImage:original',
          value: null,
          label: 'Original'
        },
        {
          name: 'resizeImage:25',
          value: '25',
          label: '25%'
        },
        {
          name: 'resizeImage:50',
          value: '50',
          label: '50%'
        },
        {
          name: 'resizeImage:75',
          value: '75',
          label: '75%'
        }
      ]
    },
    extraPlugins: [ this.imageUploadPlugin.bind(this) ] // Ensure you configure the upload adapter for drag and drop
  };

  constructor(private httpClient: HttpClient) {}

  onReady(editor: any) {
    console.log('CKEditor is ready');

    // Set the upload adapter for image upload
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      this.uploadAdapter = new MyUploadAdapter(loader, 'https://kanyingstaging.azurewebsites.net/api/Upload/UploadFile');
      return this.uploadAdapter;
    };

    // Listen for content changes in the editor
    editor.model.document.on('change:data', () => {
      this.detectImageDeletions(editor);
    });
  }

  imageUploadPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new MyUploadAdapter(loader, 'https://kanyingstaging.azurewebsites.net/api/Upload/UploadFile');
    };
  }

  detectImageDeletions(editor: any) {
    const currentImageElements = Array.from(editor.model.document.getRoot().getChildren())
      .filter((child: any) => child.is('element', 'image'));

    const currentImageUrls = currentImageElements.map((image: any) => image.getAttribute('src'));

    // Compare the current image URLs with the previous image URLs
    const deletedImages = this.previousImageUrls.filter(url => !currentImageUrls.includes(url));

    if (deletedImages.length > 0) {
      // Call the delete API for each deleted image
      deletedImages.forEach(imageUrl => {
        this.onDeleteImage(imageUrl);
      });
    }

    // Update the previous image URLs with the current ones
    this.previousImageUrls = currentImageUrls;
  }

  deleteImage(imageUrl: string) {
    const apiUrl = 'https://kanyingstaging.azurewebsites.net/api/Upload/DeleteFile';

    // Prepare the request body
    const body = {
      fileUrl: imageUrl // Ensure the key matches what the API expects
    };

    console.log('Calling delete API for:', imageUrl); // Debug log

    this.httpClient.post(apiUrl, body).subscribe(
      (response) => {
        console.log('Image deleted successfully:', response);
      },
      (error) => {
        console.error('Error deleting image:', error);
      }
    );
  }

  onDeleteImage(imageUrl: string) {
    console.log('Executing onDeleteImage for:', imageUrl); // Debug log
    alert(`Image removed: ${imageUrl}`); // Alert when an image is removed
    this.deleteImage(imageUrl); // Call the deleteImage method
  }
}

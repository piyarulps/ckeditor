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
  private previousImageUrls: string[] = [];
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
    extraPlugins: [ this.imageUploadPlugin.bind(this) ] 
  };

  constructor(private httpClient: HttpClient) {}

  onReady(editor: any) {
    console.log('CKEditor is ready');

    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      this.uploadAdapter = new MyUploadAdapter(loader, 'https://kanyingstaging.azurewebsites.net/api/Upload/UploadFile');
      return this.uploadAdapter;
    };
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

    const deletedImages = this.previousImageUrls.filter(url => !currentImageUrls.includes(url));

    if (deletedImages.length > 0) {
      deletedImages.forEach(imageUrl => {
        this.onDeleteImage(imageUrl);
      });
    }

    this.previousImageUrls = currentImageUrls;
  }

  deleteImage(imageUrl: string) {
    const apiUrl = 'https://kanyingstaging.azurewebsites.net/api/Upload/DeleteFile';

    const body = {
      fileUrl: imageUrl 
    };

    console.log('Calling delete API for:', imageUrl); 
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
    console.log('Executing onDeleteImage for:', imageUrl);
    alert(`Image removed: ${imageUrl}`); 
    this.deleteImage(imageUrl); 
  }
}

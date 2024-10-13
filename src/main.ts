import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('Ngo9BigBOggjHTQxAR8/V1NDaF5cWGJCf1JpQHxbf1x0ZFFMYlpbR3ZPIiBoS35RckRjWXlfeHdcQ2JfVkJ3');


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
  
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),
      provideAnimationsAsync()
    ]
  }).catch(err => console.error(err));
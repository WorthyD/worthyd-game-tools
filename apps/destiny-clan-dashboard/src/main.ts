import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { appProviders } from './app/app.providers';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {...appProviders, providers: [provideZoneChangeDetection(), ...appProviders.providers]}).catch((err) => console.error(err));

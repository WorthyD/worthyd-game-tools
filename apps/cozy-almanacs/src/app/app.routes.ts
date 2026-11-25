import { Route } from '@angular/router';
import { LandingPageComponent } from '@cozy-almanacs/landing';
import { shellRoutes } from '@cozy-almanacs/shell';

/**
 * The root is the Cozy Almanacs landing page, outside the app shell. It's the front door, so it's loaded eagerly.
 * Everything else is the shared shell, which the development build fills with Stardew data for debugging.
 */
export const appRoutes: Route[] = [{ path: '', pathMatch: 'full', component: LandingPageComponent }, ...shellRoutes];

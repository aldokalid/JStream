import { InjectionToken } from "@angular/core";

/** Token para el objecto window. */
export const WINDOW = new InjectionToken<Window>('Window', {
  providedIn: 'root',
  factory: () => window
});
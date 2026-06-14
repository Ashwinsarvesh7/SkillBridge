import { Provider, provideZoneChangeDetection } from '@angular/core';

const testProviders: Provider[] = [provideZoneChangeDetection()];

export default testProviders;

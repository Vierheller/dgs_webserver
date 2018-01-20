import { TestBed, inject } from '@angular/core/testing';

import { CesiumProviderService } from './cesium-provider.service';

describe('CesiumProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CesiumProviderService]
    });
  });

  it('should be created', inject([CesiumProviderService], (service: CesiumProviderService) => {
    expect(service).toBeTruthy();
  }));
});

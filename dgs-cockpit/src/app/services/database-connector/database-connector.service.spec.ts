import { TestBed, inject } from '@angular/core/testing';

import { DatabaseConnectorService } from './database-connector.service';

describe('DatabaseConnectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatabaseConnectorService]
    });
  });

  it('should be created', inject([DatabaseConnectorService], (service: DatabaseConnectorService) => {
    expect(service).toBeTruthy();
  }));
});

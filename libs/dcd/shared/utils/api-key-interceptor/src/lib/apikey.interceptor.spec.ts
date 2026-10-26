import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';

import { ApiKeyInterceptor } from './apikey.interceptor';

import { AppConfigService } from '@dcd/shared/utils/app-config';
describe('ApiKeyInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withXhr(), withInterceptors([ApiKeyInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AppConfigService,
          useValue: {
            config: {
              apiKey: '1234'
            }
          }
        }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should inject api key on all requests', () => {
    //arrange
    const url = '/mockendpoint';

    //act
    httpClient.get(url).subscribe();

    const req = httpTestingController.expectOne(url);
    expect(req.request.headers.get('x-api-key')).toEqual('1234');
  });
});

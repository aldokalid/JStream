import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaComponent } from './media.component';
import { APIService } from '@core/services/api.service';
import { getTestMedia, setupHttpClientTestBed } from 'src/test-setup';
import { map } from 'rxjs';

describe('MediaComponent', () => {
  let component: MediaComponent;
  let fixture: ComponentFixture<MediaComponent>;
  let mockAPIService: jasmine.SpyObj<APIService>;

  beforeEach(async () => {
    setupHttpClientTestBed();

    TestBed.overrideComponent(MediaComponent, {
      set: { inputs: ['id'] }
    });

    mockAPIService = jasmine.createSpyObj(APIService, ["getMedia$"]);

    await TestBed.configureTestingModule({
      imports: [MediaComponent],
      providers: [
        { provide: APIService, useValue: mockAPIService }
      ]
    }).compileComponents();

    mockAPIService
      .getMedia$
      .and
      .callFake((id: number) => {
        return getTestMedia((mS) => mS.filter(m => m.getId() === id)).pipe(
          map(medias => medias[0])
        );
      });

    fixture = TestBed.createComponent(MediaComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a defined media', () => {
    Object.defineProperty(component, 'id', { value: '1' });
    component.ngOnInit();

    expect(component.getMedia()?.getId()).toBeGreaterThan(0);
  })
});

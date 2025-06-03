import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { By } from '@angular/platform-browser';
import { getTestMedia, setupHttpClientTestBed } from 'src/test-setup';
import { APIService } from '@core/services/api.service';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockAPIService: jasmine.SpyObj<APIService>;

  beforeEach(async () => {
    setupHttpClientTestBed(); // Configura HTTPClient de pruebas.

    // Crea un Mock de APIService
    mockAPIService = jasmine.createSpyObj(APIService, ['findMediaByTitle$']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [{ provide: APIService, useValue: mockAPIService }]
    }).compileComponents();

    mockAPIService
      .findMediaByTitle$
      .and
      .callFake((search: string) => {
        const lS = search.toLowerCase();

        return getTestMedia(mArr => mArr.filter(m => m.getTitle().toLowerCase().includes(lS)));
      });


    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSearchBtnClick on search button click when search bar is empty', () => {
    spyOn(component, 'onSearchBtnClick').and.callThrough();

    // Esto obtiene solo el div que contiene el botón real (<app-button />).
    const btnDebugElement = fixture.debugElement.query(By.css('#new-search-btn'));
    // Este sí obtiene el botón.
    const btn = (btnDebugElement.nativeElement as Element).querySelector('button');

    btn?.click();

    expect(component.onSearchBtnClick).toHaveBeenCalled();
  });

  it('should get BEASTARS serie on search.', () => {
    component.onSearchInputbarChange('BEAST');

    fixture.detectChanges();

    // Esto obtiene solo el div que contiene el botón real (<app-button />).
    const btnDebugElement = fixture.debugElement.query(By.css('#new-search-btn'));
    // Este sí obtiene el botón.
    const btn = (btnDebugElement.nativeElement as Element).querySelector('button');

    btn?.click();

    fixture.detectChanges();

    expect(component.getMediaItems()?.length).toBe(1);
    expect(component.getMediaItems()?.at(0)?.getTitle()).toEqual('BEASTARS');
  });

  it('should call onSearchItemsContainerClick click', () => {
    spyOn(component, 'onSearchItemsContainerClick').and.callThrough();

    // Adding content to inputbar.
    component.onSearchInputbarChange('BEAST');
    // Making a search.
    (fixture.debugElement.query(By.css('#new-search-btn')).nativeElement as HTMLElement).click();

    // Click in a element.
    (component.itemsContainer.nativeElement.firstChild as HTMLElement)?.click();

    expect(component.onSearchItemsContainerClick).toHaveBeenCalled();
  });
});

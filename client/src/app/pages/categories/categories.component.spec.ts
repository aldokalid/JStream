import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpTestingController } from '@angular/common/http/testing';
import { CategoriesComponent } from './categories.component';
import { By } from '@angular/platform-browser';
import { getTestMedia, setupHttpClientTestBed } from 'src/test-setup';
import { APIService } from '@core/services/api.service';
import Media from 'src/app/models/media.model';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let mockAPIService: jasmine.SpyObj<APIService>;

  beforeEach(async () => {
    setupHttpClientTestBed();

    mockAPIService = jasmine.createSpyObj(APIService, ['findMediaByGenre$'])

    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
      providers: [
        { provide: APIService, useValue: mockAPIService }
      ]
    }).compileComponents();

    mockAPIService
      .findMediaByGenre$
      .and
      .callFake((genre: number) => {
        if (genre === 0)
          return getTestMedia();

        return getTestMedia(mS => mS.filter(m => m.getGenre() === Media.parseGenreToString(genre)))
      })

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get catalogue array', () => {
    expect(component.getCatalogue()?.length).toBeGreaterThan(0);
  });

  it('should push show categories button', () => {
    spyOn(component, 'onCategoriesBtnClick').and.callThrough();

    // Esto obtiene solo el div que contiene el botón real (<app-button />).
    const btnDebugElement = fixture.debugElement.query(By.css('#categories-btn'));
    // Este sí obtiene el botón.
    const btn = (btnDebugElement.nativeElement as Element).querySelector('button');

    btn?.click();

    expect(component.onCategoriesBtnClick).toHaveBeenCalled()
  });

  it('should detect categories container click', () => {
    // Detect container click.
    spyOn(component, 'onCategoriesContainerClick').and.callThrough();

    component.categoriesButtonsContainer.nativeElement.click();
    expect(component.onCategoriesContainerClick).toHaveBeenCalled();

    // Detect button child.
    (component.categoriesButtonsContainer.nativeElement.children[0] as HTMLElement).click();
    expect(component.onCategoriesContainerClick).toHaveBeenCalled();
  });

  it('should detect options container click', () => {
    // Detect card item click.
    spyOn(component, 'onOptionsContainerClick').and.callThrough();

    // Click container.
    component.optionsContainer.nativeElement.click();
    // Click option in container.
    (component.optionsContainer.nativeElement.children[0] as HTMLElement).click();

    expect(component.onOptionsContainerClick).toHaveBeenCalled();
  });

  it('should change and return selected category', () => {
    // Action category.
    component.setCurrentCategory('action');
    expect(component.getCurrentCategory()).toBe('Acción');
    // Comedy category.
    component.setCurrentCategory('comedy');
    expect(component.getCurrentCategory()).toBe('Comedia');
    // Crime category.
    component.setCurrentCategory('crime');
    expect(component.getCurrentCategory()).toBe('Crimen');
    // Drama category.
    component.setCurrentCategory('drama');
    expect(component.getCurrentCategory()).toBe('Drama');
    // Sci-fi category.
    component.setCurrentCategory('sci_fi');
    expect(component.getCurrentCategory()).toBe('Ciencia ficción');
  });

  it('should call onCategoriesContainerAnimationEnd', () => {
    spyOn(component, 'onCategoriesContainerAnimationEnd').and.callThrough();

    const auxEl = fixture
      .debugElement
      .query(By.css('#categories-container'))
      .nativeElement as HTMLDivElement;

    auxEl.dispatchEvent(new Event('animationend', { bubbles: true, cancelable: true }));

    expect(component.onCategoriesContainerAnimationEnd).toHaveBeenCalled();
  })
});

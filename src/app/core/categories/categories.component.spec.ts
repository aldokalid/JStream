import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpTestingController } from '@angular/common/http/testing';
import { CategoriesComponent } from './categories.component';
import { By } from '@angular/platform-browser';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesComponent],
    }).compileComponents();

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

    const auxBtn: HTMLButtonElement = fixture.debugElement.query(By.css('#categories-btn')).nativeElement;
    auxBtn.click();

    expect(component.onCategoriesBtnClick).toHaveBeenCalled()
  });

  it('should detect categories container click', () => {
    // Detect container click.
    spyOn(component, 'onCategoriesContainerClick').and.callThrough();

    component.categoriesContainer.nativeElement.click();
    expect(component.onCategoriesContainerClick).toHaveBeenCalled();

    // Detect button child.
    (component.categoriesContainer.nativeElement.children[0] as HTMLElement).click();
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

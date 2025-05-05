import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { By } from '@angular/platform-browser';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSearchBtnClick on search button click when search bar is empty', () => {
    spyOn(component, 'onSearchBtnClick').and.callThrough();

    (fixture.debugElement.query(By.css('#new-search-btn')).nativeElement as HTMLElement).click();

    expect(component.onSearchBtnClick).toHaveBeenCalled();
  });

  it('should get BEASTARS serie on search.', () => {
    component.searchInput.nativeElement.value = 'BEAST';

    (fixture.debugElement.query(By.css('#new-search-btn')).nativeElement as HTMLElement).click();

    expect(component.getMediaItems()?.length).toBe(1);
    expect(component.getMediaItems()?.at(0)?.getTitle()).toEqual('BEASTARS');
  });

  it('should call onSearchItemsContainerClick click', () => {
    spyOn(component, 'onSearchItemsContainerClick').and.callThrough();
    
    // Adding content to inputbar.
    component.searchInput.nativeElement.value = 'BEAST';
    // Making a search.
    (fixture.debugElement.query(By.css('#new-search-btn')).nativeElement as HTMLElement).click();

    // Click in a element.
    (component.itemsContainer.nativeElement.firstChild as HTMLElement)?.click();

    expect(component.onSearchItemsContainerClick).toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaComponent } from './media.component';
import Media from 'src/app/models/media.model';

describe('MediaComponent', () => {
  let component: MediaComponent;
  let fixture: ComponentFixture<MediaComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(MediaComponent, {
      set: { inputs: ['id'] }
    });

    await TestBed.configureTestingModule({
      imports: [MediaComponent]
    })
      .compileComponents();

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

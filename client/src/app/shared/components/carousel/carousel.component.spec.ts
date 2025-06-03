import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';
import * as data from '../../../data/movies.spec.json';
import Media from 'src/app/models/media.model';
import { By } from '@angular/platform-browser';
import { getTestMedia } from 'src/test-setup';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;
  let medias!: Media[];

  // Obtiene el catálogo.
  getTestMedia().subscribe({ next: data => medias = data });

  afterEach(() => component.medias = []);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    component.medias = medias;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect page on clicking a carousel item', () => {
    spyOn(component, 'onCarouselItemClick').and.callThrough();

    // Hace clic en el botón del carrusel.
    (fixture.debugElement.query(By.css('div button'))?.nativeElement as HTMLButtonElement).click();

    expect(component.onCarouselItemClick).toHaveBeenCalled();
  });

  it('should change to next tendency after 9 seconds', () => {
    jasmine.clock().install();
    spyOn(component, 'onNextMediaAnimationEnd').and.callThrough();

    component.medias = [...medias];

    // Crea el evento para inyectarlo a la siguiente tarjeta.
    const event = new Event('animationend', { bubbles: true, cancelable: true });
    const currentMedia = component.getCurrentMedia();

    jasmine.clock().tick(7100); // Hasta que la siguiente tarjeta aparezca.
    fixture.detectChanges();

    // Obtiene la siguiente tarjeta.
    const nextElem = fixture.debugElement.query(By.css('#car-next')).nativeElement as HTMLDivElement;
    // Lanza el evento.
    nextElem?.dispatchEvent(event);

    expect(component.onNextMediaAnimationEnd).toHaveBeenCalled();
    expect(currentMedia === component.getCurrentMedia()).toBeFalsy();
    jasmine.clock().uninstall();
  });
});

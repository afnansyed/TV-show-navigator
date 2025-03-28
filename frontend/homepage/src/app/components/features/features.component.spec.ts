
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { FeaturesComponent } from './features.component';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';



@Component({
  template: '<div>Shows Page</div>',
  standalone: true
})
class GetStartedPage {}

describe('features component unit test', () => {
  let component: FeaturesComponent;
  let fixture: ComponentFixture<FeaturesComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'shows', component: GetStartedPage }
        ]),
        FeaturesComponent,
        GetStartedPage,
        NoopAnimationsModule,
        ...MATERIAL_IMPORTS
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(FeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Displays the correct paragraph text under heading', () => {
    const paragraphElement = fixture.debugElement.query(By.css('.page-head p'));
    expect(paragraphElement).toBeTruthy();
    expect(paragraphElement.nativeElement.textContent).toBe(
      ' Discover your next favorite show, add it to your watchlist, and share your thoughts with others. Let us guide your TV journey!'
    );
  });

  it('Displays the Your TV Shows Navigator logo ', () => {
    const logoElement = fixture.debugElement.query(By.css('.hero-container h1'));
    expect(logoElement).toBeTruthy();
    expect(logoElement.nativeElement.textContent).toContain('Your TV Shows Navigator');
  });
 
  it('Has a language selector to choose from options: English or Spanish', () => {
    const languageSelect = fixture.debugElement.query(By.css('mat-form-field mat-select'));
    expect(languageSelect).toBeTruthy();

    const languageLabel = fixture.debugElement.query(By.css('mat-label'));
    expect(languageLabel.nativeElement.textContent).toContain('Language');

    const options = fixture.debugElement.queryAll(By.css('mat-option'));
  });

  it('Scrolling through the reviews', () => {

    const reviewsContainer = fixture.debugElement.query(By.css('.reviews-scrollable')).nativeElement;
    const initialScrollPosition = reviewsContainer.scrollTop;

    //scroll down
    reviewsContainer.scrollTop = 100; 
    reviewsContainer.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(reviewsContainer.scrollTop).toBeGreaterThan(initialScrollPosition);
  
    //scroll up
    reviewsContainer.scrollTop = 0; 
    reviewsContainer.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();
    expect(reviewsContainer.scrollTop).toBe(0);
  });
  

  it('Displays the images of the TV Show posters', () => {

    const imageElements = fixture.debugElement.queryAll(By.css('.popular-shows-section .images img'));
    expect(imageElements.length).toBeGreaterThan(0, 'No images found');
  
    imageElements.forEach(img => {
      const imgElement = img.nativeElement;

      expect(imgElement.src).not.toBeNull();
      expect(imgElement.src).toMatch(/\/su\.jpg|\/p\.jpg|\/true\.jpg|\/cher\.jpg/, 'Incorrect image');
  
      expect(imgElement.complete).toBeTrue();
  
    });
  });
  
  
  
  
});




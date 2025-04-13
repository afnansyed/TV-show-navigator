/*

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HeroComponent } from './hero.component';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';



@Component({
  template: '<div>Shows Page</div>',
  standalone: true
})
class GetStartedPage {}

describe('hero component unit test', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'shows', component: GetStartedPage }
        ]),
        HeroComponent,
        GetStartedPage,
        NoopAnimationsModule,
        ...MATERIAL_IMPORTS
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Displays the correct paragraph text', () => {
    const paragraphElement = fixture.debugElement.query(By.css('.hero-container p'));
    expect(paragraphElement).toBeTruthy();
    expect(paragraphElement.nativeElement.textContent).toBe(
      'Get personal recommendations tailored to you. We\’ll show you where to watch your favorite shows.'
    );
  });
 

  it('Has a Get Started button that has shows page router link', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[mat-raised-button]'));
    
    const getStartedButton = buttons.find(button => 
      button.nativeElement.textContent.includes('Get Started'));
    expect(getStartedButton).toBeTruthy();
    expect(getStartedButton?.attributes['routerLink']).toBe('shows');
    
  });



  it('Routes to the Shows page when the Get Started button is clicked', async () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[mat-raised-button]'));
    const getStartedButton = buttons.find(button => 
      button.nativeElement.textContent.includes('Get Started'));
    
      getStartedButton?.nativeElement.click();
    await fixture.whenStable();
    
    expect(location.path()).toBe('/shows');
  });
});

*/
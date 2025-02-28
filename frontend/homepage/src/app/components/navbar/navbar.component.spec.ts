import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from './navbar.component';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  template: '<div>Sign Up Page</div>',
  standalone: true
})
class SignUpPage {}

@Component({
  template: '<div>Sign In Page</div>',
  standalone: true
})
class SignInPage {}

describe('navbar component unit test', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sign-up', component: SignUpPage },
          { path: 'sign-in', component: SignInPage }
        ]),
        NavbarComponent,
        SignUpPage,
        SignInPage,
        NoopAnimationsModule,
        ...MATERIAL_IMPORTS
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Displays the Your Navigator for TV Shows logo ', () => {
    const logoElement = fixture.debugElement.query(By.css('.logo'));
    expect(logoElement).toBeTruthy();
    expect(logoElement.nativeElement.textContent).toContain('Your Navigator for TV Shows');
  });

  it('Has a search bar', () => {
    const searchBar = fixture.debugElement.query(By.css('input[type="search"]'));
    expect(searchBar).toBeTruthy();
  });

  it('Has a language selector to choose from options: English or Spanish', () => {
    const languageSelect = fixture.debugElement.query(By.css('mat-form-field mat-select'));
    expect(languageSelect).toBeTruthy();

    const languageLabel = fixture.debugElement.query(By.css('mat-label'));
    expect(languageLabel.nativeElement.textContent).toContain('Language');

    const options = fixture.debugElement.queryAll(By.css('mat-option'));
  });

  it('Has a Sign Up button that has sign-up page router link', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[mat-raised-button]'));
    
    const signUpButton = buttons.find(button => 
      button.nativeElement.textContent.includes('Sign Up'));
    expect(signUpButton).toBeTruthy();
    expect(signUpButton?.attributes['routerLink']).toBe('/sign-up');
  });

  it('Routes to sign-up page when Sign Up button is clicked', async () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[mat-raised-button]'));
    const signUpButton = buttons.find(button => 
      button.nativeElement.textContent.includes('Sign Up'));
    
    signUpButton?.nativeElement.click();
    await fixture.whenStable();
    
    expect(location.path()).toBe('/sign-up');
  });

  it('Has a Sign In button that has sign-in page router link', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[mat-raised-button]'));
    
    const signInButton = buttons.find(button => 
      button.nativeElement.textContent.includes('Sign In'));
    expect(signInButton).toBeTruthy();
    expect(signInButton?.attributes['routerLink']).toBe('/sign-in');
  });

  it('Routes to sign-in page when Sign In button is clicked', async () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[mat-raised-button]'));
    const signInButton = buttons.find(button => 
      button.nativeElement.textContent.includes('Sign In'));
    
    signInButton?.nativeElement.click();
    await fixture.whenStable();
    
    expect(location.path()).toBe('/sign-in');
  });

 
});
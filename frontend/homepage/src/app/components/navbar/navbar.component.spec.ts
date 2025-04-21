import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from './navbar.component';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

@Component({
  template: '<div>TV Shows Page</div>',
  standalone: true
})
class ShowsPage {}

@Component({
  template: '<div>Watchlist Page</div>',
  standalone: true
})
class WatchlistPage {}

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
          { path: 'sign-in', component: SignInPage },
          { path: 'shows', component: ShowsPage },
          { path: 'watchlist', component: WatchlistPage }
        ]),
        HttpClientTestingModule,
        NavbarComponent,
        SignUpPage,
        SignInPage,
        ShowsPage,
        WatchlistPage,
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

  /*
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

  */

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


  it('Has a Home button', () => {
    const wButton = fixture.debugElement.query(By.css('button[aria-label="Home"]'));
    expect(wButton).toBeTruthy();
  });

  it('Has a Search button', () => {
    const wButton = fixture.debugElement.query(By.css('button[aria-label="Search"]'));
    expect(wButton).toBeTruthy();
  });

  it('Has a TV Shows button', () => {
    const wButton = fixture.debugElement.query(By.css('button[aria-label="Shows"]'));
    expect(wButton).toBeTruthy();
  });

  it('Routes to TV Shows page when Shows button is clicked', async () => {

    const showsButton = fixture.debugElement.query(By.css('button[aria-label="Shows"]'));
    showsButton.nativeElement.click();
    
    await fixture.whenStable();
  
    expect(location.path()).toBe('/shows');
  });

  it('Has a Watchlist button', () => {
    const wButton = fixture.debugElement.query(By.css('button[aria-label="Watchlist"]'));
    expect(wButton).toBeTruthy();
  });
  
  it('Routes to Watchlist page when Watchlist button is clicked', async () => {

    const wButton = fixture.debugElement.query(By.css('button[aria-label="Watchlist"]'));
    wButton.nativeElement.click();
    
    await fixture.whenStable();
  
    expect(location.path()).toBe('/watchlist');
  });
  

 
  it('Shows labels next to their respective icons when the navigation bar expands', () => {
    const navbarElement = fixture.debugElement.query(By.css('mat-toolbar'));
    
    navbarElement.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();
    
    const homeLabel = fixture.debugElement.query(By.css('button[aria-label="Home"] .label')).nativeElement;
    const searchLabel = fixture.debugElement.query(By.css('button[aria-label="Search"] .label')).nativeElement;
    const showsLabel = fixture.debugElement.query(By.css('button[aria-label="Shows"] .label')).nativeElement;
    const watchLabel = fixture.debugElement.query(By.css('button[aria-label="Watchlist"] .label')).nativeElement;

    expect(homeLabel.textContent).toContain('Home');
    expect(searchLabel.textContent).toContain('Search');
    expect(showsLabel.textContent).toContain('Shows');
    expect(watchLabel.textContent).toContain('Watchlist');
  });
  

 
});
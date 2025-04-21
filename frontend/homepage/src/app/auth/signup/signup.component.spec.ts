
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { SignupComponent } from './signup.component';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';


@Component({
    template: '<div>Sign In Page</div>',
    standalone: true
  })
  class SignInPage {}

describe('Sign up component unit test', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
            { path: 'sign-in', component: SignInPage }
        ]),
        HttpClientTestingModule,
        SignupComponent,
        SignInPage,
        NoopAnimationsModule,
        ...MATERIAL_IMPORTS
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Displays the correct prompt to sign in, if user already has an account.', () => {
    const paragraphElement = fixture.debugElement.query(By.css('.sign-in-prompt'));
    expect(paragraphElement).toBeTruthy();
    expect(paragraphElement.nativeElement.textContent).toBe(
      ' Already have an account? Sign in now! '
    );
  });

  it('Displays the Your TV Shows Navigator logo ', () => {
    const logoElement = fixture.debugElement.query(By.css('.logo'));
    expect(logoElement).toBeTruthy();
    expect(logoElement.nativeElement.textContent).toContain('Your TV Shows Navigator');
  });


  it('Navigates to sign-in page when "Sign in" link is clicked', async () => {
    const signin = fixture.debugElement.query(By.css('.sign-in-prompt a'));
    expect(signin).toBeTruthy(); 
  
    signin.nativeElement.click();
    fixture.detectChanges();
  
    await fixture.whenStable();
  
    expect(location.path()).toBe('/sign-in');
  });
  
  
});


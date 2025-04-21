
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { SignInComponent } from './sign-in.component';
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

describe('Sign in component unit test', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
            { path: 'sign-up', component: SignUpPage }
        ]),
        HttpClientTestingModule,
        SignInComponent,
        SignUpPage,
        NoopAnimationsModule,
        ...MATERIAL_IMPORTS
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Displays the correct prompt to sign up, if user does not have an account.', () => {
    const paragraphElement = fixture.debugElement.query(By.css('.sign-up-prompt'));
    expect(paragraphElement).toBeTruthy();
    expect(paragraphElement.nativeElement.textContent).toBe(
      ' Don\'t have an account? Sign up now! '
    );
  });

  it('Displays the Your TV Shows Navigator logo ', () => {
    const logoElement = fixture.debugElement.query(By.css('.logo'));
    expect(logoElement).toBeTruthy();
    expect(logoElement.nativeElement.textContent).toContain('Your TV Shows Navigator');
  });


  it('Navigates to sign-up page when "Sign up" link is clicked', async () => {
    const signin = fixture.debugElement.query(By.css('.sign-up-prompt a'));
    expect(signin).toBeTruthy(); 
  
    signin.nativeElement.click();
    fixture.detectChanges();
  
    await fixture.whenStable();
  
    expect(location.path()).toBe('/sign-up');
  });
  
  
});


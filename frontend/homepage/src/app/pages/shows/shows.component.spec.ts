import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ShowsComponent } from './shows.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';


describe('ShowsComponent', () => {
  let component: ShowsComponent;
  let fixture: ComponentFixture<ShowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowsComponent],
      providers: [provideNoopAnimations(),
        // Provide the regular HttpClient
        provideHttpClient(),
        // Override it with the testing backend
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

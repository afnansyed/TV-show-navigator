import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowListComponent } from './show-list.component';


describe('ShowListComponent', () => {
  let component: ShowListComponent;
  let fixture: ComponentFixture<ShowListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

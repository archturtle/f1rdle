import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumPageComponent } from './medium-page.component';

describe('MediumPageComponent', () => {
  let component: MediumPageComponent;
  let fixture: ComponentFixture<MediumPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediumPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediumPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

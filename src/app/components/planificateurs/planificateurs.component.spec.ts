import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificateursComponent } from './planificateurs.component';

describe('PlanificateursComponent', () => {
  let component: PlanificateursComponent;
  let fixture: ComponentFixture<PlanificateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificateursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

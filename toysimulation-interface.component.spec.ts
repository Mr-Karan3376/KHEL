import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToysimulationInterfaceComponent } from './toysimulation-interface.component';

describe('ToysimulationInterfaceComponent', () => {
  let component: ToysimulationInterfaceComponent;
  let fixture: ComponentFixture<ToysimulationInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToysimulationInterfaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToysimulationInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

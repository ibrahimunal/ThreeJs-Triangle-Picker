import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimitiveControlComponent } from './primitive-control.component';

describe('PrimitiveControlComponent', () => {
  let component: PrimitiveControlComponent;
  let fixture: ComponentFixture<PrimitiveControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimitiveControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimitiveControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

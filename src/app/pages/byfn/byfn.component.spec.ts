import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BYFNComponent } from './byfn.component';

describe('BYFNComponent', () => {
  let component: BYFNComponent;
  let fixture: ComponentFixture<BYFNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BYFNComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BYFNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalxComponent } from './modalx.component';

describe('ModalxComponent', () => {
  let component: ModalxComponent;
  let fixture: ComponentFixture<ModalxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

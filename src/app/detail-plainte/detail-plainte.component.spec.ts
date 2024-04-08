import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPlainteComponent } from './detail-plainte.component';

describe('DetailPlainteComponent', () => {
  let component: DetailPlainteComponent;
  let fixture: ComponentFixture<DetailPlainteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPlainteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPlainteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

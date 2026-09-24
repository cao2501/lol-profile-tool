import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrailleartComponent } from './brailleart.component';

describe('BrailleartComponent', () => {
  let component: BrailleartComponent;
  let fixture: ComponentFixture<BrailleartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrailleartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrailleartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

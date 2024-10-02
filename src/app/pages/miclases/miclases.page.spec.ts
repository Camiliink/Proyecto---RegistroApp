import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiclasesPage } from './miclases.page';

describe('MiclasesPage', () => {
  let component: MiclasesPage;
  let fixture: ComponentFixture<MiclasesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MiclasesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectDialog } from './update-project-dialog';

describe('UpdateProjectDialog', () => {
  let component: UpdateProjectDialog;
  let fixture: ComponentFixture<UpdateProjectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProjectDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProjectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

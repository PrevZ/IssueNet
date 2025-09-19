import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProjectDialog } from './delete-project-dialog';

describe('DeleteProjectDialog', () => {
  let component: DeleteProjectDialog;
  let fixture: ComponentFixture<DeleteProjectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteProjectDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteProjectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

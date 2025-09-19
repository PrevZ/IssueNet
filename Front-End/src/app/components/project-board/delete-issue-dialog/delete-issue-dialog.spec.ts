import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIssueDialog } from './delete-issue-dialog';

describe('DeleteIssueDialog', () => {
  let component: DeleteIssueDialog;
  let fixture: ComponentFixture<DeleteIssueDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteIssueDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteIssueDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

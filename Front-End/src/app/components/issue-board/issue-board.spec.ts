import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueBoard } from './issue-board';

describe('IssueBoard', () => {
  let component: IssueBoard;
  let fixture: ComponentFixture<IssueBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

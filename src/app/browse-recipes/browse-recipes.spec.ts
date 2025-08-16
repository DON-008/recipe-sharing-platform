import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseRecipes } from './browse-recipes';

describe('BrowseRecipes', () => {
  let component: BrowseRecipes;
  let fixture: ComponentFixture<BrowseRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseRecipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseRecipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

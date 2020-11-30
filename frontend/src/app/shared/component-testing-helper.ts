import {ComponentFixture} from '@angular/core/testing';

export class ComponentTestingHelper<T> {

  private fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  public query(query: string) {
    return this.fixture.debugElement.nativeElement.querySelector(query);
  }

  public fillInputAndDispatchInputEvent(name: string, value: string) {
    const field = this.query('input[name="' + name + '"]');
    field.value = value;
    field.dispatchEvent(new Event('input'));
  }

}

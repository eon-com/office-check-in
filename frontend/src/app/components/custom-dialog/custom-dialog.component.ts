import {
  Component,
  ComponentFactoryResolver,
  Directive,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogButton {
  type?: 'raised' | 'close';
  text?: string;
  click?: () => void;
}

export interface DialogData {
  title: string;
  message: string;
  icon?: string;
  content?: { element: Type<any>, data: any };
  buttons?: DialogButton[];
  type: DialogType;
}

export enum DialogType {
  SUCCESS, ERROR, INFO
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[additional-content]',
})
export class CustomDialogContentDirective {
  @Input()
  public data: any;

  constructor(
    public viewContainerRef: ViewContainerRef) {
  }
}

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomDialogComponent implements OnInit {
  @HostBinding('aria-live') ariaLive = 'assertive';

  public dialogType = DialogType;

  @ViewChild(CustomDialogContentDirective, {static: true}) additionalContent: CustomDialogContentDirective;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngOnInit(): void {
    if (this.data.content) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.data.content.element);

      const viewContainerRef = this.additionalContent.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent(componentFactory);
      (componentRef.instance as CustomDialogContentDirective).data = this.data.content.data;
    }
  }

  public onButtonClick(button: DialogButton): void {
    if (button.click) {
      button.click();
    }
  }
}

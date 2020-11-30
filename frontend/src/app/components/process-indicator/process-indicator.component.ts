import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ProcessHelperService, ProcessState, RunningProcessState} from 'process-helper';

const defaultIcons = {
  idle: 'bell-sleep',
  loading: 'timer-sand',
  success: 'check',
  error: 'emoticon-dead-outline',
  not_authorized: 'cancel',
  not_found: 'file-hidden'
};

const defaultMessages = {
  idle: '',
  loading: 'COMMON.LOADING',
  success: null,
  error: 'COMMON.DATA_LOAD_ERROR',
  not_authorized: 'COMMON.NOT_AUTHORIZED',
  not_found: 'COMMON.NOT_FOUND'
};

@Component({
  selector: 'app-process-indicator',
  templateUrl: './process-indicator.component.html',
  styleUrls: ['./process-indicator.component.scss']
})
export class ProcessIndicatorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public name: string;
  @Input() public messages: { [key: string]: string };
  @Input() public icons: { [key: string]: string };
  @Input() public showSuccess: boolean;

  public processAvailable: boolean;
  public state: ProcessState;
  public msg: { [key: string]: string };
  public ico: { [key: string]: string };

  private sub: Subscription;
  private unsubscribe$: Subject<void>;

  constructor(
    private processHelperService: ProcessHelperService
  ) {
    this.unsubscribe$ = new Subject<void>();
    this.ico = defaultIcons;
    this.msg = defaultMessages;
  }

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('name')) {
      const nameChange: SimpleChange = changes.name;
      const currentName = nameChange.currentValue;
      if (currentName !== nameChange.previousValue) {
        this.sub?.unsubscribe();
        if (currentName) {
          this.sub = this.processHelperService.running$
            .pipe(
              takeUntil(this.unsubscribe$)
            ).subscribe(
              next => this.onProcessStateChange(next)
            );
        }
      }
    }
    if (changes.hasOwnProperty('messages')) {
      this.msg = {
        ...defaultMessages,
        ...changes.messages.currentValue ?? {}
      };
    }
    if (changes.hasOwnProperty('icons')) {
      this.ico = {
        ...defaultIcons,
        ...changes.icons.currentValue ?? {}
      };
    }
  }

  public ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private onProcessStateChange(processState: RunningProcessState): void {
    if (this.name && processState.hasOwnProperty(this.name)) {
      this.processAvailable = true;
      this.state = processState[this.name];
    }
  }
}

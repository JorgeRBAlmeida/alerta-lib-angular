import { Directive, EventEmitter, HostListener, Output, OnDestroy } from '@angular/core';
import { Subject, Observable, interval } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Directive({
  selector: '[holdable]'
})
export class HoldableDirective implements OnDestroy {

  @Output() holdTime: EventEmitter<number> = new EventEmitter;

  state: Subject<string> = new Subject();
  cancel: Observable<string>;

  constructor() {
    this.cancel = this.state.pipe(
      filter(v => v === 'cancelado'),
      tap(v => {
        console.log('parou de segurar');
        this.holdTime.emit(0);
      })
    )
  }

  ngOnDestroy() {
    this.holdTime.emit(0);
  }

  @HostListener('mouseup', [])
  @HostListener('mouseleave', [])
  onExit() {
    this.state.next('cancelado');
  }

  @HostListener('mousedown', [])
  onHold() {
    console.log('segurando botão');

    this.state.next('começou');

    const n = 100;

    interval(n).pipe(
      takeUntil(this.cancel),
      tap(v => {
        this.holdTime.emit(v * n)
      })
    )
    .subscribe();
  }
}

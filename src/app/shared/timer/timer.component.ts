import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, OnDestroy {
  @Output() messageEvent = new EventEmitter<string>();
  constructor() {}

  timeLeft: number = 10 * 60; // 20 minutes in seconds
  minutes: number = 10;
  seconds: number = 0;
  private timerSubscription!: Subscription;

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.minutes = Math.floor(this.timeLeft / 60);
        this.seconds = this.timeLeft % 60;
      } else {
        this.messageEvent.emit('0');
        this.timerSubscription.unsubscribe(); // Stop the timer at 0
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}

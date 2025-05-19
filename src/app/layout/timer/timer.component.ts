import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
    @Input() tokenRemainingTime: number = 300; // Default 5 minutes (300 seconds)
    @Input() isTokenExpired: boolean = false;
    @Output() timeExpired = new EventEmitter<void>();

    minutes: string = '00';
    seconds: string = '00';

    timePercentage: number = 100;
    private timerSubscription?: Subscription;

    constructor() { }

    ngOnInit(): void {
        this.updateDisplay(this.tokenRemainingTime);
        this.startTimer();
    }

    private startTimer(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }

        this.timerSubscription = timer(0, 1000).subscribe(() => {
            if (this.tokenRemainingTime > 0) {
                this.tokenRemainingTime--;
                this.updateDisplay(this.tokenRemainingTime);
                // Calculate percentage for circular progress
                this.timePercentage = (this.tokenRemainingTime / 300) * 100; // Assuming 300 seconds is 100%
            } else {
                this.timeExpired.emit();
                if (this.timerSubscription) {
                    this.timerSubscription.unsubscribe();
                }
            }
        });
    }

    private updateDisplay(totalSeconds: number): void {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        this.minutes = mins.toString().padStart(2, '0');
        this.seconds = secs.toString().padStart(2, '0');
    }

    ngOnDestroy(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    // Helper method to convert seconds to MM:SS format (for external use)
    convertSeconds(seconds: number): string {
        if (seconds <= 0) return '--:--';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    }
}
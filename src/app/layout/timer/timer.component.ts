import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnChanges {
    @Input() tokenRemainingTime: number = 300;
    @Input() isTokenExpired: boolean = false;
    @Output() timeExpired = new EventEmitter<void>();

    minutes: string = '00';
    seconds: string = '00';
    timePercentage: number = 100;
    private maxTime: number = 300;

    ngOnInit(): void {
        this.maxTime = this.tokenRemainingTime || 300;
        this.updateDisplay(this.tokenRemainingTime);
        this.calculatePercentage();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tokenRemainingTime']) {
            this.updateDisplay(this.tokenRemainingTime);
            this.calculatePercentage();

            if (this.tokenRemainingTime <= 0 && !this.isTokenExpired) {
                this.timeExpired.emit();
            }
        }
    }

    private updateDisplay(totalSeconds: number): void {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        this.minutes = mins.toString().padStart(2, '0');
        this.seconds = secs.toString().padStart(2, '0');
    }

    private calculatePercentage(): void {
        if (this.maxTime > 0) {
            this.timePercentage = Math.max(
                0,
                (this.tokenRemainingTime / this.maxTime) * 100
            );
        } else {
            this.timePercentage = 0;
        }
    }
}

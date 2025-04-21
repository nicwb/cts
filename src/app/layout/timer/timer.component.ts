import {
    Component,
    OnDestroy,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
    @Input() defaultMinutes: number = 25;
    @Output() timeExpired = new EventEmitter();

    minutes: string = '00';
    seconds: string = '00';
    dashArray: number = 283;
    dashOffset: number = 0;
    private interval: any;
    private totalSeconds: number = 0;
    private initialTime: number = 0;

    ngOnInit(): void {
        this.initialTime = this.defaultMinutes * 60;
        this.totalSeconds = this.initialTime;
        this.updateDisplay();
        this.startTimer();
    }

    private startTimer(): void {
        this.interval = setInterval(() => {
            if (this.totalSeconds > 0) {
                this.totalSeconds--;
                this.updateDisplay();
                this.dashOffset =
                    this.dashArray -
                    (this.totalSeconds / this.initialTime) * this.dashArray;
            } else {
                clearInterval(this.interval);
                this.timeExpired.emit();
            }
        }, 1000);
    }

    private updateDisplay(): void {
        const mins = Math.floor(this.totalSeconds / 60);
        const secs = this.totalSeconds % 60;

        this.minutes = mins.toString().padStart(2, '0');
        this.seconds = secs.toString().padStart(2, '0');
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

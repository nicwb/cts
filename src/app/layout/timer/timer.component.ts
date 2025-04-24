import {
    Component,
    OnDestroy,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    Renderer2,
    AfterViewInit,
} from '@angular/core';

@Component({
    selector: 'app-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() defaultMinutes: number = 25;
    @Output() timeExpired = new EventEmitter();

    minutes: string = '00';
    seconds: string = '00';

    // Circle progress properties
    outerDashArray: number = 565.48; // 2 * PI * 90
    middleDashArray: number = 471.24; // 2 * PI * 75
    innerDashArray: number = 376.99; // 2 * PI * 60
    outerDashOffset: number = 0;
    middleDashOffset: number = 0;
    innerDashOffset: number = 0;

    // Tick marks
    Math = Math;
    majorTicks: number[] = Array.from({ length: 12 }, (_, i) => i * 30);
    minorTicks: number[] = Array.from({ length: 60 }, (_, i) => i * 6).filter(
        (tick) => tick % 30 !== 0
    );

    // Particle system
    particles: number[] = Array(20)
        .fill(0)
        .map((_, i) => i);

    private interval: any;
    private totalSeconds: number = 0;
    private initialTime: number = 0;
    private particleElements: HTMLElement[] = [];

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {}

    ngOnInit(): void {
        this.initialTime = this.defaultMinutes * 60;
        this.totalSeconds = this.initialTime;
        this.updateDisplay();
        this.startTimer();
    }

    ngAfterViewInit(): void {
        this.initializeParticles();
    }

    private initializeParticles(): void {
        this.particleElements = Array.from(
            this.el.nativeElement.querySelectorAll('.timer-particle')
        );
        this.particleElements.forEach((particle) => {
            this.animateParticle(particle);
        });
    }

    private animateParticle(particle: HTMLElement): void {
        // Random position around the circle
        const angle = Math.random() * 360;
        const distance = 45 + Math.random() * 35;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;

        // Random size and opacity
        const size = 1 + Math.random() * 3;
        const opacity = 0.3 + Math.random() * 0.7;

        // Set initial styles
        this.renderer.setStyle(
            particle,
            'transform',
            `translate(${x}px, ${y}px)`
        );
        this.renderer.setStyle(particle, 'width', `${size}px`);
        this.renderer.setStyle(particle, 'height', `${size}px`);
        this.renderer.setStyle(particle, 'opacity', opacity.toString());

        // Animate
        const duration = 3000 + Math.random() * 7000;
        this.renderer.setStyle(
            particle,
            'transition',
            `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`
        );

        setTimeout(() => {
            // Move to a new position
            const newAngle = Math.random() * 360;
            const newDistance = 45 + Math.random() * 35;
            const newX = Math.cos((newAngle * Math.PI) / 180) * newDistance;
            const newY = Math.sin((newAngle * Math.PI) / 180) * newDistance;
            const newOpacity = 0.3 + Math.random() * 0.7;

            this.renderer.setStyle(
                particle,
                'transform',
                `translate(${newX}px, ${newY}px)`
            );
            this.renderer.setStyle(particle, 'opacity', newOpacity.toString());

            // Continue animation
            setTimeout(() => {
                this.animateParticle(particle);
            }, duration);
        }, 100);
    }

    private startTimer(): void {
        this.interval = setInterval(() => {
            if (this.totalSeconds > 0) {
                this.totalSeconds--;
                this.updateDisplay();
                this.updateProgressCircles();
            } else {
                clearInterval(this.interval);
                this.timeExpired.emit();
            }
        }, 1000);
    }

    private updateProgressCircles(): void {
        const progress = this.totalSeconds / this.initialTime;

        // Each circle represents a different aspect of time progression
        this.outerDashOffset = this.outerDashArray * (1 - progress);

        // Middle circle moves at a different rate (completes 2 cycles)
        const middleProgress = (progress * 2) % 1;
        this.middleDashOffset = this.middleDashArray * (1 - middleProgress);

        // Inner circle moves at yet another rate (completes 3 cycles) in the opposite direction
        const innerProgress = (progress * 3) % 1;
        this.innerDashOffset = this.innerDashArray * innerProgress;
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

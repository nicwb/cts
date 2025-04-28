import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar-pension', //app-app.sidebar.pension
    templateUrl: './app.sidebar.pension.component.html',
})
export class AppSidebarPensionComponent implements OnInit, AfterViewInit {
    readonly clientVersion = import.meta.env.NG_APP_VERSION;
    model: any[] = [];
    // @ViewChild('elements') elements!: ElementRef;
    @ViewChildren('elements') elements!: QueryList<ElementRef>;
    @ViewChild('version') versions!: ElementRef;
    @ViewChild('display') sidebar!: ElementRef;
    sidebarHeight!: number;
    totalElementsHeight: number | undefined;
    versionHeight: any;
    showVersion: boolean = true;
    resIze: any;

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private cdRef: ChangeDetectorRef
    ) {
        this.resIze = this.debounce(this.checkHeight, 100);
    }
    ngAfterViewInit(): void {
        void this.checkHeight();
    }

    ngOnInit() {
        this.model = [
            // {
            //     label: 'Pension',
            //     items: [
            //         {
            //             label: 'Dashboard',
            //             icon: 'pi pi-fw pi-home',
            //             routerLink: ['/'],
            //         },
            //     ],
            // },
            {
                items: [
                    {
                        label: 'Master',
                        icon: 'assets/layout/images/icons/byte.png',
                        items: [
                            {
                                label: 'Pension Category',
                                routerLink: ['/master/pension-category'], // Ensure leading slash for absolute path
                            },
                            {
                                label: 'Primary',
                                routerLink: ['/master/primary'], // Absolute path
                            },
                            {
                                label: 'Sub Category',
                                routerLink: ['/master/sub-category'], // Absolute path
                            },
                            {
                                label: 'Component',
                                routerLink: ['/master/component'], // Absolute path
                            },
                            {
                                label: 'Component Rate',
                                routerLink: ['/master/component-rate'], // Absolute path
                            },
                            {
                                label: 'Component Rate Revision',
                                routerLink: ['/master/component-rate-revision'], // Absolute path
                            },
                        ],
                    },
                ],
            },
            {
                items: [
                    {
                        label: 'Pension Process',
                        icon: 'assets/layout/images/icons/insurance.png',
                        items: [
                            {
                                label: 'PPO',
                                icon: 'assets/layout/images/icons/vendor-entry.png',
                                items: [
                                    {
                                        label: 'Entry',
                                        // icon: 'assets/layout/images/icons/market.png',

                                        routerLink: [
                                            'pension-process/ppo/entry',
                                        ],
                                    },
                                    {
                                        label: 'PPO Receipt',
                                        // icon: 'assets/layout/images/icons/ppo-receipt.png',

                                        routerLink: [
                                            'pension-process/ppo/ppo-receipt',
                                        ],
                                    },
                                    {
                                        label: 'Pensioner Status',
                                        // icon: 'assets/layout/images/icons/medical-report.png',
                                        routerLink: [
                                            'pension-process/ppo/pensioner-status',
                                        ],
                                    },

                                    {
                                        label: 'Life Certificate',
                                        // icon: 'assets/layout/images/icons/save.png',
                                        routerLink: [
                                            'pension-process/ppo/life-certificate',
                                        ],
                                    },
                                    {
                                        label: 'Convert to family pension',
                                        // icon: 'assets/layout/images/icons/family.png',
                                        routerLink: [
                                            'pension-process/ppo/convart-to-family-pension',
                                        ],
                                    },
                                ],
                            },
                            {
                                label: 'Pension Details',
                                icon: 'assets/layout/images/icons/report.png',
                                items: [
                                    {
                                        label: 'Revision of Components',
                                        routerLink: [
                                            '/pension-process/pension-details/revision',
                                        ],
                                    },
                                    {
                                        label: 'By Transfer',
                                        routerLink: [
                                            '/pension-process/pension-details/by-transfer',
                                        ],
                                    },

                                    // { label: 'By Transfer', icon: 'pi pi-fw pi-bookmark' },
                                    // { label: 'EFP/CVP/ Age calc', icon: 'pi pi-fw pi-bookmark' },
                                ],
                            },
                            {
                                label: 'Pension Bill',
                                icon: 'assets/layout/images/icons/bill.png',
                                items: [
                                    {
                                        label: 'First Pension Bill',
                                        routerLink: [
                                            'pension-process/pension-bill/first-pension-bill',
                                        ],
                                    },
                                    {
                                        label: 'Regular Pension Bill',
                                        routerLink: [
                                            'pension-process/pension-bill/regular-pension-bill',
                                        ],
                                    },
                                    {
                                        label: 'Arrear Pension Bill',
                                        routerLink: [
                                            'pension-process/pension-bill/arrear-pension-bill',
                                        ],
                                    },
                                    {
                                        label: 'Life Time Arrear Pension Bill',
                                        routerLink: [
                                            'pension-process/pension-bill/life-time-arrear-pension-bill',
                                        ],
                                    },
                                    {
                                        label: 'Exgratia Pension Bill',
                                        routerLink: [
                                            'pension-process/pension-bill/exgratia-pension-bill',
                                        ],
                                    },
                                ],
                            },
                            {
                                label: 'Approval',
                                icon: 'assets/layout/images/icons/approval1.png',
                                items: [
                                    {
                                        label: 'PPO Approval',
                                        routerLink: [
                                            '/pension-process/approval/ppo-approval',
                                        ],
                                    },
                                    {
                                        label: 'First pension Bill Approval',
                                        routerLink: [
                                            'pension-process/approval/firstpensionbill-approval',
                                        ],
                                    },
                                    {
                                        label: 'Family Pension Approval',
                                        routerLink: [
                                            'pension-process/approval/family-pension-approval',
                                        ],
                                    },
                                    {
                                        label: 'DA Arrear Pension Approval',
                                        routerLink: [
                                            'pension-process/approval/da-arrear-pension-approval',
                                        ],
                                    },
                                    // { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ],
                            },
                            {
                                label: 'Bill Print',
                                icon: 'assets/layout/images/icons/bill-receive.png',

                                items: [
                                    {
                                        label: 'First Pension Bill Print',
                                        routerLink: [
                                            'pension-process/bill-print/first-pension-bill-print',
                                        ],
                                    },
                                    {
                                        label: 'Regular Pension Bill Print',
                                        routerLink: [
                                            'pension-process/bill-print/regular-pension-bill-print',
                                        ],
                                    },
                                    // { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ],
                            },
                        ],
                    },
                    {
                        label: 'Report',
                        icon: 'assets/layout/images/icons/statistics.png',
                        items: [
                            {
                                label: 'Manual PPO Register',
                                routerLink: ['/pension-report'],
                            },
                        ],
                    },
                ],
            },

            // {
            //   label: 'Get Started',
            //   items: [
            //     {
            //       label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
            //     },
            //     {
            //       label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
            //     }
            //   ]
            // }
        ];
    }
    debounce<T extends (...args: any[]) => any>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: ReturnType<typeof setTimeout>;

        return function (
            this: ThisParameterType<T>,
            ...args: Parameters<T>
        ): void {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        // console.log(event);
        // void this.checkHeight();
        this.resIze();
    }

    async checkHeight() {
        setTimeout(() => {
            this.totalElementsHeight = this.elements
                .toArray()
                .reduce((sum, el) => sum + el.nativeElement.offsetHeight, 0);

            // Get `#version` height
            this.versionHeight = this.versions.nativeElement.offsetHeight;
            this.sidebarHeight = this.sidebar.nativeElement.offsetHeight;
            // console.log(
            //     `ele${this.totalElementsHeight} \n version ${this.versionHeight} sidebar height ${this.sidebarHeight}`
            // );
            this.cdRef.detectChanges();
            if (this.versionHeight != 0) {
                if (
                    this.totalElementsHeight + this.versionHeight + 10 >
                    this.sidebarHeight
                ) {
                    this.showVersion = false;
                } else {
                    this.showVersion = true;
                }
            } else {
                if (this.totalElementsHeight + 70 > this.sidebarHeight) {
                    this.showVersion = false;
                } else {
                    this.showVersion = true;
                }
            }
        }, 300);
    }
}

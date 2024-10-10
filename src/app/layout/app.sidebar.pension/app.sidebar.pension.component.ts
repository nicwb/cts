import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';

@Component({
    selector: 'app-sidebar-pension',   //app-app.sidebar.pension
    templateUrl: './app.sidebar.pension.component.html',

})

export class AppSidebarPensionComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Pension',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                items: [
                    {
                        label: 'Master', icon: 'pi pi-fw pi-box',
                        items: [
                            {
                                label: 'Pension Category',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/master/pension-category']  // Ensure leading slash for absolute path
                            },
                            {
                                label: 'Primary',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/master/primary']  // Absolute path
                            },
                            {
                                label: 'Sub Category',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/master/sub-category']  // Absolute path
                            },
                            {
                                label: 'Component',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/master/component']  // Absolute path
                            },
                            {
                                label: 'Component Rate',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/master/component-rate']  // Absolute path
                            },
                            {
                                label: 'Component Rate Revision',
                                icon: 'pi pi-fw pi-bookmark',
                                routerLink: ['/master/component-rate-revision']  // Absolute path
                            }
                        ]
                    }
                ]
            },
            {
                items: [
                    {
                        label: 'Pension Process', icon: 'pi pi-fw pi-box',
                        items: [
                            {
                                label: 'PPO', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Entry', icon: 'pi pi-fw pi-bookmark', routerLink: ['pension-process/ppo'] },
                                    { label: 'PPO Receipt', icon: 'pi pi-fw pi-bookmark', routerLink: ['pension-process/ppo/ppo-receipt'] },
                                    // { label: 'Convert to Family Pension', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pension/modules/pension-process/ppo/convert-to-family-pension'] },
                                    { label: 'Life Certificate', icon: 'pi pi-fw pi-bookmark', routerLink: ['pension-process/ppo/life-certificate'] },
                                ]
                            },
                            {
                                label: 'Pension Details', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Revision of Components', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pension-process/pension-details/revision'] },
                                    // { label: 'By Transfer', icon: 'pi pi-fw pi-bookmark' },
                                    // { label: 'EFP/CVP/ Age calc', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Pension Bill', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    {
                                        label: 'first pension bill',
                                        icon: 'pi pi-fw pi-bookmark',
                                        routerLink: ['pension-process/pension-bill/first-pension-bill']
                                    },
                                    { label: 'Regular Pension', icon: 'pi pi-fw pi-bookmark', routerLink: ['pension-process/pension-bill/regular-pension-bill'] },

                                ]
                            },
                            {
                                label: 'Approval', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'PPO', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pension-process/approval/ppo-approval'] },
                                    { label: 'First pension Bill', icon: 'pi pi-fw pi-bookmark', routerLink: ['pension-process/approval/firstpensionbill-approval'] },
                                // { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },{
                                label: 'Bill Print', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'First Pension', icon: 'pi pi-fw pi-bookmark', routerLink: ['pension-process/bill-print/first-pension-bill-print'] },
                                    { label: 'Regular Pension', icon: 'pi pi-fw pi-bookmark', routerLink: ['pension-process/bill-print/regular-pension-bill-print'] },
                                // { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ]

                            }

                            //  { label: 'Arrear Pension', icon: 'pi pi-fw pi-bookmark' },
                            // { label: 'Life Time Arrear', icon: 'pi pi-fw pi-bookmark' },
                            // { label: 'Money Pension', icon: 'pi pi-fw pi-bookmark' },
                            // { label: 'Transfer', icon: 'pi pi-fw pi-bookmark' },
                            // { label: 'Extragia Pension', icon: 'pi pi-fw pi-bookmark' },
                            // { label: 'DA Arrear Pension', icon: 'pi pi-fw pi-bookmark' },
                            // { label: 'LTA Classification Bill', icon: 'pi pi-fw pi-bookmark' },
                        ]
                    },{
                        label: 'Report', icon: 'pi pi-fw pi-box',
                        items: [
                            { label: 'Pension Report', icon: 'pi pi-fw pi-bookmark', routerLink: ['/pension-report'] },

                        ]
                    }
                    // {
                    //     label: 'Approval', icon: 'pi pi-fw pi-bookmark',
                    //     items: [
                    //         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                    //         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                    //         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                    //     ]
                    // },
                    // {
                    //     label: 'File Upload', icon: 'pi pi-fw pi-bookmark',
                    //     items: [
                    //         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                    //     ]
                    // },
                    // {
                    //     label: 'Send to Epradan', icon: 'pi pi-fw pi-bookmark',

                    // },
                    // {

                    //     label: 'Court Case entry', icon: 'pi pi-fw pi-bookmark',

                    // },


                    // {
                    //     label: 'Reports', icon: 'pi pi-fw pi-box',
                    //     items: [
                    //         {
                    //             label: 'PPO Details', icon: 'pi pi-fw pi-bookmark',
                    //             items: [
                    //                 { label: 'Components Payable details', icon: 'pi pi-fw pi-bookmark' },
                    //                 { label: 'TDS Details', icon: 'pi pi-fw pi-bookmark',
                    //                     items: [
                    //                         { label: 'TDS Summery -EC-110', icon: 'pi pi-fw pi-bookmark' },
                    //                         { label: 'TDS Pension Details TR 10 IFMS | EC-111', icon: 'pi pi-fw pi-bookmark' },
                    //                     ]
                    //                  },
                    //                  { label: 'Approved PPO DetailsEC-112', icon: 'pi pi-fw pi-bookmark' },
                    //                  { label: 'Life Certificate Not Submitted', icon: 'pi pi-fw pi-bookmark' },
                    //             ]
                    //         },
                    //         {
                    //             label: 'Bill', icon: 'pi pi-fw pi-bookmark',
                    //             items: [
                    //                 { label: 'Bank Register(All Bills)-EC-114', icon: 'pi pi-fw pi-bookmark' },
                    //                 { label: 'Bank Register-EC-115', icon: 'pi pi-fw pi-bookmark' },
                    //                 { label: ' Transferred PPOs Register-EC-116', icon: 'pi pi-fw pi-bookmark' },
                    //             ]
                    //         },
                    //         { label: 'Pension Master-EC-117', icon: 'pi pi-fw pi-bookmark' },
                    //         { label: 'Pensioner Bank Details-EC-118', icon: 'pi pi-fw pi-bookmark' },
                    //         { label: 'Suspended PPO-EC-119', icon: 'pi pi-fw pi-bookmark' },
                    //         { label: 'Pensioner Master-EC-120', icon: 'pi pi-fw pi-bookmark' },
                    //         { label: 'Pension EFP TO NFP-EC-121', icon: 'pi pi-fw pi-bookmark' },
                    //         { label: 'Converted Family Pension-EC-122', icon: 'pi pi-fw pi-bookmark' },
                    //         { label: 'Pension Component Rate-EC-123', icon: 'pi pi-fw pi-bookmark' },
                    //         { label: 'PPO Master-EC-124', icon: 'pi pi-fw pi-bookmark' },


                    //     ]
                    // },
                    // {
                    //     label: 'Query', icon: 'pi pi-fw pi-box',
                    //     items: [
                    //         {
                    //             label: 'Pensioner Details', icon: 'pi pi-fw pi-bookmark',
                    //             items: [
                    //                 { label: 'Breakup Details', icon: 'pi pi-fw pi-bookmark' },

                    //             ]
                    //         },

                    //     ]
                    // },
                    // {
                    //     label: 'Festival Master', icon: 'pi pi-fw pi-box',

                    // },
                    // {

                    //     label: 'Festival Details', icon: 'pi pi-fw pi-box',

                    // },
                ]
            },
            // {
            //   label: 'UI Components',
            //   items: [
            //     { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            //     { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            //     { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
            //     { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
            //     { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
            //     { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            //     { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            //     { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            //     { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            //     { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            //     { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            //     { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
            //     { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            //     { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            //     { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            //     { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
            //   ]
            // },
            // {
            //   label: 'Prime Blocks',
            //   items: [
            //     { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
            //     { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
            //   ]
            // },
            // {
            //   label: 'Utilities',
            //   items: [
            //     { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
            //     { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
            //   ]
            // },
            // {
            //   label: 'Pages',
            //   icon: 'pi pi-fw pi-briefcase',
            //   items: [
            //     {
            //       label: 'Landing',
            //       icon: 'pi pi-fw pi-globe',
            //       routerLink: ['/landing']
            //     },
            //     {
            //       label: 'Auth',
            //       icon: 'pi pi-fw pi-user',
            //       items: [
            //         {
            //           label: 'Login',
            //           icon: 'pi pi-fw pi-sign-in',
            //           routerLink: ['/auth/login']
            //         },
            //         {
            //           label: 'Error',
            //           icon: 'pi pi-fw pi-times-circle',
            //           routerLink: ['/auth/error']
            //         },
            //         {
            //           label: 'Access Denied',
            //           icon: 'pi pi-fw pi-lock',
            //           routerLink: ['/auth/access']
            //         }
            //       ]
            //     },
            //     {
            //       label: 'Crud',
            //       icon: 'pi pi-fw pi-pencil',
            //       routerLink: ['/pages/crud']
            //     },
            //     {
            //       label: 'Timeline',
            //       icon: 'pi pi-fw pi-calendar',
            //       routerLink: ['/pages/timeline']
            //     },
            //     {
            //       label: 'Not Found',
            //       icon: 'pi pi-fw pi-exclamation-circle',
            //       routerLink: ['/notfound']
            //     },
            //     {
            //       label: 'Empty',
            //       icon: 'pi pi-fw pi-circle-off',
            //       routerLink: ['/pages/empty']
            //     },
            //   ]
            // },
            // {
            //   label: 'Hierarchy',
            //   items: [
            //     {
            //       label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
            //       items: [
            //         {
            //           label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
            //           items: [
            //             { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //             { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //             { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
            //           ]
            //         },
            //         {
            //           label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
            //           items: [
            //             { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
            //           ]
            //         },
            //       ]
            //     },
            //     {
            //       label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
            //       items: [
            //         {
            //           label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
            //           items: [
            //             { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //             { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
            //           ]
            //         },
            //         {
            //           label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
            //           items: [
            //             { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
            //           ]
            //         },
            //       ]
            //     }
            //   ]
            // },
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
}

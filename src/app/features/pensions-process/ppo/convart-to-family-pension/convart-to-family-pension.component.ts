import { Component, HostListener, OnInit } from '@angular/core';

@Component({
    selector: 'app-convart-to-family-pension',
    templateUrl: './convart-to-family-pension.component.html',
    styleUrls: ['./convart-to-family-pension.component.scss']
})
export class ConvartToFamilyPensionComponent {

  @HostListener('window:resize', ['$event'])
      isMobileView: boolean = false;

  onResize(event: any) {
      this.isMobileView = window.innerWidth <= 900;
  }
  constructor() { }
  familyDetails = [
      { name: '', relationship: '', dob: '', handicapped: false, eligibleForPension: false },
      { name: '', relationship: '', dob: '', handicapped: false, eligibleForPension: false },
      { name: '', relationship: '', dob: '', handicapped: false, eligibleForPension: false },
      { name: '', relationship: '', dob: '', handicapped: false, eligibleForPension: false }

  ];
  relationshipOptions = [
      { label: 'Father', value: 'Father' },
      { label: 'Mother', value: 'Mother' },
      { label: 'Son', value: 'Son' },
  ];
  NomineeType = [
      { label: 'Pension', value: 'P' },
      { label: 'Commutation', value: 'C' },
      { label: 'Gratuity', value: 'G' },
      { label: 'All', value: 'A' },

  ];

  FamilyPensionDetails = [
      { Pension: '', Upto: '', date: '', Effective_From: ''},
      { Pension: '', Upto: '', date: '', Effective_From: ''},
      { Pension: '', Upto: '', date: '', Effective_From: ''},
      { Pension: '', Upto: '', date: '', Effective_From: ''},

  ]

}

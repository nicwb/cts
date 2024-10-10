import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSidebarPensionComponent } from './app.sidebar.pension.component'; // Adjust the import path as necessary
import { MasterModule } from 'src/app/features/master/master.module'; 

@NgModule({
    declarations: [AppSidebarPensionComponent],
    imports: [
        CommonModule,
        // MasterModule

    ],
})
export class AppsidebarModule {}

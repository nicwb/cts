// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { PensionCategoryComponent } from './pension-category.component';

// const routes: Routes = [
//     {
//         path: '',
//         component: PensionCategoryComponent // This component will be displayed when navigating to 'pension-category'
//       },
// ];

// @NgModule({
//     imports: [RouterModule.forChild(routes)],
//     exports: [RouterModule]
// })
// export class PensionCategoryRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PensionCategoryComponent } from './pension-category.component';

// const routes: Routes = [
//     {
//         path: '',
//         component: PensionCategoryComponent,
//         data: { breadcrumb: 'Pension Category' },
        
//     },
//     {
//         path: 'new',
//         component: PensionCategoryComponent, // The component for the new route
//         data: { breadcrumb: 'New Pension Category' }
//     }
// ];

@NgModule({
    // imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PensionCategoryRoutingModule { }

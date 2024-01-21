import { Routes } from '@angular/router';
import { ToysimulationInterfaceComponent } from './toysimulation-interface/toysimulation-interface.component';

export const routes: Routes = [
    {path:"", redirectTo:"/toysimulation-interface",pathMatch:'full'},
    {path:'toysimulation-interface',component:ToysimulationInterfaceComponent},

];

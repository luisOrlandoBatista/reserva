import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ReservaComponent} from './components/reserva.component/reserva.component';

const routes: Routes = [
  {path: '', redirectTo: 'reserva', pathMatch: 'full'},
  {path: 'reserva', component: ReservaComponent},
  {path: '**', redirectTo: 'reserva'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

import { Routes } from '@angular/router';
import { ListComponent } from './@components/list/list.component';
import { InnerPageComponent } from './@components/inner-page/inner-page.component';
import { StatisticsPageComponent } from './@components/statistics-page/statistics-page.component';
import { LoginComponent } from './@components/login/login.component';

export const routes: Routes = [
  {path: 'list', component: ListComponent},
  {path: 'inner-page/:id', component: InnerPageComponent},
  {path: 'statistics-page/:id', component: StatisticsPageComponent},
  {path: 'login', component: LoginComponent},




];

import { Routes } from '@angular/router';
import { Debug } from './routes/debug';
import { Login } from './routes/login';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chat',
  },
  {
    path: 'chat',
    pathMatch: 'full',
    component: Debug,
  },
  {
    path: 'chat/:chatId',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsChange',
    component: Debug,
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: Login,
  },
];

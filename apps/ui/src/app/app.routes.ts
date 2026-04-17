import { Routes } from '@angular/router';
import { LmStudioApi } from './routes/lm-studio-api';
import { OpenAiApi } from './routes/openai-api';
import { Login } from './routes/login';
import { ReadmeComponent } from './routes/readme';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'readme',
    pathMatch: 'full',
  },
  {
    path: 'readme',
    component: ReadmeComponent,
    pathMatch: 'full',
  },
  {
    path: 'chat-lm-studio',
    pathMatch: 'full',
    component: LmStudioApi,
  },
  {
    path: 'chat-lm-studio/:chatId',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsChange',
    component: LmStudioApi,
  },
  {
    path: 'chat-openai',
    pathMatch: 'full',
    component: OpenAiApi,
  },
  {
    path: 'chat-openai/:chatId',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsChange',
    component: OpenAiApi,
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: Login,
  },
];

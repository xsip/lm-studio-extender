import { Routes } from '@angular/router';
import { LmStudioApi } from './routes/lm-studio-api';
import { OpenAiApi } from './routes/openai-api';
import { Login } from './routes/login';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'chat-lm-studio',
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

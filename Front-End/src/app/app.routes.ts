import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register.component';
import { Dashboard } from './components/dashboard/dashboard';
import { ProjectBoard } from './components/project-board/project-board';
import { Features } from './components/features/features';
import { Faq } from './components/faq/faq';
import { About } from './components/about/about';
import { PrivacyPolicy } from './components/privacy-policy/privacy-policy';
import { TermsOfService } from './components/terms-of-service/terms-of-service';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'features', component: Features },
  { path: 'faq', component: Faq },
  { path: 'about', component: About },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'terms-of-service', component: TermsOfService },
  { path: 'project/:id', component: ProjectBoard },
  { path: '**', redirectTo: '/dashboard' }
];

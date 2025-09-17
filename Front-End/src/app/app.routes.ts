import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { ProjectBoard } from './components/project-board/project-board';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { Features } from './components/features/features';
import { Faq } from './components/faq/faq';
import { About } from './components/about/about';
import { Contact } from './components/contact/contact';
import { PrivacyPolicy } from './components/privacy-policy/privacy-policy';
import { TermsOfService } from './components/terms-of-service/terms-of-service';
import { UserProfile } from './components/user-profile/user-profile.component';
import { EditUser } from './components/edit-user/edit-user';
import { ChangePassword } from './components/change-password/change-password';
import { IssueBoard } from './components/issue-board/issue-board';

// Configurazione delle routes dell'applicazione
export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'features', component: Features },
  { path: 'faq', component: Faq },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'terms-of-service', component: TermsOfService },
  { path: 'project/:id', component: ProjectBoard },
  { path: 'issue/:id', component: IssueBoard },
  { path: 'user-profile', component: UserProfile },
  { path: 'edit-user', component: EditUser },
  { path: 'change-password', component: ChangePassword },
  { path: '**', redirectTo: '/home' }
];

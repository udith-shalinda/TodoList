import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoinputComponent } from './todoinput/todoinput.component';
import { ListComponent } from './list/list.component';
import { SignInComponent } from './login/sign-in/sign-in.component';
import { SignUpComponent } from './login/sign-up/sign-up.component';
import { AuthGuard } from './login/auth-guard';

const routes: Routes = [{
  path:'',
  component:ListComponent
},{
  path:'newPost',
  component:TodoinputComponent,
  canActivate:[AuthGuard]
},{
  path:'edit/:id',
  component:TodoinputComponent,
  canActivate:[AuthGuard]
},{
  path:'signIn',
  component:SignInComponent
},{
  path:'signUp',
  component:SignUpComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }

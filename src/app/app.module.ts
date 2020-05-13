import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Routes, RouterModule} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { BYFNComponent } from './pages/byfn/byfn.component';
import { GuideComponent } from './pages/guide/guide.component';
import { QNAComponent } from './pages/qna/qna.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';

import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion'
import {MatCardModule} from '@angular/material/card'
import { AuthInterceptorSrvice } from './pages/auth/auth-interceptor.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'byfn', component: BYFNComponent },
  { path: 'guide', component: GuideComponent },
  { path: 'q-and-a', component: QNAComponent },
  { path: 'auth', component: AuthComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    BYFNComponent,
    GuideComponent,
    HomeComponent,
    QNAComponent,
    AuthComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatCardModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorSrvice, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }

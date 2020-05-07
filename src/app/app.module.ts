import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageContentComponent } from './page-content/page-content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule} from '@angular/router'

import {MatButtonModule} from '@angular/material/button';
import { FooterComponent } from './footer/footer.component';

import { BYFNComponent } from './pages/byfn/byfn.component';
import { GuideComponent } from './pages/guide/guide.component';
import { QNAComponent } from './pages/qna/qna.component';
import { HomeComponent } from './pages/home/home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'byfn', component: BYFNComponent },
  { path: 'guide', component: GuideComponent },
  { path: 'q-and-a', component: QNAComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PageContentComponent,
    FooterComponent,
    BYFNComponent,
    GuideComponent,
    HomeComponent,
    QNAComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

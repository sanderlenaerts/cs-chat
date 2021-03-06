//import 'hammerjs';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { ModalModule } from 'ngx-modal';
import {OVERLAY_PROVIDERS} from "@angular2-material/core";

// Custom Components
import { PublicComponent } from './components/public.component';
import { LandingComponent } from './components/landing.component';
import { LoginComponent } from './components/login.component';
import { ChatContainerComponent } from './components/chat/chat-container.component';
import { ChatComponent } from './components/chat/chat.component';
import { AdminComponent } from './components/admin.component';
import { UsersComponent } from './components/users.component';
import { RegisterComponent } from './components/register.component';
import { UserInputComponent } from './components/chat/user-input.component';
import { SupportFormComponent } from './components/support.component';
import { DropdownComponent } from './components/dropdown.component';
import { UpdateUserComponent } from './components/update-user.component';
import { NotificationComponent } from './components/notification.component';
import { HomeComponent } from './components/home.component';


// Validators
import { EmailValidator } from './components/validators/email.validator';
import { WhitespaceValidator } from './components/validators/whitespace.validator';

// Services
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { NotificationService } from './services/notification.service';

// Authorization Guard
import { AuthGuard } from './services/guard.service';

//Role guard
import { RoleGuard } from './services/roleguard.service';
import { ActivatedRouteSnapshot } from '@angular/router';

//Time guard
import { TimeGuard } from './services/timeguard.service';

// Directives
import { FocusDirective } from './directives/focus.directive';

// Components
import { appRouting } from './app.routing';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

//Pipes
import { SearchPipe } from './filters/user.filter';
import { SearchComponent } from './components/search.component';

import {MdMenuModule} from '@angular2-material/menu';

export class MyAppModule {}

function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule ({
  imports: [
    BrowserModule,
    appRouting,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ModalModule
  ],
  declarations: [
    AppComponent,
    LandingComponent,
    ChatContainerComponent,
    ChatComponent,
    LoginComponent,
    PublicComponent,
    AdminComponent,
    UsersComponent,
    RegisterComponent,
    UserInputComponent,
    SupportFormComponent,
    FocusDirective,
    SearchPipe,
    SearchComponent,
    DropdownComponent,
    UpdateUserComponent,
    NotificationComponent,
    HomeComponent
  ],
  bootstrap: [ AppComponent ],
  providers: [
    CookieService,
    AuthenticationService,
    AuthGuard,
    RoleGuard,
    UserService,
    TimeGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    ChatService,
    NotificationService
  ]
})

export class AppModule {}

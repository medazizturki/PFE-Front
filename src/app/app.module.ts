import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { JourFerieComponent } from './Administration/JourFerie/jour-ferie/jour-ferie.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TypeTeneurComponent } from './Administration/Teneurs/type-teneur/type-teneur.component';
import { CompteTeneurComponent } from './Administration/Teneurs/compte-teneur/compte-teneur.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TMMComponent } from './Administration/Banque/tmm/tmm.component';
import { DevisesComponent } from './Administration/Banque/devises/devises.component';
import { TauxChargeComponent } from './Administration/Banque/taux-charge/taux-charge.component';
import { TypeMarcheComponent } from './Administration/GestionReferentiels/type-marche/type-marche.component';
import { CommisionHorsElecComponent } from './Administration/GestionReferentiels/commision-hors-elec/commision-hors-elec.component';
import { CommissionElecComponent } from './Administration/GestionReferentiels/commission-elec/commission-elec.component';
import { CategorieavoirComponent } from './Administration/GestionReferentiels/categorieavoir/categorieavoir.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    HomeComponent,
    UserComponent,
    JourFerieComponent,
    TypeTeneurComponent,
    CompteTeneurComponent,
    TMMComponent,
    DevisesComponent,
    TauxChargeComponent,
    TypeMarcheComponent,
    CommisionHorsElecComponent,
    CommissionElecComponent,
    CategorieavoirComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,  
    DialogModule,
    InputTextModule,
    FileUploadModule,
    DropdownModule,
    ToastModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    FullCalendarModule,
    AutoCompleteModule
  ],
  providers: [
    DialogService,
    MessageService // if you're using MessageService too
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }

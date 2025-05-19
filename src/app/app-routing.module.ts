import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth.guard';
import { JourFerieComponent } from './Administration/JourFerie/jour-ferie/jour-ferie.component';
import { TypeTeneurComponent } from './Administration/Teneurs/type-teneur/type-teneur.component';
import { CompteTeneurComponent } from './Administration/Teneurs/compte-teneur/compte-teneur.component';
import { TMMComponent } from './Administration/Banque/tmm/tmm.component';
import { DevisesComponent } from './Administration/Banque/devises/devises.component';
import { TauxChargeComponent } from './Administration/Banque/taux-charge/taux-charge.component';
import { TypeMarcheComponent } from './Administration/GestionReferentiels/type-marche/type-marche.component';
import { CommisionHorsElecComponent } from './Administration/GestionReferentiels/commision-hors-elec/commision-hors-elec.component';
import { CommissionElecComponent } from './Administration/GestionReferentiels/commission-elec/commission-elec.component';
import { CategorieavoirComponent } from './Administration/GestionReferentiels/categorieavoir/categorieavoir.component';
import { GroupesComponent } from './Administration/GestionReferentiels/groupes/groupes.component';
import { IndiceSectorielComponent } from './Administration/GestionReferentiels/indice-sectoriel/indice-sectoriel.component';
import { NatureReferentielsComponent } from './Administration/GestionReferentiels/nature-referentiels/nature-referentiels.component';
import { SecteurNationalComponent } from './Administration/Secteur/secteur-national/secteur-national.component';
import { SecteurInternationalComponent } from './Administration/Secteur/secteur-international/secteur-international.component';
import { IntermediaireComponent } from './Administration/GestionReferentiels/intermediaire/intermediaire.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  { path: 'jourferie', component: JourFerieComponent, canActivate: [AuthGuard] },
  { path: 'typeteneur', component: TypeTeneurComponent, canActivate: [AuthGuard] },
  { path: 'compteteneur', component: CompteTeneurComponent, canActivate: [AuthGuard] },
  { path: 'tmm', component: TMMComponent, canActivate: [AuthGuard] },
  { path: 'devises', component: DevisesComponent, canActivate: [AuthGuard] },
  { path: 'tauxcharge', component: TauxChargeComponent, canActivate: [AuthGuard] },
  { path: 'typemarche', component: TypeMarcheComponent, canActivate: [AuthGuard] },
  { path: 'commissionHE', component: CommisionHorsElecComponent, canActivate: [AuthGuard] },
  { path: 'commissionE', component: CommissionElecComponent, canActivate: [AuthGuard] },
  { path: 'categorieavoir', component: CategorieavoirComponent, canActivate: [AuthGuard] },
  { path: 'groupes', component: GroupesComponent, canActivate: [AuthGuard] },
  { path: 'indicesectoriel', component: IndiceSectorielComponent, canActivate: [AuthGuard] },
  { path: 'naturereferentiel', component: NatureReferentielsComponent, canActivate: [AuthGuard] },
  { path: 'secteurnational', component: SecteurNationalComponent, canActivate: [AuthGuard] },
  { path: 'secteurinternational', component: SecteurInternationalComponent, canActivate: [AuthGuard] },
  { path: 'intermediaire', component: IntermediaireComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

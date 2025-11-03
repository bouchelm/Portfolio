import { Routes } from '@angular/router';
import { PlanificateursComponent } from './components/planificateurs/planificateurs.component';
import { AuthentificationComponent } from './components/authentification/authentification.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { LivreursComponent } from './components/livreurs/livreurs.component';

export const routes: Routes = [
    { path: 'planificateurs', title: "Planificateurs", component: PlanificateursComponent },
    { path: 'authentification', title:"Authentification", component: AuthentificationComponent},
    { path: 'livreurs', title:"livreurs", component: LivreursComponent},

    { path: '', title: "accueil", component:AccueilComponent }
];

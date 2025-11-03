import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Types from 'app/shared/types';

@Injectable({
  providedIn: 'root'
})
export class SauvegarderDonneesService {

  constructor(private http : HttpClient) {
   }

   tournees = signal<Types.Tournee[]>([]);
   journees = signal<Types.Journee[]>([]);
   livraisons = signal<Types.Livraison[]>([]);
 
 
   sauvegarderTournees(nouvellesTournees: Types.Tournee[]) {
     this.tournees.set(nouvellesTournees);
   }
 
   getTournees(): Types.Tournee[] {
     return this.tournees();
   }
  
  sauvegarderJournees(nouvellesJournees: Types.Journee[]) {
this.journees.set(nouvellesJournees);  
}
   
getJournees(): Types.Journee[] {
  return this.journees();
}


sauvegarderLivraisons(nouvellesLivraisons: Types.Livraison[]) {
  this.livraisons.set(nouvellesLivraisons);
}

getLivraisons(): Types.Livraison[] {
  return this.livraisons();
}
}

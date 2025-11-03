import { Component, computed, model, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ChargerDonneesService } from '../../services/charger-donnees.service';
import * as Types from 'app/shared/types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SauvegarderDonneesService } from '../../services/sauvegarder-donnees.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, Layer, LeafletMouseEvent, MapOptions, tileLayer } from 'leaflet';
import {Map as LeafletMap} from 'leaflet'
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-planificateurs',
  imports: [MatAutocompleteModule, MatDatepickerModule,
    MatFormFieldModule, MatInputModule,MatSelectModule, ReactiveFormsModule,
    LeafletModule
  ],
  templateUrl: './planificateurs.component.html',
  styleUrl: './planificateurs.component.css'
})
export class PlanificateursComponent {

   private chargeDonnees = inject(ChargerDonneesService);
   private sauvegarder = inject(SauvegarderDonneesService);
   private formulaire = inject(FormBuilder);
   private firestore = inject(Firestore);
   private http = inject(HttpClient);


   commandes = this.chargeDonnees.commandes;
   commandeSelectionnee = signal<Types.Commande>(this.commandes()[0]);
   clients = this.chargeDonnees.clients;
   employes = this.chargeDonnees.employes;

   private map?: LeafletMap;

  onMapReady(map: LeafletMap) {
    this.map = map;
    console.log('🗺️ Carte initialisée');
    
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }

    protected readonly options: MapOptions = {
     zoom: 13,
  center: latLng(45.1885, 5.7245), // Grenoble
  zoomControl: true,
  attributionControl: true,
  preferCanvas: false,  
  renderer: undefined   
  };
   private   readonly baseLayer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' });
  protected readonly allLayers = computed<Layer[]>(
    () => [ 
      this.baseLayer,
    ]
  )


 

   tourneeForm: FormGroup= this.formulaire.group({
    nom: ['', Validators.required],
    date: [new Date(), Validators.required],
    commandes: [[] as Types.Commande[], Validators.required],
    livreurs: [[] as Types.Employe[], Validators.required]
  });

    
   


  ngOnInit() {
    this.chargeDonnees.loadAllData();

    console.log('Commandes:', this.commandes());
    console.log('Clients:', this.clients());

  }

commandesOuvertes = computed(() => 
  this.commandes().filter(c => c.etat === 'ouverte')
);

selectionnerCommande(event: Event) {
  const reference = (event.target as HTMLSelectElement).value;

  const commande = this.commandes().find(c => c.reference === reference);
    if (commande) {
      this.commandeSelectionnee.set(commande);
    }
}

filteredCommandes = computed(() => {
  const commandesControl = this.tourneeForm.get('commandes');
  const searchText = commandesControl?.value?.toString().toLowerCase() || '';
  return this.commandes().filter(commande => 
    commande.reference.toLowerCase().includes(searchText)
  );
});

filteredLivreurs = computed(() => {
  const livreursControl = this.tourneeForm.get('livreurs');
  const searchText = livreursControl?.value?.toString().toLowerCase() || '';
  return this.employes().filter(employe => 
    employe.nom.toLowerCase().includes(searchText) ||
    employe.prenom.toLowerCase().includes(searchText)
  );
});

onSubmit() {
  if (this.tourneeForm.valid) {
    const formValue = this.tourneeForm.value;
    const selectedCommandes = formValue.commandes ?? [];
    const selectedLivreurs = formValue.livreurs ?? [];

    if (selectedCommandes.length > 0 && selectedLivreurs.length > 0) {
      const nouvellesTournees = [...this.sauvegarder.tournees()]; 

      selectedLivreurs.forEach((employe: Types.Employe) => {
        const nouvelleLivraison: Types.Livraison = {
          client: selectedCommandes[0].client,
          commandes: selectedCommandes,
          etat: 'planifiée',
          livreur: employe
        };

        this.sauvegarder.livraisons.update(livs => [...livs, nouvelleLivraison]); 

        const nouvelleTournee: Types.Tournee = {
          livraisons: nouvelleLivraison
        };

        nouvellesTournees.push(nouvelleTournee);
      });

      this.sauvegarder.tournees.set(nouvellesTournees); 
      this.sauvegarder.journees.update(j => [...j, { tournee: nouvellesTournees }]); 

      
      this.tourneeForm.reset({
        date: new Date(),
        commandes: [],
        livreurs: []
      });
    }
  }
}



async migrerDonneesVersFirestore() {
  console.log('Début de la migration...');
  
  // Lire les fichiers JSON locaux (une dernière fois !)
  const commandes = await this.http.get<any[]>('assets/data/Commandes.json').toPromise();
  const clients = await this.http.get<any[]>('assets/data/Clients.json').toPromise();
  const employes = await this.http.get<any[]>('assets/data/Employés.json').toPromise();
  
  // Créer les collections dans Firestore
  const commandesCollection = collection(this.firestore, 'commandes');
  const clientsCollection = collection(this.firestore, 'clients');
  const employesCollection = collection(this.firestore, 'employes');
  
  // Importer les commandes
  console.log('Import des commandes...');
  for (const commande of commandes!) {
    await addDoc(commandesCollection, commande);
  }
  
  // Importer les clients
  console.log('Import des clients...');
  for (const client of clients!) {
    await addDoc(clientsCollection, client);
  }
  
  // Importer les employés
  console.log('Import des employés...');
  for (const employe of employes!) {
    await addDoc(employesCollection, employe);
  }
  
  console.log('Migration terminée ! Vous pouvez maintenant supprimer les fichiers JSON.');
}

}

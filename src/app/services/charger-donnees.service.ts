import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Types from 'app/shared/types';
import { combineLatest } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChargerDonneesService {

  private commandesSignal = signal<Types.Commande[]>([]);
  readonly commandes = this.commandesSignal.asReadonly();
  private clientsSignal = signal<Types.Client[]>([]);
  readonly clients = this.clientsSignal.asReadonly();
  private employesSignal = signal<Types.Employe[]>([]);
  readonly employes = this.employesSignal.asReadonly();

  constructor(private http: HttpClient) { 
    this.loadAllData();
        console.log('🚀 Service ChargerDonnees créé');

  }

  // ✅ Utilise combineLatest au lieu de forkJoin
  loadAllData() {
    combineLatest([
      this.http.get<any[]>('assets/data/Clients.json'),
      this.http.get<any[]>('assets/data/Commandes.json'),
      this.http.get<any[]>('assets/data/Employés.json')
    ]).subscribe(([clients, commandes, employes]: [any[], any[], any[]]) => {
  
      const clientsTransformes: Types.Client[] = clients.map(client => ({
        code: client['code'],
        email: client['email'],
        prenom: client['prénom'],
        nom: client['nom'],
        adresse: client['adresse'],
        codePostal: client['code postal'],
        ville: client['ville'],
        latitude: client['latitude'],
        longitude: client['longitude'],
        commandes: [], 
        etat: client['etat'] as Types.EtatClient
      }));
      this.clientsSignal.set(clientsTransformes);

      // Étape 2 : Transformer les commandes (AVEC leurs clients)
      const commandesTransformees: Types.Commande[] = commandes.map(commande => {
        const clientAssocie = clientsTransformes.find(
          c => c.email === commande['client']
        );
        
        return {
          reference: commande['référence'],
          etat: commande['état'] as Types.EtatCommande,
          dateCreation: commande['date de création'],
          note: commande['note'] === '' ? null : Number(commande['note']),
          commentaire: commande['commentaire'],
          client: clientAssocie as Types.Client, // ✅ Cast explicite
          lignes: commande['lignes'].split(',')
        };
      });
      this.commandesSignal.set(commandesTransformees);

      // Étape 3 : Mettre à jour les clients avec leurs commandes
      const clientsAvecCommandes: Types.Client[] = clientsTransformes.map(client => ({
        ...client,
        commandes: commandesTransformees.filter(
          cmd => cmd.client?.email === client.email
        )
      }));
      this.clientsSignal.set(clientsAvecCommandes);

      // Étape 4 : Transformer les employés
      const employesTransformes: Types.Employe[] = employes.map(employe => ({
        trigramme: employe['trigramme'],
        prenom: employe['prenom'],
        nom: employe['nom'],
        photo: employe['photo'],
        telephone: employe['telephone'],
        email: employe['email'],
        emploi: employe['emploi'] as Types.Emploi
      }));
      this.employesSignal.set(employesTransformes);

      console.log('✅ Commandes chargées:', commandesTransformees);
      console.log('✅ Clients chargés:', clientsAvecCommandes);
      console.log('✅ Employés chargés:', employesTransformes);
    });
  }

  // Méthodes de compatibilité
  loadCommandes() {
    // Ne fait rien car tout est chargé dans loadAllData()
    // Conservé pour ne pas casser le code existant
  }

  loadClients() {
    // Idem
  }

  loadEmployes() {
    // Idem
  }}
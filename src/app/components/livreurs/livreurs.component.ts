import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { ChargerDonneesService } from 'app/services/charger-donnees.service';


@Component({
  selector: 'app-livreurs',
  imports: [],
  templateUrl: './livreurs.component.html',
  styleUrl: './livreurs.component.css'
})
export class LivreursComponent {

  private chargeDonnees = inject(ChargerDonneesService);
  private http = inject (HttpClient);
  private firestore= inject(Firestore);
  
async migrerVersFirestore() {
  // Vérification que les données sont chargées
  if (this.chargeDonnees.commandes().length === 0) {
    console.error('❌ Données pas encore chargées, attendez 2-3 secondes');
    return;
  }

  console.log('🚀 Début migration...');

  // Récupérer les données des signals
  const commandes = this.chargeDonnees.commandes();
  const clients = this.chargeDonnees.clients();
  const employes = this.chargeDonnees.employes();

  // Nettoyer les circularités pour les commandes
  const commandesPropres = commandes.map(cmd => ({
    reference: cmd.reference,
    etat: cmd.etat,
    dateCreation: cmd.dateCreation,
    note: cmd.note,
    commentaire: cmd.commentaire,
    clientEmail: cmd.client.email, // ⚠️ Juste l'email, pas tout l'objet
    lignes: cmd.lignes
  }));

  // Nettoyer les circularités pour les clients
  const clientsPropres = clients.map(client => ({
    code: client.code,
    email: client.email,
    prenom: client.prenom,
    nom: client.nom,
    adresse: client.adresse,
    codePostal: client.codePostal,
    ville: client.ville,
    latitude: client.latitude,
    longitude: client.longitude,
    etat: client.etat || "inscrit",
    commandesRefs: client.commandes.map(c => c.reference) // ⚠️ Juste les refs
  }));


  // Les employés sont déjà propres, pas de circularité
const employesPropres = employes.map(emp => {
  const clean: any = {};
  if (emp.trigramme !== undefined) clean.trigramme = emp.trigramme;
  if (emp.prenom !== undefined) clean.prenom = emp.prenom;
  if (emp.nom !== undefined) clean.nom = emp.nom;
  if (emp.photo !== undefined) clean.photo = emp.photo;
  if (emp.telephone !== undefined) clean.telephone = emp.telephone;
  if (emp.email !== undefined) clean.email = emp.email;
  if (emp.emploi !== undefined) clean.emploi = emp.emploi;
  return clean;
});
  // Migrer vers Firestore
  const commandesCol = collection(this.firestore, 'commandes');
  const clientsCol = collection(this.firestore, 'clients');
  const employesCol = collection(this.firestore, 'employes');



 

  for (const emp of employesPropres) {
    await addDoc(employesCol, emp);
  }
  console.log('✅ Employés migrés');

  console.log('🎉 Migration terminée !');
}
}

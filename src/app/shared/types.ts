export interface Journee {
    tournee : Tournee[];
}

export interface Tournee{
    livraisons : Livraison;
}

export interface Livraison{
    client: Client;
    commandes : Commande[];
    etat : EtatLivraison;
    livreur : Employe
}


export type EtatLivraison = "enCours" | "planifiée" | "effectuée" 
export type EtatCommande = "ouverte" | "livrée" | "notée" | "planifiée" | "enLivraison"
export type Emploi = "livreur" | "planificateur"
export type EtatClient = "livré" | "livrable" | "inscrit"
export type Encombrement = "faible" | "moyen" | "fort"

export interface Commande {
    reference: string; 
    etat: EtatCommande; 
    dateCreation: string;  
    note: number | null;  
    commentaire: string;
    client: Client;
    lignes: string[];  
}
export interface Employe {
    trigramme : string;
    prenom : string;
    nom : string;
    photo : string;
    telephone : number;
    email : string;
    emploi : Emploi
}
export interface Client {
     code : string;
     email : string; 
     prenom : string;
     nom : string;
     adresse : string;
     codePostal : number;
     ville : string;
     latitude : string;
     longitude : string;
     commandes : Commande[];
     etat : EtatClient
}
export interface Ligne {
    reference : string;
    commande : Commande;
    produit : Produit;
    quantite: number;
    optionMontage: boolean
}
export interface Produit{
    reference : string;
    photo : string;
    titre : string;
    description : string;
    prix : number;
    optionMontage : boolean;
    tempsDeMontageTheorique : number;
    stocks : number;
    lignes : Ligne[];
    encombrement : Encombrement
}
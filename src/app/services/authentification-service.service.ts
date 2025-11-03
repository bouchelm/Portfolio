import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
  UserCredential
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationServiceService {

  constructor(private auth: Auth) { }

  /**
   * Connexion avec Google via popup
   * @returns Promise avec les UserCredential
   */
  async loginWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result;
    } catch (error: any) {
      console.error('Erreur lors de la connexion Google:', error);
      throw error;
    }
  }

  /**
   * Inscription avec email et mot de passe
   * @param email Email de l'utilisateur
   * @param pass Mot de passe
   * @returns Promise avec les UserCredential
   */
  async registerWithEmail(email: string, pass: string): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, pass);
      return result;
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  /**
   * Connexion avec email et mot de passe
   * @param email Email de l'utilisateur
   * @param pass Mot de passe
   * @returns Promise avec les UserCredential
   */
  async loginWithEmail(email: string, pass: string): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, pass);
      return result;
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  /**
   * Déconnexion de l'utilisateur
   * @returns Promise vide
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  /**
   * Retourne un observable pour suivre l'état de connexion de l'utilisateur
   * @returns Observable<User | null>
   */
  getUserState(): Observable<User | null> {
    return authState(this.auth);
  }
}

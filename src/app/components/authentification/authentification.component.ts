import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthentificationServiceService } from '../../services/authentification-service.service';

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './authentification.component.html',
  styleUrl: './authentification.component.css'
})
export class AuthentificationComponent {
  
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthentificationServiceService,
    private router: Router
  ) {
    console.log('✅ Authentification component chargé');
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Connexion avec email/password
  async onLoginWithEmail() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password } = this.loginForm.value;
      const result = await this.authService.loginWithEmail(email, password);
      
      console.log('✅ Connexion réussie:', result.user);
      this.router.navigate(['/planificateurs']);
      
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      this.errorMessage = this.getErrorMessage(error.code);
    } finally {
      this.isLoading = false;
    }
  }

  // Connexion avec Google
  async onLoginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const result = await this.authService.loginWithGoogle();
      console.log('✅ Connexion Google réussie:', result.user);
      this.router.navigate(['/planificateurs']);
      
    } catch (error: any) {
      console.error('❌ Erreur Google:', error);
      this.errorMessage = 'Erreur lors de la connexion avec Google';
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Adresse email invalide';
      case 'auth/user-disabled':
        return 'Ce compte a été désactivé';
      case 'auth/user-not-found':
        return 'Aucun compte trouvé avec cet email';
      case 'auth/wrong-password':
        return 'Mot de passe incorrect';
      case 'auth/invalid-credential':
        return 'Email ou mot de passe incorrect';
      case 'auth/too-many-requests':
        return 'Trop de tentatives. Réessayez plus tard';
      default:
        return 'Erreur de connexion. Veuillez réessayer';
    }
  }
}
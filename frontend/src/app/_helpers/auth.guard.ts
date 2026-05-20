import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenStorage: TokenStorageService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.tokenStorage.getUser();
    
    // Si connecté
    if (user && Object.keys(user).length !== 0) {
      
      // Vérification des rôles si définis dans les routes
      if (route.data['roles'] && route.data['roles'].indexOf(user.roles[0]) === -1) {
        this.router.navigate(['/']); // redirection accès non autorisé
        return false;
      }
      return true;
    }

    // Non connecté, rediriger vers login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

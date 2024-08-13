import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTokenService } from './auth-token.service';
import{Application, IJwtDecodedToken, IUserDetails} from'../../models/jwt-token';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router, private authTokenService:AuthTokenService,private ngxPermissionsService:NgxPermissionsService) { }
  userLogout(){
    this.clearAll();
    window.self.close(); 
    this.router.navigate(['/login']);
  }
  clearAll(){
    localStorage.clear();
    this.ngxPermissionsService.flushPermissions();
  }
  getUserDetails():IUserDetails{
    const decodedToken: IJwtDecodedToken | any = this.authTokenService.getDecodeToken();
    let userDetails!: IUserDetails;
  
    if (decodedToken != null) {
      userDetails = {
        Id: decodedToken.Id,
        Name: decodedToken.Name,
        Role: decodedToken.Roles[0].Name,
        Level: {
          Id: 8,
          Name: decodedToken.Levels[0].Name,
          Scope: decodedToken.Levels[0].Scope
        }
      };
    }  
    return userDetails;
  }
  isLoggedin() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        return true;
    }
    return false;
  }
}

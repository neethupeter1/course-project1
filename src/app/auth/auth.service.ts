import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpireTime: any;
    
    constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {this.handleAuthentication(
            resData.email, 
            resData.localId,
            resData.idToken,
            +resData.expiresIn
            );
        })
    );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData => {this.handleAuthentication(
            resData.email, 
            resData.localId,
            resData.idToken,
            +resData.expiresIn
            );
        })
    );
    }


    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
            const user = new User(email, userId, token, expirationDate);
            this.user.next(user);
            this.autoLogout(expiresIn * 1000);
            localStorage.setItem('userValue', JSON.stringify(user));
        };
    
    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!';
        if(!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exists.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'this password is not correct.';
                break;
        }
        return throwError(errorMessage);
        }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userValue');
    if(this.tokenExpireTime) {
        clearTimeout(this.tokenExpireTime);
    }
    this.tokenExpireTime = null;
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);
    this.tokenExpireTime = setTimeout(() => {
        this.logout();
    }, expirationDuration);
  }

  autoLogin() {
    const userValue: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
    }  = JSON.parse(localStorage.getItem('userValue'));

    if(!userValue) {
        return;   
    }
    const loadedUser = new User(
        userValue.email, 
        userValue.id, 
        userValue._token, 
        new Date(userValue._tokenExpirationDate)
    );


    if(loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration = new Date(userValue._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
    }
  }
}
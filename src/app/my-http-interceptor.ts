import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private notificationService: NotificationsService) { }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    const authReq = req.clone();

    // send the newly created request
    return next.handle(authReq)
      .catch((error, caught) => {
        // intercept the response error
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userProfile');
          this.notificationService.error('Déconnecté', 'Votre session a expiré.');
          this.router.navigate(['/login']);
        }
        // return the error to the method that called it
        return Observable.throw(error);
      }) as any;
  }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MyNotificationService} from './services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Injectable()
export class MyHttpInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private notificationService: MyNotificationService,
              private translate: TranslateService) { }

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    const authReq = req.clone();

    // send the newly created request
    return next.handle(authReq).pipe(
      catchError(
        (error, caught) => {
          // intercept the response error
          if (error.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userProfile');
            this.notificationService.error(
              _('my-http-interceptor.notifications.session_expired.title'),
              _('my-http-interceptor.notifications.session_expired.content')
            );
            this.router.navigate(['/login']);
          }

          // return the error to the method that called it
          return throwError(error);
        }
      )
    ) as any;
  }
}

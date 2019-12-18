import { Injectable } from '@angular/core';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class MyNotificationService {

  constructor(private notificationService: NotificationsService,
              private translate: TranslateService) { }

  success(title,
          content = null,
          params = null,
          notificationParams = null) {
    const labels = [title];

    if (content) {
      labels.push(content);
    }

    this.translate.get(labels, params).subscribe(
      (translatedLabels: string) => {
        if (content) {
          this.notificationService.success(
            translatedLabels[title],
            translatedLabels[content],
            notificationParams
          );
        } else {
          this.notificationService.success(
            translatedLabels[title]
          );
        }
      }
    );
  }

  error(title, content = null) {
    const labels = [title];

    if (content) {
      labels.push(content);
    }

    this.translate.get(labels).subscribe(
      (translatedLabels: string) => {
        if (content) {
          this.notificationService.error(
            translatedLabels[title],
            translatedLabels[content]
          );
        } else {
          this.notificationService.error(
            translatedLabels[title]
          );
        }
      }
    );
  }
}

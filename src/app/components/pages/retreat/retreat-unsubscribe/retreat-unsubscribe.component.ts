import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Params, Router} from '@angular/router';
import {RetreatWaitingQueueService} from '../../../../services/retreatWaitingQueue.service';
import {map, switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {RetreatWaitingQueue} from '../../../../models/retreatWaitingQueue';
import {Retreat} from '../../../../models/retreat';
import {RetreatService} from '../../../../services/retreat.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-retreat-unsubscribe',
  templateUrl: './retreat-unsubscribe.component.html',
  styleUrls: ['./retreat-unsubscribe.component.scss']
})
export class RetreatUnsubscribeComponent implements OnInit {

  retreatWaitQueue$: Observable<RetreatWaitingQueue>;
  retreat$: Observable<Retreat>;

  constructor(
    private retreatWaitingQueueService: RetreatWaitingQueueService,
    private retreatService: RetreatService,
    private activatedRoute: ActivatedRoute,
    private notificationService: MyNotificationService,
  private router: Router, ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.retreatWaitQueue$ = this.retreatWaitingQueueService.get(+params['id']);

      this.retreatWaitQueue$.subscribe((retreatWaitingQueue: RetreatWaitingQueue) => {
        this.retreat$ = this.retreatService.getByUrl(retreatWaitingQueue.retreat).pipe(
          map((retreatData) => new Retreat(retreatData))
        );
      });
    });


  }

  unsubscribe(retreatWaitingQueue: RetreatWaitingQueue) {
    this.retreatWaitingQueueService.delete(retreatWaitingQueue).subscribe(() => {
      this.notificationService.success(
        _('retreat-unsubscribe.notifications.unsubscribe.title'),
        _('retreat-unsubscribe.notifications.unsubscribe.content')
      );
      this.router.navigate(['']);
    });
  }

}

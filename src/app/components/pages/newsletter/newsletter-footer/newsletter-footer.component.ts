import { Component, OnInit } from '@angular/core';
import {NewsletterService} from '../../../../services/newsletter.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-newsletter-footer',
  templateUrl: './newsletter-footer.component.html',
  styleUrls: ['./newsletter-footer.component.scss']
})
export class NewsletterFooterComponent implements OnInit {

  displayNewsLetter: boolean;
  canHideFooter = environment.canHideFooter;

  inscriptionModalName = 'inscriptionModal';
  inscriptionDone = false;
  inscriptionEmail: string;

  constructor(
    private newsletterService: NewsletterService,
    private myModalService: MyModalService) { }

  ngOnInit() {
    this.displayNewsLetter = !this.newsletterService.isNewsletterHidden;
  }

  hideNewsletter() {
    this.newsletterService.hideNewsletter();
    this.displayNewsLetter = false;
  }

  openNewsletterModal() {
    const modal = this.myModalService.get(this.inscriptionModalName);

    if (!modal) {
      return;
    }
    modal.toggle();
  }

  closeNewsletterModal() {
    const modal = this.myModalService.get(this.inscriptionModalName);

    if (!modal) {
      return;
    }
    modal.close();
  }

  inscriptionSucceed(email: string) {
    this.inscriptionEmail = email;
    this.inscriptionDone = true;
  }

}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {FormUtil} from '../../../../utils/form';
import {NewsletterService} from '../../../../services/newsletter.service';
import {INewsletterInscription} from '../../../../models/newsletterInscription';
import {IFormField} from '../../../shared/form/form.component';

@Component({
  selector: 'app-newsletter-inscription',
  templateUrl: './newsletter-inscription.component.html',
  styleUrls: ['./newsletter-inscription.component.scss']
})
export class NewsletterInscriptionComponent implements OnInit {

  @Output()
  onInscription: EventEmitter<string> = new EventEmitter<string>();

  newsletterForm: FormGroup;
  newsletterErrors;
  newsletterFields: IFormField[] = [
    {
      name: 'first_name',
      type: 'text',
      label: <string>_('newsletter-inscription.labels.first_name')
    },
    {
      name: 'last_name',
      type: 'text',
      label: <string>_('newsletter-inscription.labels.last_name')
    },
    {
      name: 'email',
      type: 'text',
      label: <string>_('newsletter-inscription.labels.email')
    }
  ];

  constructor(
    private newsletterService: NewsletterService,
  ) {
  }

  ngOnInit() {
    const formUtil = new FormUtil();
    this.newsletterForm = formUtil.createFormGroup(this.newsletterFields);
  }

  submitForm() {
    if (this.newsletterForm.valid) {
      const newsletterInscription: INewsletterInscription = this.newsletterForm.value;

      this.newsletterService.newsletterInscription(
        newsletterInscription
      ).subscribe(
        () => {
          this.onInscription.emit(newsletterInscription.email);
        },
        err => {
          if (err.error.non_field_errors) {
            this.newsletterErrors = err.error.non_field_errors;
          }
          this.newsletterForm = FormUtil.manageFormErrors(this.newsletterForm, err);
        }
      );
    }
  }

}

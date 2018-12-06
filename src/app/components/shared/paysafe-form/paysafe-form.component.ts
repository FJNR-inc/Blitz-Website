import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {environment} from '../../../../environments/environment';

declare let paysafe: any;

@Component({
  selector: 'app-paysafe-form',
  templateUrl: './paysafe-form.component.html',
  styleUrls: ['./paysafe-form.component.scss']
})
export class PaysafeFormComponent implements AfterViewInit {

  menuActive = 5;

  API_KEY = environment.token_paysafe;
  OPTIONS = {
    environment: environment.environment_paysafe,
    fields: {
      cardNumber: {
        selector: '#card-number',
        placeholder: ''
      },
      expiryDate: {
        selector: '#expiration-date',
        placeholder: ''
      },
      cvv: {
        selector: '#cvv',
        placeholder: ''
      }
    }
  };
  private paysafeInstance: any;
  error: string[];
  waitPaysafe = false;

  @Output() singleUseToken: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngAfterViewInit() {
    this.initPaysafe();
  }

  initPaysafe() {
    const instance = this;
    paysafe.fields.setup(this.API_KEY, this.OPTIONS, (paysafeInstance: any, error: any) => {
      if (error) {
        this.error = [
          'Il semblerait que nous éprouvons des problèmes avec ' +
          'notre système de vente, veuillez réessayer dans quelques instants.'
        ];
        console.error(`Setup error: [${error.code}] ${error.detailedMessage}`);
        this.waitPaysafe = true;
      } else {
        instance.paysafeInstance = paysafeInstance;
      }
    });
  }

  getToken() {
    this.waitPaysafe = true;
    const instance = this;
    if (!instance.paysafeInstance) {
      console.error('No instance Paysafe');
      this.error = [
        'Il semblerait que nous éprouvons des problèmes avec ' +
        'notre système de vente, veuillez réessayer dans quelques instants.'
      ];
    } else {
      instance.paysafeInstance.tokenize((paysafeInstance: any, error: any, result: any) => {
        if (error) {
          this.error = ['Ces informations bancaires sont invalides'];
          console.error(`Tokenization error: [${error.code}] ${error.detailedMessage}`);
          this.waitPaysafe = false;
        } else {
          this.singleUseToken.emit(result.token);
        }
      });
    }
  }

}

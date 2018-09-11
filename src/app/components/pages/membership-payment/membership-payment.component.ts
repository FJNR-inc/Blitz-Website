import { Component, OnInit } from '@angular/core';
import {Membership} from '../../../models/membership';
import {Order} from '../../../models/order';
import {OrderService} from '../../../services/order.service';
import {OrderLine} from '../../../models/orderLine';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

declare let paysafe: any;

@Component({
  selector: 'app-membership-payment',
  templateUrl: './membership-payment.component.html',
  styleUrls: ['./membership-payment.component.scss']
})
export class MembershipPaymentComponent implements OnInit {

  menu = [
    {
      'name': 'Informations'
    },
    {
      'name': 'Vérification'
    },
    {
      'name': 'Confirmation'
    },
    {
      'name': 'Abonnement'
    },
    {
      'name': 'Résumé'
    },
    {
      'name': 'Paiement'
    }
  ];

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
  buttonDisabled = false;

  membership: Membership = null;

  constructor(private orderService: OrderService,
              private router: Router) { }

  ngOnInit() {
    this.initPaysafe();
    this.membership = new Membership(JSON.parse(localStorage.getItem('selectedMembership')));
  }

  initPaysafe() {
    const instance = this;
    paysafe.fields.setup(this.API_KEY, this.OPTIONS, (paysafeInstance: any, error: any) => {
      if (error) {
        this.error = [
          'Il semblerait que nous éprouvons des problèmes avec ' +
          'notre système de vente, veuillez réessayer dans quelques instants.'
        ];
        this.buttonDisabled = true;
      } else {
        instance.paysafeInstance = paysafeInstance;
      }
    });
  }

  generateOrder() {
    this.buttonDisabled = true;
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
          this.buttonDisabled = false;
        } else {
          const newOrder = new Order(
            {
              'single_use_token': result.token,
              'order_lines': [],
            }
          );
          if (this.membership) {
            newOrder['order_lines'].push(new OrderLine({
                'content_type': 'membership',
                'object_id': this.membership.id,
                'quantity': 1,
              })
            );
          }
          this.orderService.create(newOrder).subscribe(
            response => {
              this.router.navigate(['/membership/done']);
            },
            err => {
              if (err.error.non_field_errors) {
                this.error = [
                  'Il semblerait que nous éprouvons des problèmes avec ' +
                  'notre système de vente, veuillez réessayer dans quelques instants.'
                ];
                this.buttonDisabled = false;
              }
            }
          );
        }
      });
    }
  }

}

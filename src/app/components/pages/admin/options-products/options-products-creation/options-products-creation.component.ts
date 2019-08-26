import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { FormUtil } from '../../../../../utils/form';
import { FormGroup } from '@angular/forms';

import { OptionsProductsService } from '../../../../../services/options-products.service';
import { MyNotificationService } from '../../../../../services/my-notification/my-notification.service';
import {AuthenticationService} from '../../../../../services/authentication.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {OptionProduct} from '../../../../../models/optionProduct';
import {Retreat} from '../../../../../models/retreat';
import {Membership} from '../../../../../models/membership';
import {ReservationPackage} from '../../../../../models/reservationPackage';
import {RetreatService} from '../../../../../services/retreat.service';
import {MembershipService} from '../../../../../services/membership.service';
import {ReservationPackageService} from '../../../../../services/reservation-package.service';

@Component({
  selector: 'app-options-products-creation',
  templateUrl: './options-products-creation.component.html',
  styleUrls: ['./options-products-creation.component.scss']
})
export class OptionsProductsCreationComponent implements OnInit {

  fields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('shared.form.optionsproducts.name_fr')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('shared.form.optionsproducts.name_en')
    },
    {
      name: 'price',
      type: 'number',
      label: _('shared.form.optionsproducts.price')
    },
    {
      name: 'max_quantity',
      type: 'number',
      label: _('shared.form.optionsproducts.max_quantity')
    },
    {
      name: 'available',
      type: 'checkbox',
      label: _('shared.form.optionsproducts.available')
    },
    {
      name: 'details_fr',
      type: 'text',
      label: _('shared.form.optionsproducts.details_fr')
    },
    {
      name: 'details_en',
      type: 'text',
      label: _('shared.form.optionsproducts.details_en')
    }
  ];

  listTypeOfProduct: any[] = [
    {
      name: 'Retraites',
      value: 'retreat'
    },
    {
      name: 'Memberships',
      value: 'membership'
    },
    {
      name: 'Bloc de rédactions',
      value: 'timeslot'
    },
    {
      name: 'Packages',
      value: 'package'
    }
  ];
  selectedTypeOfProduct: any[] = [];

  listRetreats: Retreat[] = [];
  selectedRetreats: Retreat[] = [];

  listMemberships: Membership[] = [];
  selectedMemberships: Membership[] = [];

  listPackages: ReservationPackage[] = [];
  selectedPackages: ReservationPackage[] = [];

  optionProduitForm: FormGroup;
  optionProduitErrors: string[];
  optionProduct: OptionProduct;

  constructor(
    private  optionsProductsService: OptionsProductsService,
    private router: Router,
    private notificationService: MyNotificationService,
    private authenticationService: AuthenticationService,
    private retreatService: RetreatService,
    private membershipService: MembershipService,
    private packageService: ReservationPackageService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.refreshRetreatList();
    this.refreshMembershipList();
    this.refreshPackageList();

    const formUtil = new FormUtil();
    this.optionProduitForm = formUtil.createFormGroup(this.fields);

    this.activatedRoute.params.subscribe((params: Params) => {
      this.optionsProductsService.get(params['id']).subscribe(
        data => {
          this.optionProduct = new OptionProduct(data);
          this.optionProduitForm.controls['name_fr'].setValue(this.optionProduct.name_fr);
          this.optionProduitForm.controls['name_en'].setValue(this.optionProduct.name_en);
          this.optionProduitForm.controls['price'].setValue(this.optionProduct.price);
          this.optionProduitForm.controls['max_quantity'].setValue(this.optionProduct.max_quantity);
          this.optionProduitForm.controls['available'].setValue(this.optionProduct.available);
          this.optionProduitForm.controls['details_fr'].setValue(this.optionProduct.details_fr);
          this.optionProduitForm.controls['details_en'].setValue(this.optionProduct.details_en);

          this.selectedRetreats = this.setSelectedRetreats();
          this.selectedPackages = this.setSelectedPackages();
          this.selectedMemberships = this.setSelectedMemberships();
          this.selectedTypeOfProduct = this.setSelectedTypeOfProduct();
        }
      );
    });
  }

  refreshRetreatList(search = null) {
    let filters = null;
    if (search) {
      filters = [
        {
          'name': 'name',
          'value': search
        }
      ];
    }
    this.retreatService.list(filters).subscribe(
      retreats => {
        this.listRetreats = retreats.results.map(o => new Retreat(o));
      }
    );
  }

  refreshMembershipList() {
    this.membershipService.list().subscribe(
      memberships => {
        this.listMemberships = memberships.results.map(m => new Membership(m));
      }
    );
  }

  refreshPackageList() {
    this.packageService.list().subscribe(
      packages => {
        this.listPackages = packages.results.map(p => new ReservationPackage(p));
      }
    );
  }

  setSelectedRetreats() {
    const selectedRetreats = [];
    if (this.optionProduct.available_on_products) {
      for (const retreat of this.optionProduct.available_on_products) {
        this.retreatService.get(+retreat).subscribe(
          data => {
            selectedRetreats.push(data);
          },
          err => {
            console.error('Aucune retraite dans la liste des produits');
          }
        );
      }
    }
    return selectedRetreats;
  }

  getSelectedRetreats() {
    const selectedRetreats = [];
      for (const retreat of this.selectedRetreats) {
        selectedRetreats.push(retreat.id);
      }
    return selectedRetreats;
  }

  setSelectedMemberships() {
    const selectedMemberships = [];
    if (this.optionProduct.available_on_products) {
      for (const membership of this.optionProduct.available_on_products) {
        this.membershipService.get(+membership).subscribe(
          data => {
            selectedMemberships.push(data);
          },
          err => {
            console.error('Aucun membership dans la liste des produits');
          }
        );
      }
    }
    return selectedMemberships;
  }

  getSelectedMemberships() {
    const selectedMemberships = [];
    // if()
    for (const memberships of this.selectedMemberships) {
      selectedMemberships.push(memberships.id);
    }
    return selectedMemberships;
  }

  getSelectedPackages() {
    const selectedPackages = [];
    for (const packageItem of this.selectedPackages) {
        selectedPackages.push(packageItem.id);
    }
    return selectedPackages;
  }

  setSelectedPackages() {
    const selectedPackages = [];
    if (this.optionProduct.available_on_products) {
      for (const packageItem of this.optionProduct.available_on_products) {
        this.packageService.get(+packageItem).subscribe(
          data => {
            selectedPackages.push(data);
          },
          err => {
            console.error('Aucun packages dans la liste des produits');
          }
        );
      }
    }
    return selectedPackages;
  }

  getSelectedTypeOfProduct() {
    const selectedTypeOfProduct = [];
    for (const typeOfProduct of this.selectedTypeOfProduct) {
      selectedTypeOfProduct.push(typeOfProduct.value);
    }
    return selectedTypeOfProduct;
  }

  setSelectedTypeOfProduct() {
    const selectedTypeOfProduct = [];
    for (const typeOfProduct of this.optionProduct.available_on_product_types) {
      for (const availableTypeOfProduct of this.listTypeOfProduct) {
        if (availableTypeOfProduct.value === typeOfProduct) {
          selectedTypeOfProduct.push(availableTypeOfProduct);
        }
      }
    }
    return selectedTypeOfProduct;
  }

  submitOptionProduct() {
    if ( this.optionProduitForm.valid ) {
      const value = this.optionProduitForm.value;
      value['owner'] = this.authenticationService.getProfile().url;
      value['available_on_product_types'] = this.getSelectedTypeOfProduct();
      value['available_on_products'] = this.getSelectedRetreats().concat(this.getSelectedMemberships(), this.getSelectedPackages());

      if (this.optionProduct) {
        this.optionsProductsService.update(this.optionProduct.url, value).subscribe(
          data => {
            this.notificationService.success(
              _('shared.notifications.commons.updated.title')
            );
            this.router.navigate(['/admin/options_products']);
          },
          err => {
            if (err.error.non_field_errors) {
              this.optionProduitErrors = err.error.non_field_errors;
            } else {
              this.optionProduitErrors =  ['shared.form.errors.unknown'];
            }
            this.optionProduitForm = FormUtil.manageFormErrors(this.optionProduitForm, err);
          }
        );
      } else {
        this.optionsProductsService.create(value).subscribe(
          data => {
            this.notificationService.success(
              _('shared.notifications.commons.added.title')
            );
            this.router.navigate(['/admin/options_products']);
          },
          err => {
            if (err.error.non_field_errors) {
              this.optionProduitErrors = err.error.non_field_errors;
            } else {
              this.optionProduitErrors =  ['shared.form.errors.unknown'];
            }
            this.optionProduitForm = FormUtil.manageFormErrors(this.optionProduitForm, err);
          }
        );
      }
    }
  }

  filterRetreats(search) {
    this.refreshRetreatList(search);
  }
}

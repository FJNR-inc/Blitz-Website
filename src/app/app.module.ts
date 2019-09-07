import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import localeFr from '@angular/common/locales/fr';

import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { ForgotPasswordPageComponent } from './components/pages/forgot-password-page/forgot-password-page.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { ReservationPageComponent } from './components/pages/reservation-page/reservation-page.component';
import { CalendarModule } from 'angular-calendar';
import { LogoutPageComponent } from './components/pages/logout-page/logout-page.component';
import { AcademicFieldService } from './services/academic-field.service';
import { AcademicLevelService } from './services/academic-level.service';
import { OrganizationService } from './services/organization.service';
import { UsersPageComponent } from './components/pages/admin/users-page/users-page.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MyTableComponent } from './components/my-table/my-table.component';
import { MyHttpInterceptor } from './my-http-interceptor';
import { UserPageComponent } from './components/pages/admin/user-page/user-page.component';
import { OrganizationsPageComponent } from './components/pages/admin/organizations-page/organizations-page.component';
import { AcademicsPageComponent } from './components/pages/admin/academics-page/academics-page.component';
import { MyModalService } from './services/my-modal/my-modal.service';
import { RegisterConfirmationPageComponent } from './components/pages/register-confirmation-page/register-confirmation-page.component';
import { ActivationPageComponent } from './components/pages/activation-page/activation-page.component';
import { CanActivateViaAuthGuard } from './guards/CanActivateViaAuthGuard';
import { CanAccessAdminPanelGuard } from './guards/CanAccessAdminPanelGuard';
// tslint:disable-next-line:max-line-length
import {
  ForgotPasswordConfirmationPageComponent
} from './components/pages/forgot-password-confirmation-page/forgot-password-confirmation-page.component';
import { ResetPasswordPageComponent } from './components/pages/reset-password-page/reset-password-page.component';
import { WorkplaceService } from './services/workplace.service';
import { WorkplacesComponent } from './components/pages/admin/workplaces/workplaces.component';
import { ProfileService } from './services/profile.service';
import { TimeSlotService } from './services/time-slot.service';
import { registerLocaleData } from '@angular/common';
import { PermissionsDirective } from './directives/permissions.directive';
import { WorkplaceComponent } from './components/pages/admin/workplace/workplace.component';
import { AuthenticatedDirective } from './directives/authenticated.directive';
import { Error403Component } from './components/error-403/error-403.component';
import { OrganizationComponent } from './components/pages/admin/organization/organization.component';
import { DomainService } from './services/domain.service';
import { PeriodService } from './services/period.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PeriodComponent } from './components/pages/admin/period/period.component';
import { MembershipService } from './services/membership.service';
import { ReservationPackageService } from './services/reservation-package.service';
import { MembershipsComponent } from './components/pages/admin/memberships/memberships.component';
// tslint:disable-next-line:max-line-length
import { ReservationPackagesComponent } from './components/pages/admin/reservation-packages/reservation-packages.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { MyModalOpenDirective } from './directives/my-modal-open-directive.directive';
import { TimeslotComponent } from './components/pages/admin/timeslot/timeslot.component';
import { PictureService } from './services/picture.service';
import { ImageUploadModule } from 'angular2-image-upload';
import { CardService } from './services/card.service';
import { BackgroundLayoutComponent } from './layouts/background-layout/background-layout.component';
import { OrderService } from './services/order.service';
import { MembershipComponent } from './components/pages/membership/membership.component';
import { NewLayoutComponent } from './layouts/new-layout/new-layout.component';
import { NewBackgroundLayoutComponent } from './layouts/new-background-layout/new-background-layout.component';
import { MembershipRegisterComponent } from './components/pages/membership-register/membership-register.component';
import { NtWizzardComponent } from './components/nt-wizzard/nt-wizzard.component';
import { MembershipIntroComponent } from './components/pages/membership-intro/membership-intro.component';
import { MembershipVerificationComponent } from './components/pages/membership-verification/membership-verification.component';
import { MembershipConfirmationComponent } from './components/pages/membership-confirmation/membership-confirmation.component';
import { MembershipSubscriptionComponent } from './components/pages/membership-subscription/membership-subscription.component';
import { MembershipSummaryComponent } from './components/pages/membership-summary/membership-summary.component';
import { MembershipDoneComponent } from './components/pages/membership-done/membership-done.component';
import { MembershipPaymentComponent } from './components/pages/membership-payment/membership-payment.component';
import { NtModalComponent } from './components/nt-modal/nt-modal.component';
import { NtHeaderComponent } from './components/nt-header/nt-header.component';
import { TermsComponent } from './components/modal/terms/terms.component';
import { NtTopComponent } from './components/nt-top/nt-top.component';
import { LoaderComponent } from './components/loader/loader.component';
import {TablePeriodsComponent} from './components/table/periods/table-periods.component';
import {ReservationService} from './services/reservation.service';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {InternationalizationService} from './services/internationalization.service';
import {MyNotificationService} from './services/my-notification/my-notification.service';
import { FormComponent } from './components/shared/form/form.component';
import { AlertComponent } from './components/shared/alert/alert.component';
import { ExportComponent } from './components/pages/admin/export/export.component';
import {OrderLineService} from './services/order-line.service';
import {CustomPaymentsService} from './services/custom-payments.service';
import { PaysafeFormComponent } from './components/shared/paysafe-form/paysafe-form.component';
import { CalendarIconComponent } from './components/shared/calendar-icon/calendar-icon.component';
// tslint:disable-next-line:max-line-length
import { DesignDocumentationComponent } from './components/pages/admin/design-documentation/design-documentation.component';
import { DesignDocumentationSectionComponent } from './components/pages/admin/design-documentation/design-documentation-section/design-documentation-section.component';
import { RetreatReservationComponent } from './components/pages/retreat/retreat-reservation/retreat-reservation.component';
import { RetreatTutorialComponent } from './components/pages/retreat/retreat-tutorial/retreat-tutorial.component';
import { RetreatListComponent } from './components/pages/retreat/retreat-list/retreat-list.component';
import { RetreatCartComponent } from './components/pages/retreat/retreat-cart/retreat-cart.component';
// tslint:disable-next-line:max-line-length
import { RetreatListItemComponent } from './components/pages/retreat/retreat-list/retreat-list-item/retreat-list-item.component';
import { LoginFormComponent } from './components/shared/forms/login-form/login-form.component';
import { IconInfoComponent } from './components/shared/icon-info/icon-info.component';
import {MyCartService} from './services/my-cart/my-cart.service';
import {RetreatService} from './services/retreat.service';
import { CartSummaryComponent } from './components/shared/cart-summary/cart-summary.component';
import { NtHeaderSubComponent } from './components/nt-header/nt-header-sub/nt-header-sub.component';
import { RetreatsComponent } from './components/pages/admin/retreats/retreats.component';
import { RetreatComponent } from './components/pages/admin/retreat/retreat.component';
import {RetreatReservationService} from './services/retreat-reservation.service';
// tslint:disable-next-line:max-line-length
import { TableRetreatReservationsComponent } from './components/table/table-retreat-reservations/table-retreat-reservations.component';
import { CartPaymentComponent } from './components/shared/cart-payment/cart-payment.component';
import {CouponService} from './services/coupon.service';
import { CouponsComponent } from './components/pages/admin/coupons/coupons.component';
import {RetreatWaitingQueueService} from './services/retreatWaitingQueue.service';
import { ProfileCardsComponent } from './components/pages/profile/profile-cards/profile-cards.component';
import { ProfileDeactivateComponent } from './components/pages/profile/profile-deactivate/profile-deactivate.component';
import { ProfileSubscriptionComponent } from './components/pages/profile/profile-subscription/profile-subscription.component';
import { ProfileTimeslotsComponent } from './components/pages/profile/profile-timeslots/profile-timeslots.component';
import { ProfileRetreatsComponent } from './components/pages/profile/profile-retreats/profile-retreats.component';
import { ProfileTomatoesComponent } from './components/pages/profile/profile-tomatoes/profile-tomatoes.component';
import { ProfileStatsComponent } from './components/pages/profile/profile-stats/profile-stats.component';
import { ProfileEditComponent } from './components/pages/profile/profile-edit/profile-edit.component';
import {RetreatWaitingQueueNotificationService} from './services/retreatWaitingQueueNotification.service';
import {MultiselectModule} from '@rignonnoel/angular-multiselect';
import { CouponsCreationComponent } from './components/pages/admin/coupons/coupons-creation/coupons-creation.component';
import { ProfileCouponsComponent } from './components/pages/profile/profile-coupons/profile-coupons.component';
import { GeneralComponent } from './components/pages/admin/general/general.component';
import { ValidateEmailComponent } from './components/pages/validate-email/validate-email.component';
import { ChartJSComponent } from './components/shared/chart-js/chart-js.component';
import {ChartsModule} from 'ng2-charts';
import {
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSlideToggleModule
} from '@angular/material';
import {RetreatUnsubscribeComponent} from './components/pages/retreat/retreat-unsubscribe/retreat-unsubscribe.component';
import { RetreatInvitationComponent } from './components/pages/admin/retreat-invitation/retreat-invitation.component';
import { OptionsProductsComponent} from './components/pages/admin/options-products/options-products.component';
import {
  OptionsProductsCreationComponent
} from './components/pages/admin/options-products/options-products-creation/options-products-creation.component';
import { HiddenRetreatComponent } from './components/pages/hidden-retreat/hidden-retreat.component';
import {LightLayoutComponent} from './layouts/light-layout/light-layout.component';
import { RetreatPreviewComponent } from './components/shared/retreat-preview/retreat-preview.component';
import { TitleComponent } from './components/shared/title/title.component';
import { ButtonComponent } from './components/shared/button/button.component';
import { ProductSelectorPanelComponent } from './components/shared/product-selector-panel/product-selector-panel.component';
import { LinkComponent } from './components/shared/link/link.component';
import { AuthenticationPanelComponent } from './components/shared/authentication-panel/authentication-panel.component';
import { CartPanelComponent } from './components/shared/cart-panel/cart-panel.component';
import { PaymentFlowComponent } from './components/pages/payment-flow/payment-flow.component';
import { PaymentFlowWizardComponent } from './components/pages/payment-flow/payment-flow-wizard/payment-flow-wizard.component';
import { PaymentFlowMembershipComponent } from './components/pages/payment-flow/payment-flow-membership/payment-flow-membership.component';
// tslint:disable-next-line:max-line-length
import { PaymentFlowInformationsComponent } from './components/pages/payment-flow/payment-flow-informations/payment-flow-informations.component';
import { PaymentFlowBourseComponent } from './components/pages/payment-flow/payment-flow-bourse/payment-flow-bourse.component';
import { PaymentFlowModeComponent } from './components/pages/payment-flow/payment-flow-mode/payment-flow-mode.component';
// tslint:disable-next-line:max-line-length
import { PaymentFlowConfirmationComponent } from './components/pages/payment-flow/payment-flow-confirmation/payment-flow-confirmation.component';
import {Error404Component} from './components/error-404/error-404.component';
import {RetreatInvitationService} from './services/retreatInvitation.service';
import { CartButtonComponent } from './components/shared/cart-button/cart-button.component';
import { PaymentSuccessfulComponent } from './components/pages/payment-successful/payment-successful.component';

registerLocaleData(localeFr);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const appRoutes = [
  {
    path: '',
    component: NewLayoutComponent,
    children: [
      {
        path: '',
        component: MembershipComponent,
      },
      {
        path: 'home',
        component: HomePageComponent,
      },
      {
        path: 'reservation/:id',
        component: ReservationPageComponent,
      },

      {
        path: 'retreats',
        component: RetreatReservationComponent,
      },
      {
        path: 'retirements',
        redirectTo: '/retreats'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [
          CanActivateViaAuthGuard,
        ]
      },
      {
        path: 'validate/email/:token',
        component: ValidateEmailComponent,
        canActivate: [
          CanActivateViaAuthGuard,
        ]
      },
      {
        path: 'payment',
        component: PaymentFlowComponent,
        canActivate: [
          CanActivateViaAuthGuard,
        ]
      },
      {
        path: 'payment-successful',
        component: PaymentSuccessfulComponent,
        canActivate: [
          CanActivateViaAuthGuard,
        ]
      }
    ]
  },
  {
    path: '',
    component: NewBackgroundLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
      },
      {
        path: 'login/:lastUrl',
        component: LoginPageComponent,
      },
      {
        path: 'logout',
        component: LogoutPageComponent,
      },
      {
        path: 'register',
        component: RegisterPageComponent,
      },
      {
        path: 'register/confirmation',
        component: RegisterConfirmationPageComponent,
      },
      {
        path: 'register/activation/:token',
        component: ActivationPageComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordPageComponent,
      },
      {
        path: 'forgot-password/confirmation',
        component: ForgotPasswordConfirmationPageComponent,
      },
      {
        path: 'reset-password/:token',
        component: ResetPasswordPageComponent,
      },
      {
        path: 'membership/intro',
        component: MembershipIntroComponent,
      },
      {
        path: 'membership/register',
        component: MembershipRegisterComponent,
      },
      {
        path: 'membership/verification',
        component: MembershipVerificationComponent,
      },
      {
        path: 'membership/confirmation/:token',
        component: MembershipConfirmationComponent,
      },
      {
        path: 'membership/subscription',
        component: MembershipSubscriptionComponent,
        canActivate: [
          CanActivateViaAuthGuard,
        ]
      },
      {
        path: 'membership/summary',
        component: MembershipSummaryComponent,
        canActivate: [
          CanActivateViaAuthGuard,
        ]
      },
      {
        path: 'membership/payment',
        component: MembershipPaymentComponent,
        canActivate: [
          CanActivateViaAuthGuard,
        ]
      },
      {
        path: 'membership/done',
        component: MembershipDoneComponent,
        canActivate: [
          CanActivateViaAuthGuard,
        ]
      },
      {
        path: 'wait_queue/:id/unsubscribe',
        component: RetreatUnsubscribeComponent,
        canActivate: [
          CanActivateViaAuthGuard,
        ]
      }
    ]
  },
  {
    path: '',
    component: LightLayoutComponent,
    children: [
      {
        path: 'hiddenRetreat/:token',
        component: HiddenRetreatComponent,
      },
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '403',
        component: Error403Component,
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'admin',
        component: GeneralComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/documentation',
        component: DesignDocumentationComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/users',
        component: UsersPageComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/users/:id',
        component: UserPageComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/organizations',
        component: OrganizationsPageComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/organization/:id',
        component: OrganizationComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/academics',
        component: AcademicsPageComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/workplaces',
        component: WorkplacesComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/coupons',
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ],
        children: [
          {
            path: '',
            component: CouponsComponent,
            canActivate: [
              CanActivateViaAuthGuard,
              CanAccessAdminPanelGuard,
            ]
          },
          {
            path: 'create',
            component: CouponsCreationComponent,
            canActivate: [
              CanActivateViaAuthGuard,
              CanAccessAdminPanelGuard,
            ]
          },
          {
            path: 'edit/:id',
            component: CouponsCreationComponent,
            canActivate: [
              CanActivateViaAuthGuard,
              CanAccessAdminPanelGuard,
            ]
          }
        ],
      },
      {
        path: 'admin/options_products',
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ],
        children: [
          {
            path: '',
            component: OptionsProductsComponent,
            canActivate: [
              CanActivateViaAuthGuard,
              CanAccessAdminPanelGuard,
            ]
          },
          {
            path: 'create',
            component: OptionsProductsCreationComponent,
            canActivate: [
              CanActivateViaAuthGuard,
              CanAccessAdminPanelGuard,
            ]
          },
          {
            path: 'edit/:id',
            component: OptionsProductsCreationComponent,
            canActivate: [
              CanActivateViaAuthGuard,
              CanAccessAdminPanelGuard,
            ]
          }
        ],
      },
      {
        path: 'admin/workplaces/:id',
        component: WorkplaceComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/periods/:id',
        component: PeriodComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/memberships',
        component: MembershipsComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/offers',
        component: ReservationPackagesComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/timeslot/:id',
        component: TimeslotComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/retreats',
        component: RetreatsComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/retreats/:id',
        component: RetreatComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
      {
        path: 'admin/export',
        component: ExportComponent,
        canActivate: [
          CanActivateViaAuthGuard,
          CanAccessAdminPanelGuard,
        ]
      },
    ]
  },
  {
    path: '',
    component: NewLayoutComponent,
    children: [
      {
        path: '**',
        component: Error404Component,
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    AdminLayoutComponent,
    BackgroundLayoutComponent,
    NewBackgroundLayoutComponent,
    NewLayoutComponent,
    NtWizzardComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ForgotPasswordPageComponent,
    ReservationPageComponent,
    LogoutPageComponent,
    UsersPageComponent,
    MyTableComponent,
    UserPageComponent,
    OrganizationsPageComponent,
    AcademicsPageComponent,
    RegisterConfirmationPageComponent,
    ActivationPageComponent,
    ForgotPasswordConfirmationPageComponent,
    ResetPasswordPageComponent,
    WorkplacesComponent,
    PermissionsDirective,
    WorkplaceComponent,
    AuthenticatedDirective,
    Error403Component,
    OrganizationComponent,
    PeriodComponent,
    MembershipsComponent,
    ReservationPackagesComponent,
    ProfileComponent,
    MyModalOpenDirective,
    TimeslotComponent,
    MembershipComponent,
    MembershipRegisterComponent,
    NtWizzardComponent,
    MembershipIntroComponent,
    MembershipVerificationComponent,
    MembershipConfirmationComponent,
    MembershipSubscriptionComponent,
    MembershipSummaryComponent,
    MembershipDoneComponent,
    MembershipPaymentComponent,
    NtModalComponent,
    NtHeaderComponent,
    TermsComponent,
    NtTopComponent,
    LoaderComponent,
    TablePeriodsComponent,
    FileUploadComponent,
    FormComponent,
    AlertComponent,
    ExportComponent,
    PaysafeFormComponent,
    CalendarIconComponent,
    DesignDocumentationComponent,
    DesignDocumentationSectionComponent,
    RetreatReservationComponent,
    RetreatTutorialComponent,
    RetreatListComponent,
    RetreatCartComponent,
    RetreatListItemComponent,
    LoginFormComponent,
    IconInfoComponent,
    CartSummaryComponent,
    NtHeaderSubComponent,
    RetreatsComponent,
    RetreatComponent,
    TableRetreatReservationsComponent,
    CartPaymentComponent,
    CouponsComponent,
    ProfileCardsComponent,
    ProfileDeactivateComponent,
    ProfileSubscriptionComponent,
    ProfileTimeslotsComponent,
    ProfileRetreatsComponent,
    ProfileTomatoesComponent,
    ProfileStatsComponent,
    ProfileEditComponent,
    CouponsCreationComponent,
    ProfileCouponsComponent,
    GeneralComponent,
    ValidateEmailComponent,
    ChartJSComponent,
    RetreatUnsubscribeComponent,
    RetreatInvitationComponent,
    RetreatUnsubscribeComponent,
    OptionsProductsComponent,
    OptionsProductsCreationComponent,
    HiddenRetreatComponent,
    LightLayoutComponent,
    RetreatPreviewComponent,
    TitleComponent,
    ButtonComponent,
    ProductSelectorPanelComponent,
    LinkComponent,
    AuthenticationPanelComponent,
    CartPanelComponent,
    PaymentFlowComponent,
    PaymentFlowWizardComponent,
    PaymentFlowMembershipComponent,
    PaymentFlowInformationsComponent,
    PaymentFlowBourseComponent,
    PaymentFlowModeComponent,
    PaymentFlowConfirmationComponent,
    Error404Component,
    CartButtonComponent,
    PaymentSuccessfulComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    ),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    CalendarModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ImageUploadModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MultiselectModule,
    ChartsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    CanActivateViaAuthGuard,
    CanAccessAdminPanelGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true,
    },
    MyModalService,
    UserService,
    AuthenticationService,
    AcademicFieldService,
    AcademicLevelService,
    OrganizationService,
    WorkplaceService,
    ProfileService,
    TimeSlotService,
    DomainService,
    PeriodService,
    MembershipService,
    ReservationPackageService,
    PictureService,
    CardService,
    OrderService,
    OrderLineService,
    ReservationService,
    InternationalizationService,
    MyNotificationService,
    CustomPaymentsService,
    MyCartService,
    RetreatService,
    RetreatReservationService,
    CouponService,
    RetreatWaitingQueueService,
    RetreatWaitingQueueNotificationService,
    RetreatInvitationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

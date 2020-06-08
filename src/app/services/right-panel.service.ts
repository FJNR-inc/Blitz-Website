import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Retreat} from '../models/retreat';
import {TimeSlot} from '../models/timeSlot';

@Injectable({
  providedIn: 'root'
})
export class RightPanelService {

  public product: Retreat | TimeSlot;

  private _currentPanel: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public currentPanel$: Observable<string> = this._currentPanel.asObservable();

  private _displayCartButton: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public displayCartButton$: Observable<boolean> = this._displayCartButton.asObservable();

  private _authenticate: Subject<boolean> = new Subject<boolean>();
  public authenticate$: Observable<boolean> = this._authenticate.asObservable();

  private _finalize: Subject<boolean> = new Subject<boolean>();
  public finalize$: Observable<boolean> = this._finalize.asObservable();

  constructor() {
    this.currentPanel$.subscribe(
      (currentPanel: string) => {
        this._displayCartButton.next(!currentPanel);
      }
    );
  }

  closePanel() {
    this._currentPanel.next(null);
  }

  openCartPanel() {
    this._currentPanel.next('cart');
  }

  openProductSelectorPanel(product: Retreat | TimeSlot) {
    this.product = product;
    this._currentPanel.next('product-selector');
  }

  openAuthenticationPanel() {
    this._currentPanel.next('authentication');
  }

  authenticate() {
    this._authenticate.next(true);
  }

  finalize() {
    this._finalize.next(true);
  }
}

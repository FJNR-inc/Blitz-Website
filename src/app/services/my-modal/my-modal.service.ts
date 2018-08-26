import { MyModalComponent } from '../../components/my-modal/my-modal.component';
import { Injectable } from '@angular/core';
import {NtModalComponent} from '../../components/nt-modal/nt-modal.component';

@Injectable()
export class MyModalService {
  map: Map<string, MyModalComponent|NtModalComponent> = new Map;

  get(v: string): MyModalComponent|NtModalComponent {
    return this.map.get(v);
  }

  set(key: string, v: MyModalComponent|NtModalComponent): void {
    this.map.set(key, v);
  }
}

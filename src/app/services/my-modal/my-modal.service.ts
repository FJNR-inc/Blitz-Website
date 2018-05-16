import { MyModalComponent } from '../../components/my-modal/my-modal.component';
import { Injectable } from '@angular/core';

@Injectable()
export class MyModalService {
  map: Map<string, MyModalComponent> = new Map;

  get(v: string): MyModalComponent {
    return this.map.get(v);
  }

  set(key: string, v: MyModalComponent): void {
    this.map.set(key, v);
  }
}

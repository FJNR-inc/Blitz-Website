import { Injectable } from '@angular/core';
import {NtModalComponent} from '../../components/nt-modal/nt-modal.component';

@Injectable()
export class MyModalService {
  map: Map<string, NtModalComponent> = new Map;

  get(v: string): NtModalComponent {
    return this.map.get(v);
  }

  set(key: string, v: NtModalComponent): void {
    this.map.set(key, v);
  }
}

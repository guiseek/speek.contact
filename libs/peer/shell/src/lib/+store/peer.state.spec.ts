import { TestBed } from '@angular/core/testing';

import { PeerState } from './peer.state';
describe('PeerState', () => {
  let service: PeerState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeerState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

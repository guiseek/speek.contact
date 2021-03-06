import { ChangeDetectorRef, Component, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { DataContact, PeerContact } from '@speek/contact/ports';
import { ActivatedRoute } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

type InputTarget<T = HTMLInputElement> =
  | EventTarget
  | null
  | (HTMLInputElement & { files: FileList });

@Component({
  templateUrl: './contact-feature.container.html',
  styleUrls: ['./contact-feature.container.scss'],
  viewProviders: [],
})
export class ContactFeatureContainer implements AfterViewInit, OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    readonly media: MediaMatcher,
    readonly route: ActivatedRoute,
    readonly peerContact: PeerContact,
    readonly dataContact: DataContact,
    changeDetectorRef: ChangeDetectorRef,
    readonly elRef: ElementRef<HTMLElement>,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngAfterViewInit(): void {
    this.peerContact.connect();
  }

  onConnect() {
    this.peerContact.on('iceCandidateChange', ({ candidate }) => {
      console.log(candidate);
    });
    this.peerContact.on('track', (track) => {
      console.log(track);
    });
  }

  onFileChange(target: InputTarget) {
    console.log(target);

    const files = (target as HTMLInputElement).files;
    const file = files?.item(0);
    if (files?.length && file) {
      const channel = this.dataContact.create(this.peerContact.peer, file.name);
      channel.onopen = () => {
        this.dataContact.sendFile(channel, file)
      }
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}

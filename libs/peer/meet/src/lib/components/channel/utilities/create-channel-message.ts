import {Injector, ViewContainerRef} from '@angular/core'
import {ChannelMessageComponent} from '../channel-message/channel-message.component'

export function createChannelMessage(
  viewContainerRef: ViewContainerRef,
  sender: RTCDataChannel,
  channel: RTCDataChannel,
  meet: string
) {
  viewContainerRef.clear()

  const providers = [
    {provide: 'sender', useValue: sender},
    {provide: 'channel', useValue: channel},
    {provide: 'meet', useValue: meet},
  ]

  const injector = Injector.create({providers})

  viewContainerRef.createComponent<ChannelMessageComponent>(
    ChannelMessageComponent,
    {injector}
  )
}

import {
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets'
import {SignalEvent, SignalMessage} from '@speek/peer/data'
import {Server, Socket} from 'socket.io'

@WebSocketGateway({cors: true})
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server

  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit(SignalEvent.Connection, {id: client.id})
  }

  @SubscribeMessage(SignalEvent.KnockKnock)
  knockKnock(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: SignalMessage
  ) {
    console.log(payload);

    const room = this.takeOrStartRoom(payload)
    if (room.length >= 0 && room.length < 2) {
      contact.emit(SignalEvent.Available, true)
    } else {
      contact.emit(SignalEvent.Available, false)
    }
  }

  @SubscribeMessage(SignalEvent.Message)
  onMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: SignalMessage
  ) {
    console.log(payload);
    if (socket.rooms.has(payload.call)) {
      socket.to(payload.call).emit(SignalEvent.Message, payload)
    } else {
      socket.join(payload.call)
      socket.broadcast.emit(SignalEvent.Message, payload)
    }
  }

  private takeOrStartRoom({call}: SignalMessage) {
    const adapter = this.server.sockets.adapter
    return adapter.rooms[call] ?? {length: 0}
  }
}

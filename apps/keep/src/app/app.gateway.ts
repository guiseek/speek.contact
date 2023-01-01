import {
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets'
import {PeerMessage, SignalingEvent} from '@speek/type'
import {Server, Socket} from 'socket.io'

@WebSocketGateway({cors: true})
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server

  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit(SignalingEvent.Connection, {id: client.id})
  }

  @SubscribeMessage(SignalingEvent.KnockKnock)
  knockKnock(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: PeerMessage
  ) {
    console.log(payload)

    const room = this.takeOrStartRoom(payload)
    if (room.length >= 0 && room.length < 2) {
      contact.emit(SignalingEvent.Available, true)
    } else {
      contact.emit(SignalingEvent.Available, false)
    }
  }

  @SubscribeMessage(SignalingEvent.Message)
  onMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: PeerMessage
  ) {
    console.log(payload)
    if (socket.rooms.has(payload.meet)) {
      socket.to(payload.meet).emit(SignalingEvent.Message, payload)
    } else {
      socket.join(payload.meet)
      socket.broadcast.emit(SignalingEvent.Message, payload)
    }
  }

  private takeOrStartRoom({meet}: PeerMessage) {
    const adapter = this.server.sockets.adapter
    return adapter.rooms[meet] ?? {length: 0}
  }
}

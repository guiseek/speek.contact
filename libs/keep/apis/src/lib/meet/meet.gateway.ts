import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import {Socket} from 'socket.io'
import {PeerMessage, SignalingEvent} from '@speek/type'
import {MeetService} from '@speek/keep/data'
import {UseGuards} from '@nestjs/common'
import {SignalingGuard} from './guards/signaling.guard'

@WebSocketGateway({cors: true})
export class MeetGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit(SignalingEvent.Connection, {user: client.conn['id']})
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    client.emit(SignalingEvent.Disconnection, {user: client.conn['id']})
  }

  constructor(private readonly meetService: MeetService) {}

  @UseGuards(SignalingGuard)
  @SubscribeMessage(SignalingEvent.Message)
  onMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: PeerMessage
  ) {
    // console.log(payload)
    if (socket.rooms.has(payload.meet)) {
      socket.to(payload.meet).emit(SignalingEvent.Message, payload)
    } else {
      socket.join(payload.meet)
      socket.broadcast.emit(SignalingEvent.Message, payload)
    }
  }
}

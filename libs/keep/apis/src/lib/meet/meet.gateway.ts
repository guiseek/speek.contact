import {
  MessageBody,
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets'
import {Socket} from 'socket.io'
import {PeerMessage, SignalingEvent} from '@speek/type'
import {MeetService} from '@speek/keep/data'
import {UseGuards} from '@nestjs/common'
import {SignalingGuard} from './guards/signaling.guard'

// const origin = ['localhost:4200', 'speek.contact']

@WebSocketGateway({
  cors: true,
})
export class MeetGateway implements OnGatewayConnection {
  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit(SignalingEvent.Connection, {id: client.id})
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

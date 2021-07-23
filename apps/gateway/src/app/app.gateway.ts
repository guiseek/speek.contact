import {
  CreateOffer,
  CreateAnswer,
  IceCandidate,
  SignalingEvent,
} from '@speek/common-definitions';
import { Socket, Server } from 'socket.io';
import {
  OnGatewayConnection,
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit(SignalingEvent.Connection, { id: client.id });
  }

  @SubscribeMessage(SignalingEvent.Offer)
  offer(@MessageBody() payload: CreateOffer) {
    this.server.emit(SignalingEvent.Offer, payload);
  }

  @SubscribeMessage(SignalingEvent.Answer)
  answer(@MessageBody() payload: CreateAnswer) {
    this.server.emit(SignalingEvent.Answer, payload);
  }

  @SubscribeMessage(SignalingEvent.Candidate)
  candidate(@MessageBody() payload: IceCandidate) {
    this.server.emit(SignalingEvent.Candidate, payload);
  }
}

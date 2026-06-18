import { Injectable, inject, signal } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ChatMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private client: Client | null = null;

  incomingMessage = signal<ChatMessage | null>(null);

  connect(): void {
    const token = this.auth.getToken();
    if (!token || this.client?.connected) return;

    this.client = new Client({
  webSocketFactory: () => new SockJS(environment.wsUrl) as WebSocket,
  connectHeaders: { Authorization: `Bearer ${token}` },

  onConnect: () => {
    console.log('✅ WebSocket Connected');

    this.client?.subscribe('/user/queue/messages', (msg: Message) => {
      console.log('📩 Message Received:', msg.body);
      this.incomingMessage.set(JSON.parse(msg.body));
    });
  },

  onStompError: (frame) => {
    console.error('❌ STOMP Error:', frame);
  },

  onWebSocketError: (error) => {
    console.error('❌ WebSocket Error:', error);
  },

  reconnectDelay: 5000
});
    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
  }

  getConversation(otherUserId: number) {
    return this.api.get<ChatMessage[]>(`/chat/${otherUserId}`);
  }

  send(receiverId: number, content: string, exchangeRequestId?: number) {
    return this.api.post<ChatMessage>('/chat/send', { receiverId, content, exchangeRequestId });
  }
}

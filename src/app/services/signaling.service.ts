import { Injectable, inject } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

type SignalHandler = (msg: any) => void;

@Injectable({ providedIn: 'root' })
export class SignalingService {
  private client: Client | null = null;
  private auth = inject(AuthService);
  private connectPromise: Promise<void> | null = null;

  connect(): Promise<void> {
    if (this.connectPromise) return this.connectPromise;
    
    const token = this.auth.getToken();
    if (!token) return Promise.reject('No auth token');
    if (this.client?.connected) return Promise.resolve();

    this.connectPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(environment.wsUrl) as WebSocket,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('Signaling connected');
          this.connectPromise = null;
          resolve();
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
          reject(frame.body);
        }
      });
      this.client.activate();
    });
    
    return this.connectPromise;
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
    this.connectPromise = null;
  }

  subscribeToRoom(room: string, handler: SignalHandler): void {
    this.connect().then(() => {
      this.client?.subscribe(`/topic/call/${room}`, m => {
        try {
          console.log('Received signaling message', room, m.body);
          handler(JSON.parse(m.body));
        } catch (e) {
          console.error('Failed to parse signal', e);
        }
      });
      console.log('Subscribed to call room:', room);
    }).catch(e => console.error('Failed to subscribe', e));
  }

  send(path: string, payload: any): void {
    this.connect().then(() => {
      try {
        this.client?.publish({ destination: path, body: JSON.stringify(payload) });
        console.log('Signaling sent:', path, payload);
      } catch (e) {
        console.error('Signaling send failed', e);
      }
    }).catch(e => console.error('Cannot send - connection failed:', e));
  }
}

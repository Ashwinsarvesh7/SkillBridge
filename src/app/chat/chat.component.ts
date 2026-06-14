import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';
import { ExchangeService } from '../services/exchange.service';
import { AuthService } from '../services/auth.service';
import { ChatMessage, User } from '../models';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    DatePipe,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  private chat = inject(ChatService);
  private userService = inject(UserService);
  private exchangeService = inject(ExchangeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  auth = inject(AuthService);
  private fb = inject(FormBuilder);

  contacts = signal<User[]>([]);
  selectedContact = signal<User | null>(null);
  messages = signal<ChatMessage[]>([]);
  sessionRooms = signal<Record<number, string>>({});
  pendingContactId: number | null = null;
  pendingSessionRoom: string | null = null;

  messageForm = this.fb.group({ content: [''] });

  constructor() {
    effect(() => {
      const incoming = this.chat.incomingMessage();
      const contact = this.selectedContact();
      if (incoming && contact && (incoming.senderId === contact.id || incoming.receiverId === contact.id)) {
        this.messages.update(m => [...m, incoming]);
      }
    });
  }

  ngOnInit(): void {
    this.chat.connect();
    this.route.queryParams.subscribe(params => {
      const id = Number(params['contact']);
      const room = params['room'];
      if (!Number.isNaN(id) && id > 0) {
        this.pendingContactId = id;
      }
      if (typeof room === 'string' && room.trim()) {
        this.pendingSessionRoom = room;
      }
    });

    this.loadContacts();
  }

  private loadContacts(): void {
    this.userService.getMatches().subscribe(matches => {
      this.exchangeService.getActive().subscribe(active => {
        const activeContacts: User[] = active.map(request => {
          const isSelfSender = request.senderId === this.auth.currentUser()?.id;
          const id = isSelfSender ? request.receiverId : request.senderId;
          const firstName = isSelfSender ? request.receiverName.split(' ')[0] : request.senderName.split(' ')[0];
          const lastName = isSelfSender ? request.receiverName.split(' ').slice(1).join(' ') : request.senderName.split(' ').slice(1).join(' ');
          return { id, firstName, lastName, email: '', experienceLevel: 'BEGINNER', role: 'USER', profileCompletionPercent: 0 } as User;
        });

        const uniqueContacts = new Map<number, User>();
        [...matches, ...activeContacts].forEach(user => {
          uniqueContacts.set(user.id, user);
        });

        const sessionMap: Record<number, string> = {};
        active.forEach(request => {
          if (!request.sessionRoom) return;
          const contactId = request.senderId === this.auth.currentUser()?.id ? request.receiverId : request.senderId;
          sessionMap[contactId] = request.sessionRoom;
        });

        this.contacts.set(Array.from(uniqueContacts.values()));
        this.sessionRooms.set(sessionMap);

        if (this.pendingContactId) {
          const match = Array.from(uniqueContacts.values()).find(u => u.id === this.pendingContactId);
          if (match) {
            this.selectContact(match);
            this.pendingContactId = null;
          }
        }
      });
    });
  }

  selectContact(user: User): void {
    this.selectedContact.set(user);
    const sessionRoom = this.sessionRooms()[user.id] || this.pendingSessionRoom;
    if (sessionRoom) {
      this.sessionRooms.update(map => ({ ...map, [user.id]: sessionRoom }));
    }
    this.chat.getConversation(user.id).subscribe(m => this.messages.set(m));
  }

  send(): void {
    const content = this.messageForm.value.content?.trim();
    const contact = this.selectedContact();
    if (!content || !contact) return;
    this.chat.send(contact.id, content).subscribe(msg => {
      this.messages.update(m => [...m, msg]);
      this.messageForm.reset();
    });
  }

  get sessionRoom(): string | null {
    const contact = this.selectedContact();
    return contact ? this.sessionRooms()[contact.id] || null : null;
  }

  startSession(): void {
    const contact = this.selectedContact();
    if (!contact) return;

    const existingRoom = this.sessionRoom;
    const room = existingRoom || this.generateRoomId();
    this.sessionRooms.update(map => ({ ...map, [contact.id]: room }));
    this.router.navigate(['/session'], { queryParams: { contact: contact.id, room } });
  }

  private generateRoomId(): string {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().split('-')[0]
      : Math.random().toString(36).slice(2, 10);
  }

  isMine(msg: ChatMessage): boolean {
    return msg.senderId === this.auth.currentUser()?.id;
  }
}

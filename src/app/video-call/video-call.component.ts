import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../services/user.service';
import { SignalingService } from '../services/signaling.service';
import { AuthService } from '../services/auth.service';
import { User } from '../models';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="session-page">
      <header class="page-header">
        <h1>Make Session</h1>
        <p>Open the link below and share it with your partner to start a session.</p>
      </header>

      <mat-card class="call-card">
        <div class="call-top">
          <div>
            <h2>Room {{ roomId() }}</h2>
            @if (contact()) {
              <p>Invite <strong>{{ contact()?.firstName }} {{ contact()?.lastName }}</strong> to the call.</p>
              @if (contact()?.email) { <p><mat-icon>email</mat-icon> {{ contact()?.email }}</p> }
            } @else {
              <p>Share this room link with your exchange partner.</p>
            }
          </div>
          <button mat-stroked-button color="primary" type="button" (click)="copyRoomLink()">
            <mat-icon>content_copy</mat-icon> Copy invite link
          </button>
        </div>

        <div class="room-link">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Invite link</mat-label>
            <input matInput [value]="roomLink()" readonly />
          </mat-form-field>
        </div>

        <div class="videos">
          <div class="video-box">
            <h3>Your camera</h3>
            <video #localVideo autoplay muted playsinline></video>
          </div>
          <div class="video-box remote-box">
            <h3>Remote participant</h3>
            <video #remoteVideo autoplay playsinline></video>
            @if (!remoteStream()) {
              <div class="remote-placeholder">
                <mat-icon>videocam_off</mat-icon>
                <p>Waiting for the other participant to join this room.</p>
              </div>
            }
          </div>
        </div>

        @if (error()) {
          <div class="error-banner">
            <mat-icon>warning</mat-icon>
            <div class="error-content">
              <span>{{ error() }}</span>
              <button mat-icon-button (click)="retryCamera()" title="Retry camera access">
                <mat-icon>refresh</mat-icon>
              </button>
            </div>
          </div>
        }

        <div class="call-actions">
          <button mat-flat-button color="warn" type="button" (click)="endCall()">End call</button>
          <button mat-stroked-button color="primary" type="button" (click)="openChat()">Open chat</button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .session-page { padding: 24px; }

    .call-card {
      max-width: 1000px;
      margin: 0 auto;
      padding: 24px !important;
      background: var(--elevated);
      color: var(--text-primary);
      border: 1px solid rgba(255,255,255,0.04);
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      border-radius: 12px;
    }

    .call-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }

    .call-top h2 { margin: 0; color: var(--text-primary); font-size: 1.5rem; }

    .room-link { margin-bottom: 16px; }

    .videos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }

    .video-box {
      background: var(--surface-variant);
      color: var(--text-primary);
      border-radius: 16px;
      padding: 16px;
      min-height: 280px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border: 1px solid rgba(255,255,255,0.03);
    }

    .video-box h3 { margin: 0; font-size: 1rem; font-weight: 700; color: var(--text-primary); }

    .video-box video { width: 100%; height: 100%; min-height: 220px; border-radius: 12px; object-fit: cover; background: #000; border: 1px solid rgba(0,0,0,0.5); }

    .remote-box { position: relative; }

    .remote-placeholder {
      display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; gap: 12px;
      background: rgba(255,255,255,0.02);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      color: var(--text-secondary);
      border: 1px dashed rgba(255,255,255,0.03);
    }

    .remote-placeholder mat-icon { font-size: 48px; color: var(--text-secondary); }

    .error-banner {
      display: flex; align-items: center; gap: 8px; padding: 12px; border-radius: 12px;
      background: rgba(244, 67, 54, 0.12); color: #f44336; margin-top: 16px; border: 1px solid rgba(244,67,54,0.18);
    }

    .error-content { display: flex; align-items: center; gap: 8px; flex: 1; }

    .call-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; flex-wrap: wrap; }

    .full-width { width: 100%; }

    /* Ensure form fields are visible in dark */
    .call-card .mat-form-field-appearance-outline .mat-form-field-outline {
      color: rgba(255,255,255,0.06);
    }

    .call-card button.mat-stroked-button { color: var(--text-primary); border-color: rgba(255,255,255,0.06); }

    .call-card button.mat-flat-button[color="warn"] { background: #b00020; color: #fff; }

    @media (max-width: 900px) {
      .videos { grid-template-columns: 1fr; }
    }
  `]
})
export class VideoCallComponent implements OnInit, AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private signaling = inject(SignalingService);
  private auth = inject(AuthService);

  @ViewChild('localVideo', { static: true }) localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo', { static: false }) remoteVideo?: ElementRef<HTMLVideoElement>;

  contact = signal<User | null>(null);
  roomId = signal('');
  roomLink = signal('');
  loading = signal(true);
  error = signal('');
  remoteStream = signal<MediaStream | null>(null);

  private localStream: MediaStream | null = null;
  private localCameraPromise: Promise<void> | null = null;
  private pc: RTCPeerConnection | null = null;
  private isInitiator = false;
  private currentUserId: number | null = null;
  private partnerId: number | null = null;

  ngOnInit(): void {
    this.currentUserId = this.auth.currentUser()?.id || null;

    this.route.queryParams.subscribe(params => {
      const contactId = Number(params['contact']);
      const room = params['room'] || this.generateRoomId();
      this.roomId.set(room);
      this.roomLink.set(`${location.origin}/session?contact=${contactId}&room=${room}`);
      this.partnerId = !Number.isNaN(contactId) && contactId > 0 ? contactId : null;
      this.isInitiator = this.currentUserId !== null && this.partnerId !== null && this.currentUserId < this.partnerId;

      if (this.partnerId) {
        this.userService.getUser(this.partnerId).subscribe({
          next: user => this.contact.set(user),
          error: () => this.contact.set(null)
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.localCameraPromise = this.openLocalCamera();
    this.initSignaling();
  }

  ngOnDestroy(): void {
    this.stopLocalCamera();
    this.pc?.close();
    this.signaling.disconnect();
  }

  async openLocalCamera(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localStream = stream;
      this.localVideo.nativeElement.srcObject = stream;
      console.log('Camera opened successfully');
    } catch (e: any) {
      let errMsg = 'Camera access is required for sessions. Please allow microphone and camera permissions.';
      if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
        errMsg = 'No camera or microphone found on this device.';
      } else if (e.name === 'NotAllowedError') {
        errMsg = 'Camera/microphone access was denied. Please allow permissions in browser settings.';
      } else if (e.name === 'NotReadableError') {
        errMsg = 'Camera/microphone is in use by another application.';
      } else if (e.name === 'OverconstrainedError') {
        errMsg = 'Requested camera/microphone settings not supported on this device.';
      }
      this.error.set(errMsg);
      console.error('Camera error:', e.name, e.message);
      throw e;
    } finally {
      this.loading.set(false);
    }
  }

  retryCamera(): void {
    this.openLocalCamera();
  }

  private initSignaling(): void {
    const room = this.roomId();
    if (!room) return;
    this.signaling.connect();
    this.signaling.subscribeToRoom(room, msg => this.handleSignal(msg));

    const from = this.auth.currentUser()?.email || 'unknown';
    this.signaling.send('/app/call/join', { room, type: 'join', from });
  }

  private async setupPeerConnection(): Promise<void> {
    if (this.pc) return;
    this.pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

    this.pc.onicecandidate = (ev) => {
      if (ev.candidate) {
        this.signaling.send('/app/call/ice', { room: this.roomId(), type: 'ice', candidate: ev.candidate, from: this.auth.currentUser()?.email });
      }
    };

    this.pc.ontrack = (ev) => {
      const [stream] = ev.streams;
      if (stream) {
        this.remoteStream.set(stream);
      }
    };

    await this.localCameraPromise;
    if (this.localStream) {
      this.localStream.getTracks().forEach(t => this.pc!.addTrack(t, this.localStream!));
    }
  }

  private async handleSignal(msg: any): Promise<void> {
    const self = this.auth.currentUser()?.email || 'unknown';
    if (!msg || msg.from === self) return;

    await this.setupPeerConnection();

    switch (msg.type) {
      case 'join':
        if (this.isInitiator) {
          await this.createOffer();
        }
        break;
      case 'offer':
        if (msg.sdp) {
          await this.pc!.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          const answer = await this.pc!.createAnswer();
          await this.pc!.setLocalDescription(answer);
          this.signaling.send('/app/call/answer', { room: this.roomId(), type: 'answer', sdp: answer, from: self });
        }
        break;
      case 'answer':
        if (msg.sdp) {
          await this.pc!.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        }
        break;
      case 'ice':
        if (msg.candidate) {
          try { await this.pc!.addIceCandidate(msg.candidate); } catch (e) { console.warn('ICE add failed', e); }
        }
        break;
    }
  }

  private async createOffer(): Promise<void> {
    if (!this.pc) await this.setupPeerConnection();
    try {
      const offer = await this.pc!.createOffer();
      await this.pc!.setLocalDescription(offer);
      this.signaling.send('/app/call/offer', { room: this.roomId(), type: 'offer', sdp: offer, from: this.auth.currentUser()?.email });
    } catch (e) {
      console.error('Offer creation failed', e);
    }
  }

  constructor() {
    effect(() => {
      const stream = this.remoteStream();
      if (stream && this.remoteVideo?.nativeElement) {
        this.remoteVideo.nativeElement.srcObject = stream;
      }
    });
  }

  private stopLocalCamera(): void {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.localStream = null;
  }

  async copyRoomLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.roomLink());
      alert('Call invitation link copied to clipboard. Share it with your partner.');
    } catch (e) {
      console.error(e);
      alert('Could not copy the invite link. Please copy it manually.');
    }
  }

  endCall(): void {
    this.stopLocalCamera();
    this.router.navigate(['/chat']);
  }

  openChat(): void {
    this.router.navigate(['/chat']);
  }

  private generateRoomId(): string {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().split('-')[0]
      : Math.random().toString(36).slice(2, 10);
  }
}

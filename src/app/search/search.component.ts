import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../services/user.service';
import { SkillService } from '../services/skill.service';
import { ExchangeService } from '../services/exchange.service';
import { User } from '../models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private skillService = inject(SkillService);
  private exchangeService = inject(ExchangeService);
  private router = inject(Router);

  users = signal<User[]>([]);
  currentUser = signal<User | null>(null);
  categories = signal<string[]>([]);
  readonly levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;
  selectedUser = signal<User | null>(null);
  requestMessage = signal('');
  selectedOfferedSkillId = signal<number | null>(null);
  selectedRequestedSkillId = signal<number | null>(null);

  filterForm = this.fb.group({
    skill: [''],
    category: [''],
    experienceLevel: ['']
  });

  ngOnInit(): void {
    this.skillService.getCategories().subscribe(c => this.categories.set(c));
    this.userService.getProfile().subscribe(u => this.currentUser.set(u));
    this.search();
    this.userService.getMatches().subscribe(m => {
      if (m.length && !this.users().length) this.users.set(m);
    });
  }

  search(): void {
    const f = this.filterForm.getRawValue();
    this.userService.search(f.skill || undefined, f.category || undefined, f.experienceLevel as any || undefined)
      .subscribe(u => this.users.set(u));
  }

  openRequest(user: User): void {
    this.selectedUser.set(user);
    // Set defaults to first available skills for manual selection
    const me = this.currentUser();
    const myTeach = me?.skills?.filter(s => s.skillType === 'TEACH') || [];
    const theirTeach = user.skills?.filter(s => s.skillType === 'TEACH') || [];
    this.selectedOfferedSkillId.set(myTeach.length ? myTeach[0].skillId : null);
    this.selectedRequestedSkillId.set(theirTeach.length ? theirTeach[0].skillId : null);
  }

  closeRequest(): void {
    this.selectedUser.set(null);
    this.requestMessage.set('');
    this.selectedOfferedSkillId.set(null);
    this.selectedRequestedSkillId.set(null);
  }

  sendRequest(offeredSkillId: number, requestedSkillId: number): void {
    const target = this.selectedUser();
    if (!target) return;
    this.exchangeService.create({
      receiverId: target.id,
      offeredSkillId,
      requestedSkillId,
      message: this.requestMessage()
    }).subscribe({
      next: () => {
        this.closeRequest();
        this.requestMessage.set('');
        alert('Request sent!');
      },
      error: (e) => alert(e.message)
    });
  }

  sendManualRequest(): void {
    const offered = this.selectedOfferedSkillId();
    const requested = this.selectedRequestedSkillId();
    if (!offered || !requested) { alert('Please select skills to offer and request'); return; }
    this.sendRequest(offered, requested);
  }

  goToChat(user: User): void {
    this.router.navigate(['/chat'], { queryParams: { contact: user.id } });
  }

  startSession(user: User): void {
    const room = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().split('-')[0]
      : Math.random().toString(36).slice(2, 10);
    this.router.navigate(['/session'], { queryParams: { contact: user.id, room } });
  }

  teachSkills(user: User | null) {
    return user?.skills?.filter(s => s.skillType === 'TEACH') || [];
  }

  learnSkills(user: User | null) {
    return user?.skills?.filter(s => s.skillType === 'LEARN') || [];
  }
}

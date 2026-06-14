import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';
import { SkillService } from '../services/skill.service';
import { AuthService } from '../services/auth.service';
import { ReviewService } from '../services/review.service';
import { Skill, User, UserSkill, Review } from '../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private skillService = inject(SkillService);
  private reviewService = inject(ReviewService);
  private auth = inject(AuthService);
  private snack = inject(MatSnackBar);

  user = signal<User | null>(null);
  allSkills = signal<Skill[]>([]);
  reviews = signal<Review[]>([]);
  error = signal<string | null>(null);
  loading = signal(true);
  readonly levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    bio: [''],
    experienceLevel: ['BEGINNER']
  });

  newSkill = this.fb.group({
    skillId: [null as number | null, Validators.required],
    skillType: ['TEACH' as 'TEACH' | 'LEARN', Validators.required],
    experienceLevel: ['BEGINNER']
  });

  ngOnInit(): void {
    this.loadProfile();
    this.skillService.getAll().subscribe(s => this.allSkills.set(s));
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: u => {
        this.user.set(u);
        this.auth.updateUser(u);
        this.error.set(null);
        this.loading.set(false);
        this.profileForm.patchValue({
          firstName: u.firstName,
          lastName: u.lastName,
          bio: u.bio || '',
          experienceLevel: u.experienceLevel
        });
        this.reviewService.getForUser(u.id).subscribe(r => this.reviews.set(r));
      },
      error: (err) => {
        console.error('Profile load error:', err);
        this.error.set(err?.message || 'Failed to load profile');
        this.loading.set(false);
      }
    });
  }

  saveProfile(): void {
    this.userService.updateProfile(this.profileForm.getRawValue() as any).subscribe({
      next: u => {
        this.user.set(u);
        this.auth.updateUser(u);
        this.snack.open('Profile updated', 'OK', { duration: 3000 });
      },
      error: () => this.snack.open('Update failed', 'OK', { duration: 3000 })
    });
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.userService.uploadPhoto(file).subscribe({
      next: u => {
        this.user.set(u);
        this.auth.updateUser(u);
        this.snack.open('Photo uploaded', 'OK', { duration: 3000 });
      }
    });
  }

  addSkill(): void {
    const v = this.newSkill.getRawValue();
    if (!v.skillId) return;
    this.userService.addSkill(v.skillId, v.skillType!, v.experienceLevel as any).subscribe({
      next: () => {
        this.loadProfile();
        this.newSkill.reset({ skillType: 'TEACH', experienceLevel: 'BEGINNER' });
      }
    });
  }

  removeSkill(id: number): void {
    this.userService.removeSkill(id).subscribe(() => this.loadProfile());
  }

  teachSkills(): UserSkill[] {
    return this.user()?.skills?.filter(s => s.skillType === 'TEACH') || [];
  }

  learnSkills(): UserSkill[] {
    return this.user()?.skills?.filter(s => s.skillType === 'LEARN') || [];
  }

  badgeIcon(level: string): string {
    if (level === 'GOLD') return 'emoji_events';
    if (level === 'SILVER') return 'military_tech';
    if (level === 'BRONZE') return 'star';
    return '';
  }
}

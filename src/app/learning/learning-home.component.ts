/**
 * =============================================================================
 * LEARNING HOME - Landing page for Learning Center
 * =============================================================================
 */

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-learning-home',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './learning-home.component.html',
  styleUrl: './learning-home.component.scss'
})
export class LearningHomeComponent {}

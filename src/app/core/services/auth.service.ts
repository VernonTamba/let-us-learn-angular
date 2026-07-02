/**
 * =============================================================================
 * AUTH.SERVICE.TS - Authentication Service
 * =============================================================================
 *
 * 📘 KONSEP: Authentication & Authorization
 *
 * ============ PERBANDINGAN OLD vs NEW ============
 *
 * 🔴 OLD WAY: BehaviorSubject + localStorage
 * 🟢 NEW WAY: Signals + localStorage (hybrid approach)
 *
 * Dalam real-world Oil & Gas app, biasanya menggunakan:
 * - OAuth 2.0 / OpenID Connect
 * - JWT tokens
 * - Role-based access control (RBAC)
 *
 * 💡 TIP INTERVIEW:
 * "Bagaimana implement authentication di Angular?"
 * - JWT di localStorage/sessionStorage (atau HttpOnly cookie lebih aman)
 * - HTTP Interceptor untuk attach token ke requests
 * - Route Guards untuk protect routes
 * - Token refresh mechanism
 * =============================================================================
 */

import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';

// ===== INTERFACES =====

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  tokenType: string;
}

export interface AuthState {
  user: User | null;
  token: AuthToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export enum UserRole {
  Admin = 'admin',
  Engineer = 'engineer',
  Operator = 'operator',
  Viewer = 'viewer'
}

// ===== SERVICE =====

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = new Router();

  // ===== 🟢 NEW WAY: Signals-based state =====

  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<AuthToken | null>(null);
  private loadingSignal = signal<boolean>(false);

  // Public readonly signals
  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();

  // Computed signals
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly userRole = computed(() => this.userSignal()?.role ?? null);
  readonly isAdmin = computed(() => this.userSignal()?.role === UserRole.Admin);
  readonly isEngineer = computed(() =>
    this.userSignal()?.role === UserRole.Admin ||
    this.userSignal()?.role === UserRole.Engineer
  );

  // ===== 🔴 OLD WAY: BehaviorSubject (masih valid untuk some use cases) =====

  private currentUser$ = new BehaviorSubject<User | null>(null);
  readonly currentUserObservable$ = this.currentUser$.asObservable();
  readonly isAuthenticated$ = this.currentUser$.pipe(map(user => user !== null));

  // ===== CONSTRUCTOR =====

  constructor() {
    // Check for stored session on app init
    this.initializeAuthState();
  }

  // ===== PUBLIC METHODS =====

  /**
   * Login dengan credentials
   * Dalam real app, ini akan call backend API
   */
  login(credentials: LoginCredentials): Observable<User> {
    this.loadingSignal.set(true);

    // MOCK: Simulate API call
    // Real implementation:
    // return this.http.post<AuthResponse>(`${API_URL}/auth/login`, credentials)
    return this.mockLogin(credentials).pipe(
      tap(({ user, token }) => {
        this.setSession(user, token);
        this.loadingSignal.set(false);
      }),
      map(({ user }) => user)
    );
  }

  /**
   * Logout - clear session
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.userSignal()?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const currentRole = this.userSignal()?.role;
    return currentRole ? roles.includes(currentRole) : false;
  }

  /**
   * Get stored access token
   */
  getToken(): string | null {
    return this.tokenSignal()?.accessToken ?? null;
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const token = this.tokenSignal();
    if (!token) return true;

    // In real app, decode JWT and check exp claim
    // For now, check stored expiry
    const expiryTime = localStorage.getItem('token_expiry');
    if (!expiryTime) return true;

    return Date.now() > parseInt(expiryTime, 10);
  }

  /**
   * Refresh token
   */
  refreshToken(): Observable<AuthToken> {
    const currentToken = this.tokenSignal();
    if (!currentToken?.refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // MOCK: In real app, call refresh endpoint
    // return this.http.post<AuthToken>(`${API_URL}/auth/refresh`, { refreshToken });
    const newToken: AuthToken = {
      ...currentToken,
      accessToken: 'new-mock-access-token-' + Date.now(),
      expiresIn: 3600
    };

    return of(newToken).pipe(
      delay(500),
      tap(token => {
        this.tokenSignal.set(token);
        this.storeToken(token);
      })
    );
  }

  // ===== PRIVATE METHODS =====

  private initializeAuthState(): void {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser) as User;
        const token = JSON.parse(storedToken) as AuthToken;

        if (!this.isTokenExpired()) {
          this.userSignal.set(user);
          this.tokenSignal.set(token);
          this.currentUser$.next(user);
        } else {
          this.clearSession();
        }
      }
    } catch {
      this.clearSession();
    }
  }

  private setSession(user: User, token: AuthToken): void {
    // Update signals
    this.userSignal.set(user);
    this.tokenSignal.set(token);

    // Update BehaviorSubject (old way)
    this.currentUser$.next(user);

    // Persist to localStorage
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.storeToken(token);
  }

  private storeToken(token: AuthToken): void {
    localStorage.setItem('auth_token', JSON.stringify(token));
    localStorage.setItem('token_expiry',
      (Date.now() + token.expiresIn * 1000).toString()
    );
  }

  private clearSession(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.currentUser$.next(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expiry');
  }

  // ===== MOCK (remove in production) =====

  private mockLogin(credentials: LoginCredentials): Observable<{ user: User; token: AuthToken }> {
    // Simulate different users based on email
    const mockUsers: Record<string, User> = {
      'admin@witsml.com': {
        id: '1', email: 'admin@witsml.com', name: 'Admin User',
        role: UserRole.Admin, department: 'IT'
      },
      'engineer@witsml.com': {
        id: '2', email: 'engineer@witsml.com', name: 'Drilling Engineer',
        role: UserRole.Engineer, department: 'Operations'
      },
      'operator@witsml.com': {
        id: '3', email: 'operator@witsml.com', name: 'Well Operator',
        role: UserRole.Operator, department: 'Field Operations'
      }
    };

    const user = mockUsers[credentials.email];

    if (!user || credentials.password !== 'password123') {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
    }

    const token: AuthToken = {
      accessToken: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 3600,
      tokenType: 'Bearer'
    };

    return of({ user, token }).pipe(delay(1000)); // Simulate network latency
  }
}

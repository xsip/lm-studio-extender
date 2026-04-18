import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LmStudioEvent } from './lmstudio-stream.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
interface DecodedToken {
  exp: number; // Expiration time in seconds since epoch
  iat: number; // Issued at time
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet],
  template: ` <router-outlet></router-outlet> `,
  styles: [],
})
export class App implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  ngOnInit() {
    const currentRoute = this.activatedRoute.snapshot.url.map((segment) => segment.path).join('/');
    if (currentRoute.includes('login') || currentRoute.includes('readme') || currentRoute === '')
      return;

    const token = localStorage.getItem('jwt_token');
    if (!token || this.isTokenExpired(token)) {
      return this.router.navigate(['login']);
    }
    return;
  }

  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (Error) {
      console.error('Error decoding token:', Error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      // If token is invalid or has no expiration, treat as expired/invalid
      return true;
    }
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp < currentTime;
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private loggingService: LoggingService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.loggingService.printLog('Hello from AppComponent ngOnInit');
  }

}

import { Component } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  public registrationForm: any = {};
  public loginForm: any = {};

  constructor(
    public userService: UserService,
    private router: Router,
    public modalService: NgbModal,
  ) {
  }

  openProfile() {
    if (this.userService.user && this.userService.user.player) {
      this.router.navigate(['/player/' + this.userService.user.player.pk]);
    } else {
      this.router.navigate(['/player/pair']);  // TODO
    }
  }

  signUp() {
    this.userService.signUp(this.registrationForm)
      .subscribe({
        next: () => {
          this.modalService.dismissAll();
          this.registrationForm = {};
        },
        error: error => {},
      })
  }

  logIn() {
    this.userService.logIn(this.loginForm)
      .subscribe({
        next: () => {
          this.modalService.dismissAll();
          this.registrationForm = {};
        },
        error: error => {},
      })
  }
}

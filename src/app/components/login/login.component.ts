import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  username: any;
  room: any;

  constructor(
    private router: Router,
    private activatedRoutes: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.formInitialize();
  }

  formInitialize() {
    this.loginForm = this.fb.group({
      username: [''],
      room: ['']
    });
  }

  ngOnInit(): void {
  }

  login() {
    this.router.navigate(['/chat', this.loginForm.value.username, this.loginForm.value.room]);
  }
}

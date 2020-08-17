import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sign-in-page",
  templateUrl: "./sign-in-page.component.html",
  styleUrls: ["./sign-in-page.component.scss"],
})
export class SignInPageComponent implements OnInit {
  inputModel: any;

  loginUserData: any = {};
  dataObjek$;
  tokenObjek$;

  constructor(public _authService: AuthService, private _router: Router) {}

  ngOnInit() {}

  loginUser() {
    this._authService.loginUser(this.loginUserData).subscribe(
      (res) => {
        let tokenResult = res.token;
        this.tokenString(tokenResult);
        this._router.navigate([`/home`]);
      },
      (err) => console.log(err)
    );
  }

  tokenString(tokenResult) {
    if (this._authService.loggedIn() != true) {
      localStorage.setItem("token", tokenResult);
      this._router.navigate([`/home`]);
    }
  }
}

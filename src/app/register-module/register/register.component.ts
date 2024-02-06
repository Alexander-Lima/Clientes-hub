import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';
import { RegisterService } from 'src/app/general-vision-module/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private hideWarnigOnTime = this.hideWarningsTimer();
  public validationError: boolean = false;
  public postError: boolean = false;
  public errorMessage = '';
  public success: boolean = false;
  public loading: boolean = false;

  constructor(private registerService: RegisterService) {}

  handleClick(event: MouseEvent, input: HTMLInputElement) {
    const isValid = this.checkValidity(input.value);
    this.hideAllWarnings();
    this.validationError = !isValid;
    if(!isValid) {
      this.hideWarnigOnTime();
      return;
    } 
    this.loading = true;
    this.registerService.recordClient(input.value).subscribe(
      {
        error: (err) => {
          this.hideAllWarnings();
          this.postError = true;
          this.hideWarnigOnTime();
        },
        complete: () => {
          this.hideAllWarnings(); 
          this.success = true;
          this.hideWarnigOnTime();
        }
    });
  }

  private checkValidity(text: string): boolean {
    const regex: RegExp = new RegExp(/^[0-9]{1,14}$/);
    return regex.test(text);
  }

  private hideWarningsTimer() {
    let timer: NodeJS.Timeout;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.hideAllWarnings();
      }, 5000);
    }
  }

  private hideAllWarnings() {
    this.postError = this.success = this.loading = this.validationError = false;
  }
}

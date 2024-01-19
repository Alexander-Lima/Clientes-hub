import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { RegisterServiceService } from 'src/app/general-vision-module/services/register-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public validationError: boolean = false;
  public postError: boolean = false;
  public errorMessage = '';
  public success: boolean = false;
  public loading: boolean = false;

  constructor(private registerService: RegisterServiceService) {}

  handleClick(event: MouseEvent, input: HTMLInputElement) {
    const isValid = this.checkValidity(input.value);
    this.validationError = !isValid;
    if(!isValid) {
      this.hideWarnings(); 
      return;
    } 
    this.loading = true;
    this.registerService.recordClient(input.value).subscribe(
      {
        error: (err) => { 
          this.postError = true;
          this.loading = false;
          this.hideWarnings();
        },
        complete: () => { 
          this.success = true;
          this.loading = false;
          this.hideWarnings();
        }
    });
  }

  private checkValidity(text: string): boolean {
    const regex: RegExp = new RegExp(/^[0-9]{1,14}$/);
    return regex.test(text);
  }

  private hideWarnings() {
    setTimeout(() => {
      this.postError = this.success = this.validationError = false;
    }, 4000)
  }
}

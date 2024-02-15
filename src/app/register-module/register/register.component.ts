import { Component } from '@angular/core';
import { RegisterService } from 'src/app/general-vision-module/services/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private hideWarningsOnTime = this.hideWarningsTimer();
  public postError: boolean = false;
  public success: boolean = false;
  public loading: boolean = false;

  constructor(private registerService: RegisterService) {}

  handleClick(event: MouseEvent, input: HTMLInputElement) {
    const isValid = this.checkValidity(input.value);
    this.hideAllWarnings();
    if(!isValid) {
      this.hideWarningsOnTime();
      return;
    } 
    this.loading = true;
    this.registerService.recordClient(input.value).subscribe(
      {
        error: () => {
          this.hideAllWarnings();
          this.postError = true;
          this.hideWarningsOnTime();
        },
        complete: () => {
          this.hideAllWarnings();
          this.success = true;
          this.hideWarningsOnTime();
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
    this.postError = this.success = this.loading = false;
  }
}

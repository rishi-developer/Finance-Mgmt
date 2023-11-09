import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastrShowService {
  constructor(private toastr: ToastrService) {}

  /**
   * Created to show the error message
   * @param message to show the message
   */
  showError(message: string) {
    this.toastr.error(message);
  }

  /**
   * Created to show the warning message
   * @param message to show the message
   */
  showWarning(message: string) {
    this.toastr.warning(message);
  }

  /**
   * Created to show the info message
   * @param message to show the message
   */
  showInfo(message: string) {
    this.toastr.info(message);
  }

   /**
   * Created to show the success message
   * @param message to show the message
   */ 
  showSuccess(message: string) {
    this.toastr.success(message);
  }
}

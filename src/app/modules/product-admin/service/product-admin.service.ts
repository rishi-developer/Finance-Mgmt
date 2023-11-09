import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Broker, AdminResponse, OnboardingUserRequestBody } from 'src/app/models/product-admin';

@Injectable({
  providedIn: 'root',
})
export class ProductAdminService {
  constructor(private http: HttpClient) { }

  /**
   * Sends a POST request to onboard a user.
   * @param onboardingUserRequestBody - The request body containing user data.
   * @returns {Observable<AdminResponse>} - An Observable of the response data.
   */
  onboardUser(onboardingUserRequestBody: OnboardingUserRequestBody): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(
      'onboard/any/user',
      onboardingUserRequestBody
    );
  }

  /**
   * Retrieves a list of all brokers.
   * @returns {Observable<Broker[]>} - An Observable containing the list of brokers.
   */
  getAllBrokers(): Observable<Broker[]> {
    const obj = {};
    return this.http.post<Broker[]>('new/get/all/brokers', obj);
  }

  /**
 * Resends an invitation email to a broker.
 * @param {string} brokerAdminUserId - The user ID of the broker admin.
 * @returns {Observable<AdminResponse>} - An Observable containing the response of the invitation resend operation.
 */
  resendInvite(brokerAdminUserId: string): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(
      'super-admin/resend/signup/email',
      brokerAdminUserId
    );
  }
}

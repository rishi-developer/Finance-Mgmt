export interface Broker {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  organization: string;
  rmFunctionality: boolean;
  status: number;
  brokerAdminUserId: string;
}

export interface AdminResponse {
  message: string;
}
export interface OnboardingUserRequestBody {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  euin: string;
  hasRMFunctionality: boolean;
  onboardedBy: string;
  organizationId: number;
  organizationName: string;
  role: number;
  virtualRMId: string;
}


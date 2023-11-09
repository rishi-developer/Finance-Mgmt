export interface LoginResponse {
  newRoleFinal: {
    roleId: number;
    roleDescription: string;
    createdBy: string;
    createdOn: number;
  };
  token: string;
  userId: string;
  firstName: string;
  lastName: string;
  organizationId: number;
  organizationName: string;
  hasRMFunctionality: boolean;
  brokerAdminfirstTimeLogin: boolean;
}

export interface SignupResponse {
  message: string;
}

export interface UserInfoResponse {
  email: string;
}

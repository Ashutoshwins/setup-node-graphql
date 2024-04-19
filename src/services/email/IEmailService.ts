// import { IResponse } from "../../utils/interface/common";
import { IRequest, IResponse } from "../../utils/interfaces/common";

export interface IEmailServiceAPI {
  // sendTrialPeriodEmail(sendEmailRequest: IEmailService.ISendTrialPeriodEmailRequest): unknown;
  sendUserEmailVerificationEmail(
    request: ISendUserEmailVerificationEmailRequest
  ): Promise<ISendUserEmailVerificationEmailResponse>;
}

/********************************************************************************
 *  Send Email
 ********************************************************************************/

export interface ISendEmailRequest{
  toAddress: string;
  firstName?: string;
  lastName?: string;
}
export interface ISendEmailResponse extends IResponse {
  message?: string;
}
/********************************************************************************
 *  Send Email Verification
 ********************************************************************************/
export interface ISendUserEmailVerificationEmailRequest
  extends ISendEmailRequest {
  verifyEmailUrl: string;
  firstName?: string;
  lastName?: string;
}
export type ISendUserEmailVerificationEmailResponse = IResponse



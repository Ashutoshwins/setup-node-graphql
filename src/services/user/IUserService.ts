import IUser from "../../utils/interfaces/IUser";
import { IRequest, IResponse } from "../../utils/interfaces/common";

export interface IUserServiceAPI {
  register(request: IRegisterUserRequest): Promise<IRegisterUserResponse>;
  login(request: ILoginUserRequest): Promise<ILoginUserResponse>;





}

export interface IRegisterUserRequest extends IRequest {
  _id?: string;
  firstName?:string
  lastName?:string
  email?:string
  role?:string
  isActive?:string
  password?:string
  
}

export interface IRegisterUserResponse extends IResponse {
  token?: string;
  user?: any;
  error?: any;
}

export interface ILoginUserRequest {
  email: string;
  password: string;
}
export interface ILoginUserResponse extends IResponse {
  user?: IUser;
  token?: string;
  message?: string;

}

// export interface ILoginUserRequest extends IRequest {
//   email?: string;
//   userName?:string;
//   password?:string;
// }
// export interface ILoginUserResponse extends IResponse {
//   user?: any;
//   error?: any;
//   token?: string;
//   message?: string;
// }
// export interface IGetUserRequest {
//   _id: string;
// }
// export interface IGetUserResponse extends IResponse {
//   user?: IUser;
// }

// export interface IUpdateUserRequest {
//   _id: string;
// }
// export interface IUpdateUserResponse extends IResponse {
//   user?: IUser;
// }

// export interface IDeleteUserRequest {
//   userId: string
// }

// export interface IDeleteUserResponse extends IResponse {
//   success?: boolean;
// }


// /********************************************************************************
//  *  Verify Email
//  ********************************************************************************/
// export interface IVerifyUserEmailRequest {
//   verifyEmailCode: string;
//   email: string
// }
// export interface IVerifyUserEmailResponse extends IResponse {
//   verified?: boolean;
//   token?: string;
//   user?: IUser;
// }

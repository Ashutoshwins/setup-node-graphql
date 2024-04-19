import * as IUserService from "../services/user/IUserService";
import UserService from "./user/userService";
import * as IEmailService from "./email/IEmailService";
import EmailService from "./email/email.Service";




export interface IAppServiceProxy {
  user: IUserService.IUserServiceAPI;
  email:IEmailService.IEmailServiceAPI



}
class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;
  public email:IEmailService.IEmailServiceAPI
 


  constructor() {
    this.user = new UserService(this);
    this.email =new EmailService(this)
   
  }
}

export default new AppServiceProxy();

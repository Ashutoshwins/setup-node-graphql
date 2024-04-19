import IMetaData from "../../utils/interfaces/IMeta"
export default interface IUser {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isVerified:boolean
  password?:string
  isActive?:boolean
  isSubscribed?:boolean
  meta?:IMetaData
}

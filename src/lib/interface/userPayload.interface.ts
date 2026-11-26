import {JwtPayload} from "jsonwebtoken";
import {IUser} from "../../app/user/interface/user.interface";

export interface IUserPayload extends JwtPayload, Partial<IUser> {
}
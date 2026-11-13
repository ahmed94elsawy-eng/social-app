import { AbstractRepository } from "../../../lib/db/abstract.repository";
import {IUser} from "../interface/user.interface";
import { User } from "../model/user.model";

class UserRepository extends AbstractRepository<IUser>{
    
    constructor() {
        super(User);
    }
    async findByEmail(email: string) {
        return User.findOne({email: email})
    }
}

export default new UserRepository();
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { User, UserDocument } from "./users.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(email: string, password: string, name?: string, role = "user") {
    const hashed = await bcrypt.hash(password, 10);
    const created = new this.userModel({ email, password: hashed, name, role });
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async updateProfile(id: string, data: { name?: string; password?: string }) {
    const update: any = {};
    if (data.name) update.name = data.name;
    if (data.password) update.password = await bcrypt.hash(data.password, 10);
    return this.userModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }
}

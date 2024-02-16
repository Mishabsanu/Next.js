import connectMongoDB from "@/db/connection/connection";
import User from "@/db/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

connectMongoDB();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody, "ffffffffff");

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    console.log("user exists");

    //check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword, "validPassword");
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }
    console.log(user, "user");

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.JWTPRIVATEKEY, {
      expiresIn: "7d",
    });
    console.log(token, "token");
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    // response.cookies.set("token", token, {
    //   httpOnly: true,
    // });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

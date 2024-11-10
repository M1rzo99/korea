import { connectToDatabase } from "@/lib/mognoose";
import { NextResponse } from "next/server";
import User from "@/database/user.model";
import { error } from "console";
import { compare } from "bcrypt";

export async function POST(req:Request) {
    try {
        await connectToDatabase()
        const {email,password} = await req.json();

        const isExistingUser = await User.findOne({email})

        if(!isExistingUser){
            return NextResponse.json(
                {
                    error:"Email does not exist"
                }, {status:400}
            )
        }
        const isPasswordValid = await compare (password, isExistingUser.password);

        if(!isPasswordValid){
            return NextResponse.json(
                {
                    error:"Password in correct"
                }, {status:400}
            )
        }

        return NextResponse.json({succes:true, user:isExistingUser})
    } catch (error) {
        const result = error as Error
        return NextResponse.json({error:result.message},{status:400})
    }
}
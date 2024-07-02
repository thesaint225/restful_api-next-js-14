import { NextResponse } from "next/server";
import connect from "@/app/lib/db";
import User from "@/app/lib/modals/users";
import { Types } from "mongoose";

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse(" error in fetching ", error);
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "user is created", user: newUser }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse("error ocurred while creating the user " + error, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;
    await connect();
    if (!userId || !newUsername) {
      return new NextResponse(JSON.stringify("Id or newUserName not found"), {
        status: 400,
      });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updateUser = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) }, // Query object
      { username: newUsername }, // Update object
      { new: true } // Options object
    );
    if (!updateUser) {
      return new NextResponse(
        JSON.stringify({ message: "user not found in the database" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "update user", user: updateUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error Updating user " + error }),
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "ID not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid User ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await connect();
    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );
    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({ message: "user not found in the database" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "User successfully deleted" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

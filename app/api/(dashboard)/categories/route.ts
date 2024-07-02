import { NextResponse } from "next/server";
import connect from "@/app/lib/db";
import User from "@/app/lib/modals/users";
import Category from "@/app/lib/modals/categories";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Id" }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 400 }
      );
    }
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });
    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "Error in fetching categories", error }),
      { status: 500 }
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Id" }),
        { status: 400 }
      );
    }
    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "user not find" }), {
        status: 404,
      });
    }
    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });
    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        message: "category successfully created",
        Category: newCategory,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "error occurred while creating category",
        error,
      }),

      { status: 500 }
    );
  }
};

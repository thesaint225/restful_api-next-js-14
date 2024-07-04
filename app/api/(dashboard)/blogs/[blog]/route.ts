import { NextResponse } from "next/server";
import connect from "@/app/lib/db";
import Blog from "@/app/lib/modals/blogs";
import User from "@/app/lib/modals/users";
import Category from "@/app/lib/modals/categories";
import { Types } from "mongoose";

export const GET = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    // we need to valid the userId , the categoryId, the blogId that
    // has been passed from the client side
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "user id not found " }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "category id not found" }),
        { status: 400 }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "blog Id not found" }),
        { status: 400 }
      );
    }
    // after checking the the userId , categoryId and the blogId
    //  let the connect the database check for the user , the category and the
    // single blog to be fetched if it exist in the database if the yes fetch it

    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 404,
      });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),
        { status: 404 }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      category: categoryId,
    });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "blog not found" }), {
        status: 404,
      });
    }
    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify(
        { message: "error occured while fetching blog" },
        error.message
      ),
      { status: 500 }
    );
  }
};

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const body = await request.json();
    const { title, description } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "user Id not found" }),
        { status: 400 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "blog id not found" }),
        { status: 400 }
      );
    }
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "user not found " }), {
        status: 404,
      });
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "blog not found " }), {
        status: 400,
      });
    }
    const updatedblog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );

    return new NextResponse(JSON.stringify({ updatedblog }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify(
        { message: "error occurred while updating blog" },
        error.message
      ),
      { status: 500 }
    );
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "user id  not found" }),
        { status: 400 }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "blog id not found" }),
        { status: 400 }
      );
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 404,
      });
    }
    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
    });
    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "blog not found" }), {
        status: 404,
      });
    }
    await Blog.findByIdAndDelete(blogId);
    return new NextResponse(
      JSON.stringify({ message: "blog successfully deleted" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "error occurred while deleting the blog" }),
      { status: 500 }
    );
  }
};

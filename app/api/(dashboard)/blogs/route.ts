import { NextResponse } from "next/server";
import connect from "@/app/lib/db";
import Blog from "@/app/lib/modals/blogs";
import User from "@/app/lib/modals/users";
import Category from "@/app/lib/modals/categories";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing Id" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid category ID or missing category ID ",
        }),
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

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),
        { status: 404 }
      );
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    // Todo
    const blogs = await Blog.find(filter);

    return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "error occurred when retrieving blog" }, error),
      { status: 500 }
    );
  }
};

// export const POST = async (request: Request) => {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId");
//     const categoryId = searchParams.get("categoryId");
//     const body = await request.json();
//     const { title, description } = body;
//     if (!userId) {
//       return new NextResponse(JSON.stringify({ message: "user Id no found" }), {
//         status: 400,
//       });
//     }

//     if (!categoryId) {
//       return new NextResponse(
//         JSON.stringify({ message: "category id not found" }),
//         { status: 400 }
//       );
//     }
//     await connect();
//     const user = await User.findById(userId);
//     if (!user) {
//       return new NextResponse(JSON.stringify({ message: "user not found" }), {
//         status: 404,
//       });
//     }
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return new NextResponse(
//         JSON.stringify({ message: "category not found" }),
//         { status: 404 }
//       );
//     }
//     const newBLog = new Blog({
//       title,
//       description,
//       user: new Types.ObjectId(userId),
//       category: new Types.ObjectId(categoryId),
//     });

//     await newBLog.save();
//     return new NextResponse(
//       JSON.stringify({ message: "blog successfully created", blog: newBLog }),
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return new NextResponse(
//       JSON.stringify({ message: "something went wrong", error: error.message }),
//       { status: 500 }
//     );
//   }
// };

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    // Ensure consistent parameter names
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { title, description } = body;

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();
    return new NextResponse(
      JSON.stringify({ message: "Blog successfully created", blog: newBlog }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "error occurred while creating the blog",
        error: error.message, // Properly include the error message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }, // Ensure content-type is set to JSON
      }
    );
  }
};

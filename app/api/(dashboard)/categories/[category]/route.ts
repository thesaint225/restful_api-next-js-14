import { NextResponse } from "next/server";
import connect from "@/app/lib/db";
import User from "@/app/lib/modals/users";
import Category from "@/app/lib/modals/categories";
import { Types } from "mongoose";

export const PATCH = async (request: Request, context: { params: any }) => {
  //   const categoryId = context.params.category;
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    const { title } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

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

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category not found" }),

        { status: 404 }
      );
    }

    const updateCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({ message: "category updated", category: updateCategory }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ message: "error in updating category" }),
      { status: 500 }
    );
  }
};

// export const PATCH = async (request: Request, context: { params: any }) => {
//   const categoryId = context.params.category; // Ensure this parameter is correctly passed and used
//   try {
//     const body = await request.json();
//     const { title } = body;

//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get("userId");

//     // Check for valid userId
//     if (!userId || !Types.ObjectId.isValid(userId)) {
//       return new NextResponse(
//         JSON.stringify({ message: "Invalid or missing ID" }),
//         { status: 400, headers: { "Content-Type": "application/json" } } // Add correct headers
//       );
//     }

//     // Check for valid categoryId
//     if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
//       return new NextResponse(
//         JSON.stringify({
//           message: "Invalid category ID or missing category ID",
//         }),
//         { status: 400, headers: { "Content-Type": "application/json" } } // Add correct headers
//       );
//     }
//     await connect();

//     // Find the user by userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return new NextResponse(
//         JSON.stringify({ message: "User not found" }),
//         { status: 404, headers: { "Content-Type": "application/json" } } // Add correct headers
//       );
//     }

//     // Find the category by categoryId and userId
//     const category = await Category.findOne({ _id: categoryId, user: userId });
//     if (!category) {
//       return new NextResponse(
//         JSON.stringify({ message: "Category not found" }),
//         { status: 404, headers: { "Content-Type": "application/json" } } // Add correct headers
//       );
//     }

//     // Update the category
//     const updateCategory = await Category.findByIdAndUpdate(
//       categoryId,
//       { title },
//       { new: true }
//     );

//     return new NextResponse(
//       JSON.stringify({ message: "Category updated", category: updateCategory }),
//       { status: 200, headers: { "Content-Type": "application/json" } } // Add correct headers
//     );
//   } catch (error: any) {
//     return new NextResponse(
//       JSON.stringify({
//         message: "Error in updating category",
//         error: error.message, // Include error details in the response
//       }),
//       { status: 500, headers: { "Content-Type": "application/json" } } // Add correct headers
//     );
//   }
// };

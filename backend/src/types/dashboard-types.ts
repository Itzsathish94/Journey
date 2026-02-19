import { Types } from "mongoose";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  password?: string;      // ✅ Add this - for signup token
  username?: string;
  iat?: number;
  exp?: number;
}

export interface OrderItem {
  type: string;
  name: string;
  originalPrice: number;
  offerPrice?: number;
  offerPercentage?: number;
}


export interface ITopSellingCourse {
  _id: Types.ObjectId;
  courseName: string;
  thumbnailUrl: string;
  count: number;
}

export interface ICategorySales {
  categoryName: string;
  totalSales: number;
}

export interface IMonthlySales {
  _id: {
    year: number;
    month: number;
  };
  totalSales: number;
}

export interface IAdminCourseSalesReportItem {
  orderId: string;
  date: string;
  couponCode?: string;
  courses: {
    courseName: string;
    coursePrice: number;
    offerPrice?: number;
    adminShare: number;
    InterviewerName: string;
    discountedPrice: number;
  }[];
  totalPrice: number;
  discountAmount: number;
  totalAdminShare: number;
}

export interface IAdminCourseSalesReportItemFlattened {
  orderId: string;
  date: Date;
  courseName: string;
  coursePrice: number;
  adminShare: number;
  InterviewerName: string;
}

export interface IAdminMembershipReportItem {
  orderId: string;
  date: string;
  planName: string;
  InterviewerName: string;
  price: number;
  paymentMethod?: string;
}

export type FilterType = "daily" | "weekly" | "monthly" | "custom";

export interface IUserCourseReportItem {
  orderId: string;
  date: string;
  items: Array<{
    type: "course" | "learningPath";
    name: string;
    originalPrice: number;
    finalPrice: number;
    offerPercentage?: number;
  }>;
  originalTotalPrice: number;
  finalTotalPrice: number;
  couponCode?: string;
  couponDiscountPercent?: number;
  couponDiscountAmount?: number;
}

export interface IUserSlotReportItem {
  bookingId: string;
  date: string;
  slotTime: {
    startTime: string;
    endTime: string;
  };
  InterviewerName: string;
  price: number;
  totalPrice: number;
}

export type AggregationStage<TSchema = {}> = {
  $match?: { [K in keyof TSchema]?: TSchema[K] | unknown };
  $unwind?: string | { path: string; preserveNullAndEmptyArrays?: boolean };
  $lookup?: {
    from: string;
    localField: string;
    foreignField: string;
    as: string;
  };
  $group?: { [K: string]: unknown };
  $project?: { [K: string]: unknown };
  $sort?: { [K: string]: 1 | -1 | "asc" | "desc" };
  $skip?: number;
  $limit?: number;
};
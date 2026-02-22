export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  password?: string;      // ✅ Add this - for signup token
  username?: string;
  iat?: number;
  exp?: number;
}

// export type AggregationStage<TSchema = {}> = {
//   $match?: { [K in keyof TSchema]?: TSchema[K] | unknown };
//   $unwind?: string | { path: string; preserveNullAndEmptyArrays?: boolean };
//   $lookup?: {
//     from: string;
//     localField: string;
//     foreignField: string;
//     as: string;
//   };
//   $group?: { [K: string]: unknown };
//   $project?: { [K: string]: unknown };
//   $sort?: { [K: string]: 1 | -1 | "asc" | "desc" };
//   $skip?: number;
//   $limit?: number;
// };
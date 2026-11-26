// export interface generatePresignedUrlDto{
//     fileName: string;
//     fileType: string;
// }

import {z} from "zod";

export const generatePresignedUrlSchema = z.object({
    fileName: z.string(),
    fileType: z.enum(['image/png', 'image/jpeg']),
});

export type GeneratePresignedUrlDto = z.infer<typeof generatePresignedUrlSchema>;
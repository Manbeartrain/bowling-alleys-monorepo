import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface PlatformFeedbackInput {
  pageId: string;
  pageType: string;
  wasUseful: boolean;
  comment?: string;
  email?: string;
}

export async function submitPlatformFeedback(input: PlatformFeedbackInput): Promise<void> {
  const feedbackData = {
    pageId: input.pageId,
    pageType: input.pageType,
    wasUseful: input.wasUseful,
    ...(input.comment && { comment: input.comment }),
    ...(input.email && { email: input.email }),
    createdAt: serverTimestamp(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    path: typeof window !== "undefined" ? window.location.pathname : undefined,
  };

  await addDoc(collection(db, "platformFeedback"), feedbackData);
}

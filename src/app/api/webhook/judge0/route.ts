import { NextRequest, NextResponse } from "next/server";
import { WebhookPayload } from "@/lib/types/config-types";
import {
  processJudgeResultWebhook,
  updateSubmissionStatus,
} from "@/server/actions/submission-actions";

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const payloadParam = url.searchParams.get("payload");

    if (!payloadParam) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    // Decode payload
    const payload: WebhookPayload = JSON.parse(
      Buffer.from(payloadParam, "base64").toString(),
    );

    const judgeResult = await req.json();

    await processJudgeResultWebhook(
      payload.testCaseId,
      payload.submissionId,
      judgeResult,
    );

    await updateSubmissionStatus(payload.submissionId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

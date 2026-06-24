import {
  ADVISOR_FOLLOWUP_SYSTEM_PROMPT,
  ADVISOR_SYSTEM_PROMPT,
  buildAdvisorUserPrompt,
  generateLocalAdvisorAdvice,
  generateLocalFollowUpAnswer,
  type AdvisorFollowUpPayload,
  type AdvisorRequestPayload,
} from "@/lib/advisorPrompt";

function validatePayload(body: unknown): AdvisorRequestPayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Partial<AdvisorRequestPayload & { type?: string }>;

  if (payload.type === "followup") {
    return null;
  }

  if (
    typeof payload.displayName !== "string" ||
    typeof payload.intendedMajor !== "string" ||
    !Array.isArray(payload.courses) ||
    !Array.isArray(payload.targetSchools) ||
    !Array.isArray(payload.schoolSummaries)
  ) {
    return null;
  }

  return payload as AdvisorRequestPayload;
}

function validateFollowUpPayload(body: unknown): AdvisorFollowUpPayload | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const payload = body as Partial<AdvisorFollowUpPayload>;

  if (
    payload.type !== "followup" ||
    typeof payload.displayName !== "string" ||
    typeof payload.question !== "string" ||
    typeof payload.initialAdvice !== "string" ||
    !Array.isArray(payload.history)
  ) {
    return null;
  }

  if (!payload.question.trim()) {
    return null;
  }

  return payload as AdvisorFollowUpPayload;
}

async function fetchOpenAiAdvice(
  payload: AdvisorRequestPayload,
  apiKey: string,
): Promise<string> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.65,
      max_tokens: 900,
      messages: [
        { role: "system", content: ADVISOR_SYSTEM_PROMPT },
        {
          role: "user",
          content: buildAdvisorUserPrompt(payload),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return content;
}

async function fetchOpenAiFollowUp(
  payload: AdvisorFollowUpPayload,
  apiKey: string,
): Promise<string> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> =
    [
      { role: "system", content: ADVISOR_FOLLOWUP_SYSTEM_PROMPT },
      { role: "assistant", content: payload.initialAdvice },
      ...payload.history.map((entry) => ({
        role: entry.role,
        content: entry.content,
      })),
      { role: "user", content: payload.question.trim() },
    ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.55,
      max_tokens: 350,
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  return content;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      body &&
      typeof body === "object" &&
      (body as { type?: string }).type === "followup"
    ) {
      const followUpPayload = validateFollowUpPayload(body);

      if (!followUpPayload) {
        return Response.json(
          { error: "Invalid follow-up request payload." },
          { status: 400 },
        );
      }

      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        return Response.json({
          answer: generateLocalFollowUpAnswer(followUpPayload),
          source: "local",
        });
      }

      try {
        const answer = await fetchOpenAiFollowUp(followUpPayload, apiKey);
        return Response.json({ answer, source: "ai" });
      } catch (error) {
        console.error("[advisor] follow-up fallback:", error);
        return Response.json({
          answer: generateLocalFollowUpAnswer(followUpPayload),
          source: "local",
          notice:
            "Live AI was unavailable. Showing rule-based guidance instead.",
        });
      }
    }

    const payload = validatePayload(body);

    if (!payload) {
      return Response.json(
        { error: "Invalid advisor request payload." },
        { status: 400 },
      );
    }

    if (payload.courses.length === 0) {
      return Response.json(
        { error: "Add at least one course before requesting advice." },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json({
        advice: generateLocalAdvisorAdvice(payload),
        source: "local",
      });
    }

    try {
      const advice = await fetchOpenAiAdvice(payload, apiKey);
      return Response.json({ advice, source: "ai" });
    } catch (error) {
      console.error("[advisor] AI fallback:", error);
      return Response.json({
        advice: generateLocalAdvisorAdvice(payload),
        source: "local",
        notice:
          "Live AI was unavailable. Showing rule-based guidance instead.",
      });
    }
  } catch {
    return Response.json(
      { error: "Unable to process advisor request." },
      { status: 500 },
    );
  }
}

import { Hono } from "hono";

interface Env {
  AI: any;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// AI Summarization endpoint - Clean and focused
app.post("/api/summarize", async (c) => {
  try {
    const { text, maxLength = 150 } = await c.req.json();

    if (!text || typeof text !== "string") {
      return c.json({ error: "Text is required" }, 400);
    }

    const response = await c.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: `You are a text summarizer. Create a clear, concise summary in ${maxLength} words or less. Focus on key points and main ideas.`
        },
        {
          role: "user",
          content: text
        }
      ],
      stream: false
    });

    return c.json({
      success: true,
      summary: response.response,
      originalLength: text.length,
      summaryLength: response.response.length
    });

  } catch (error) {
    console.error("AI Summarization error:", error);
    return c.json({
      error: "Failed to generate summary",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Fast summarization endpoint
app.post("/api/summarize-fast", async (c) => {
  try {
    const { text, maxLength = 150 } = await c.req.json();

    if (!text || typeof text !== "string") {
      return c.json({ error: "Text is required" }, 400);
    }

    const response = await c.env.AI.run("@cf/mistral/mistral-7b-instruct-v0.1", {
      messages: [
        {
          role: "system",
          content: `Summarize in ${maxLength} words. Focus on key points.`
        },
        {
          role: "user",
          content: text
        }
      ],
      stream: false
    });

    return c.json({
      success: true,
      summary: response.response,
      originalLength: text.length,
      summaryLength: response.response.length
    });

  } catch (error) {
    console.error("AI Summarization error:", error);
    return c.json({
      error: "Failed to generate summary",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Dedicated amount parsing endpoint for cheque converter
app.post("/api/parse-amount", async (c) => {
  try {
    const { text, language } = await c.req.json();

    if (!text || typeof text !== "string") {
      return c.json({ error: "Text is required" }, 400);
    }

    if (!language || !["zh", "en"].includes(language)) {
      return c.json({ error: "Language must be 'zh' or 'en'" }, 400);
    }

    const systemPrompt = language === "zh" 
      ? `你是一个专业的金额解析器。从输入的中文金额文本中提取数字金额。

要求：
- 只输出数字金额，不要其他内容
- 最多2位小数
- 如果无法解析，输出null

示例：
输入：叁佰肆拾伍萬陆仟柒佰捌拾玖元壹角贰分
输出：3456789.12

输入：伍佰陆拾柒萬捌仟玖佰零壹元贰角叁分
输出：5678901.23

输入：柒佰捌拾玖萬零壹佰贰拾叁元肆角伍分
输出：7890123.45

现在，请解析以下输入并只输出数字：`
      : `You are a professional amount parser. Extract the numeric amount from the input English text.

Requirements:
- Output ONLY the numeric amount, nothing else
- Maximum 2 decimal places
- If unable to parse, output null

Examples:
Input: ONE HUNDRED AND TWENTY-THREE AND 45/100
Output: 123.45

Input: TWO THOUSAND FIVE HUNDRED AND 67/100
Output: 2500.67

Input: FORTY-FIVE CENTS
Output: 0.45

Now, please parse the following input and output only the number:`;

    const response = await c.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: text
        }
      ],
      stream: false
    });

    // Extract number from response - AI now returns just the number
    const cleanResponse = response.response.trim();
    const amount = parseFloat(cleanResponse);

    return c.json({
      success: true,
      amount: isNaN(amount) ? null : amount,
      originalText: text,
      language: language
    });

  } catch (error) {
    console.error("AI Amount parsing error:", error);
    return c.json({
      error: "Failed to parse amount",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

export default app;

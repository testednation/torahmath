import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT =
  process.env.NODE_ENV === 'production'
    ? Number(process.env.PORT) || 3000
    : 3000;

interface DailyWisdomPayload {
  date: string;
  title: string;
  hebrewPhrase: string;
  fact: string;
  source: string;
  mathConcept: string;
  quickQuestion: string;
  quickAnswer: string;
}

const dailyCache = new Map<string, DailyWisdomPayload>();

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getTodayKey(requestedDate?: unknown): string {
  if (
    typeof requestedDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)
  ) {
    return requestedDate;
  }
  return new Date().toISOString().slice(0, 10);
}

async function generateDailyWisdomWithRetry(
  dateKey: string,
  excludeTitles: string[]
): Promise<DailyWisdomPayload> {
  const ai = getGeminiClient();

  const avoidClause =
    excludeTitles.length > 0
      ? ` Avoid repeating any of these recent topics or titles: ${excludeTitles.join('; ')}.`
      : '';

  const prompt =
    `Generate one short, joyful, historically authentic daily math fact from the Torah, Mishnah, Gemara, or Shulchan Aruch (Orach Chaim, Yoreh Deah, or Choshen Mishpat) for kids ages 6 to 12 for the date ${dateKey}.` +
    ` Draw from real sources such as the measurements of the Mishkan or Beit HaMikdash, Sukkah geometry, Eruvin circles and Shabbat boundaries, Bava Metzia fair division, Chullin 1:60 ratios, Shulchan Aruch Shaot Zmaniyot (12 daylight hours, Orach Chaim 58:1), 18-minute Shabbat candle lighting (Orach Chaim 263:4), Maaser 10% and Chomesh 20% tzedakah (Yoreh Deah 249:1), Mezuzah top-third placement (Yoreh Deah 289:2), Omer counting (7 × 7 = 49), or classic Gematria.` +
    ` Keep the math crystal-clear, verifiable, and inspiring.${avoidClause}`;

  let lastError: unknown;
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a warm, knowledgeable Torah, Talmud, Shulchan Aruch, and math educator for children ages 6–12. Always provide accurate source citations, exact arithmetic, and concise 2-sentence kid-friendly explanations. Respond strictly in JSON matching the schema.',
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description:
                  'A concise, inviting title (4–8 words) for today’s math wisdom.',
              },
              hebrewPhrase: {
                type: Type.STRING,
                description:
                  'A short authentic Hebrew or Aramaic term related to the fact (1–3 words, no transliteration needed).',
              },
              fact: {
                type: Type.STRING,
                description:
                  'A clear, inspirational 2-sentence explanation of the math insight from the Sages tailored for kids.',
              },
              source: {
                type: Type.STRING,
                description:
                  'The real Torah verse or Talmudic tractate and daf citation (e.g., "Vayikra 23:15", "Eruvin 14a", "Bava Batra 101b").',
              },
              mathConcept: {
                type: Type.STRING,
                description:
                  'Short math topic label (e.g., "Multiplication & Weeks", "Percentages (10%)", "Geometry & Circles").',
              },
              quickQuestion: {
                type: Type.STRING,
                description:
                  'One short, fun mental-math question kids can solve in 10 seconds based on the fact.',
              },
              quickAnswer: {
                type: Type.STRING,
                description:
                  'The clear, exact answer to the quickQuestion with a 1-line explanation.',
              },
            },
            required: [
              'title',
              'hebrewPhrase',
              'fact',
              'source',
              'mathConcept',
              'quickQuestion',
              'quickAnswer',
            ],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        throw new Error('Empty response received from Gemini API.');
      }

      const parsed = JSON.parse(rawText) as Omit<DailyWisdomPayload, 'date'>;
      if (!parsed.title || !parsed.fact || !parsed.source) {
        throw new Error('Incomplete wisdom object received from Gemini API.');
      }

      return {
        date: dateKey,
        title: parsed.title,
        hebrewPhrase: parsed.hebrewPhrase ?? '',
        fact: parsed.fact,
        source: parsed.source,
        mathConcept: parsed.mathConcept ?? 'Torah Math',
        quickQuestion: parsed.quickQuestion ?? '',
        quickAnswer: parsed.quickAnswer ?? '',
      };
    } catch (err) {
      lastError = err;
      const errStatus = (err as { status?: number })?.status;
      // Do not retry on auth/invalid-request errors (400/403/404)
      if (errStatus === 400 || errStatus === 403 || errStatus === 404) {
        break;
      }
      if (attempt < maxAttempts) {
        await new Promise((resolve) =>
          setTimeout(resolve, 400 * Math.pow(2, attempt - 1))
        );
      }
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/daily-wisdom', async (req, res) => {
    const dateKey = getTodayKey(req.query.date);
    const forceRefresh = req.query.refresh === 'true';
    const excludeParam =
      typeof req.query.exclude === 'string' && req.query.exclude.trim()
        ? req.query.exclude
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 6)
        : [];

    if (!forceRefresh && dailyCache.has(dateKey)) {
      res.json(dailyCache.get(dateKey));
      return;
    }

    try {
      const wisdom = await generateDailyWisdomWithRetry(dateKey, excludeParam);
      dailyCache.set(dateKey, wisdom);
      res.json(wisdom);
    } catch (err) {
      console.error('Failed to generate daily Torah math wisdom:', err);
      const status = (err as { status?: number })?.status;
      const rawMessage =
        err instanceof Error ? err.message : 'Unable to generate daily wisdom.';

      let clientMessage =
        'Could not load today’s Torah math wisdom right now. Please try again.';
      let httpStatus = 502;

      if (
        status === 403 ||
        rawMessage.includes('API_KEY') ||
        rawMessage.includes('GEMINI_API_KEY')
      ) {
        clientMessage =
          'The Gemini API key is missing or invalid. Please check your key in Settings > Secrets.';
        httpStatus = 503;
      } else if (status === 429) {
        clientMessage =
          'The Gemini API quota is temporarily busy. Please wait a moment and try again.';
        httpStatus = 429;
      }

      res.status(httpStatus).json({ error: clientMessage });
    }
  });

  const httpServer = createServer(app);

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
      if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API route not found.' });
        return;
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const disableHmr = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: disableHmr ? false : { server: httpServer },
        ws: disableHmr ? false : undefined,
        watch: disableHmr ? null : {},
      },
      appType: 'spa',
    });

    if (disableHmr) {
      app.get('/@vite/client', async (_req, res, next) => {
        try {
          const result = await vite.transformRequest('/@vite/client');
          if (!result) {
            next();
            return;
          }
          const patchedCode = result.code
            .replace('await wsTransport.connect(handlers);', 'return;')
            .replace(
              'ws.send(JSON.stringify(data));',
              'if (ws && ws.readyState === ws.OPEN) ws.send(JSON.stringify(data));'
            );
          res
            .status(200)
            .setHeader('Content-Type', 'application/javascript; charset=utf-8')
            .send(patchedCode);
        } catch (err) {
          next(err);
        }
      });
    }

    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Cheshbon server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

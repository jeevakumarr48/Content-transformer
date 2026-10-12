import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import dotenv from 'dotenv';
import multer from 'multer';
import { GoogleGenAI, Type } from '@google/genai';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';

dotenv.config();

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GEMINI_MODEL = 'gemini-3.1-flash-lite';

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    timeout: 120_000,
    retryOptions: { attempts: 1 },
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsers
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Multer memory storage for uploads up to 25MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

// Helper to count words
function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// 1. Health check & status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    model: GEMINI_MODEL,
    platform: 'Content Transformer',
    timestamp: new Date().toISOString(),
  });
});

// 2. Document Text Extraction Route
app.post('/api/extract-document', upload.single('document'), async (req, res) => {
  const extractionStartedAt = performance.now();
  try {
    let extractedText = '';
    let fileName = 'pasted-text.txt';
    let fileType = 'txt';
    let fileSize = 0;

    if (req.file) {
      fileName = req.file.originalname;
      fileSize = req.file.size;
      const originalExtension = path.extname(req.file.originalname).toLowerCase();

      if (originalExtension === '.pdf') {
        fileType = 'pdf';
        try {
          const pdfData = await pdfParse(req.file.buffer);
          extractedText = pdfData.text || '';
        } catch (pdfErr: any) {
          return res.status(400).json({
            error: 'Failed to extract text from PDF document. The file may be password protected, scanned images only, or corrupted.',
            details: pdfErr.message,
          });
        }
      } else if (originalExtension === '.docx' || originalExtension === '.doc') {
        fileType = 'docx';
        try {
          const docxResult = await mammoth.extractRawText({ buffer: req.file.buffer });
          extractedText = docxResult.value || '';
        } catch (docxErr: any) {
          return res.status(400).json({
            error: 'Failed to extract text from Word DOCX document.',
            details: docxErr.message,
          });
        }
      } else if (
        originalExtension === '.txt' ||
        originalExtension === '.md' ||
        originalExtension === '.rtf' ||
        originalExtension === '.json' ||
        originalExtension === '.csv'
      ) {
        fileType = 'txt';
        extractedText = req.file.buffer.toString('utf-8');
      } else {
        return res.status(400).json({
          error: `Unsupported file format (${originalExtension}). Please upload a TXT, PDF, or DOCX document.`,
        });
      }
    } else if (req.body.rawText) {
      extractedText = String(req.body.rawText);
      fileName = req.body.fileName || 'custom-input.txt';
      fileType = 'txt';
      fileSize = Buffer.byteLength(extractedText, 'utf8');
    } else {
      return res.status(400).json({
        error: 'No file uploaded and no raw text provided.',
      });
    }

    // Clean up extracted text
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();

    if (!cleanedText || cleanedText.length < 10) {
      return res.status(400).json({
        error: 'The document appears to be empty or contains insufficient readable text. If this is a scanned PDF, optical character recognition (OCR) may be required.',
      });
    }

    const wordCount = countWords(cleanedText);
    const charCount = cleanedText.length;
    const paragraphCount = cleanedText.split(/\n\s*\n/).filter(Boolean).length;

    res.json({
      success: true,
      text: cleanedText,
      fileName,
      fileType,
      fileSize,
      wordCount,
      charCount,
      paragraphCount,
    });
  } catch (err: any) {
    console.error('Error in /api/extract-document:', err);
    res.status(500).json({
      error: 'An unexpected server error occurred during document extraction.',
      details: err.message,
    });
  } finally {
    console.info(`Document extraction completed in ${(performance.now() - extractionStartedAt).toFixed(0)}ms`);
  }
});

// Retry helper with exponential backoff for transient model capacity spikes
async function generateWithRetry(params: any, maxRetries = 2) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    const requestStartedAt = performance.now();
    try {
      const response = await ai.models.generateContent(params);
      console.info(
        `Gemini request (${params.model}, attempt ${attempt + 1}) completed in ${(performance.now() - requestStartedAt).toFixed(0)}ms`
      );
      return response;
    } catch (err: any) {
      const errMsg = String(err?.message || err);
      console.warn(
        `Gemini request (${params.model}, attempt ${attempt + 1}) failed after ${(performance.now() - requestStartedAt).toFixed(0)}ms: ${errMsg}`
      );
      const isTransient =
        errMsg.includes('503') ||
        errMsg.includes('429') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('RESOURCE_EXHAUSTED') ||
        errMsg.includes('ETIMEDOUT') ||
        errMsg.includes('ECONNRESET') ||
        errMsg.includes('ECONNREFUSED') ||
        /network|timeout|timed out|abort/i.test(errMsg);
      if (attempt >= maxRetries || !isTransient) {
        throw err;
      }
      attempt++;
      console.warn(`Transient Gemini error; retrying (${attempt}/${maxRetries}).`);
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Maximum retry attempts exceeded.');
}

// 3. Transformation Route
app.post('/api/transform', async (req, res) => {
  try {
    const {
      sourceText,
      targetAudience,
      readingLevel,
      tone,
      outputFormat,
      language,
      desiredLength,
      customInstructions,
    } = req.body;

    if (!sourceText || typeof sourceText !== 'string' || sourceText.trim().length === 0) {
      return res.status(400).json({ error: 'Source document text is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel in AI Studio.',
      });
    }

    // Truncate if astronomical; the selected model has a large context window.
    const trimmedSource = sourceText.trim();

    const systemInstruction = `You are Content Transformer, the intelligent document adaptation engine.
Your mission is to adapt a source document for a designated target audience, reading level, tone, output format, language, and length while maintaining absolute factual fidelity to the source text.

CORE OPERATIONAL PRINCIPLES:
1. SOURCE FIDELITY AS GROUND TRUTH: The uploaded source document is the sole factual authority. Do not invent external facts, fictional citations, imaginary statistics, or unsourced claims.
2. PRESERVATION OF ESSENTIAL CONTENT: Preserve the central thesis, pivotal arguments, key empirical findings, chronological events, and core conclusions.
3. RIGOROUS AUDIENCE & READING LEVEL ADAPTATION:
   - For Elementary/Young audiences: Use clear, friendly phrasing, concrete relatable everyday metaphors, short sentences, and define any necessary domain terms simply.
   - For High School/General Public: Balanced clarity, engaging structure, accessible vocabulary.
   - For Executive/C-Suite: High-impact synthesis, strategic implications, bullet points, bottom-line first (BLUF).
   - For Academic/Technical Experts: Precise domain nomenclature, methodological rigor, logical exposition.
4. RIGOROUS FORMAT ADAPTATION:
   - "Simplified Explanation": Clear conceptual breakdown with everyday analogies and intuitive sections.
   - "Executive Summary": Strategic brief with Problem/Context, Core Findings, Impact, and Recommendations.
   - "Structured Study Notes": Flashcard-style key concepts, definitions, bulleted takeaways, review points.
   - "Comprehensive FAQs": Natural question-and-answer pairs addressing the core questions a reader would ask.
   - "Interactive Q&A Quiz Format": Comprehension check questions with answers, explanations, and key learning objectives.
   - "Presentation Slide Outline": Slide-by-slide structure with Slide Title, Speaker Notes, and Key Visual / Bullet ideas.
   - "Formal Academic Report": Structured with Abstract/Overview, Methodology/Background, Discussion of Evidence, and Synthesized Conclusion.
5. SOURCE FIDELITY CHECKLIST:
   Provide an honest, transparent breakdown of what facts were strictly maintained and what secondary details were purposefully condensed or omitted to suit the requested length/reading level.

Format your output strictly as a JSON object matching the requested schema.`;

    const userPrompt = `SOURCE DOCUMENT CONTENT:
"""
${trimmedSource}
"""

TRANSFORMATION SPECIFICATIONS:
- Target Audience: ${targetAudience || 'General Public'}
- Reading Level: ${readingLevel || 'Standard High School'}
- Tone: ${tone || 'Objective & Informative'}
- Output Format: ${outputFormat || 'Simplified Explanation'}
- Target Language: ${language || 'English'}
- Desired Length: ${desiredLength || 'Moderate (~700 words)'}
- Additional Custom Instructions: ${customInstructions || 'None'}

Please produce a comprehensive, high-quality transformation adhering strictly to the source material.`;

    const response = await generateWithRetry({
      model: GEMINI_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for high factual accuracy and adherence
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'A clear, audience-tailored title for the transformed document.',
            },
            transformedContent: {
              type: Type.STRING,
              description:
                'The full transformed text formatted cleanly in Markdown (using #, ##, bullet points, bolding, callouts, or tables as appropriate for the selected output format).',
            },
            summaryOverview: {
              type: Type.STRING,
              description: 'A 2-3 sentence executive synopsis of the adaptation.',
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 core takeaways extracted faithfully from the source.',
            },
            fidelityChecklist: {
              type: Type.OBJECT,
              properties: {
                fidelityScore: {
                  type: Type.INTEGER,
                  description: 'Estimated source factual preservation percentage (e.g. 95 to 100).',
                },
                fidelityVerdict: {
                  type: Type.STRING,
                  description: 'Brief expert assessment of how faithfully the original meaning was conserved.',
                },
                preservedCoreFacts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Specific key facts, findings, or arguments faithfully preserved.',
                },
                omittedOrCondensedDetails: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      detail: { type: Type.STRING, description: 'The specific secondary detail or nuance.' },
                      reason: {
                        type: Type.STRING,
                        description:
                          'Academic rationale for condensing or omitting (e.g., simplified for 5th-grade audience, condensed to meet brevity constraint).',
                      },
                    },
                    required: ['detail', 'reason'],
                  },
                  description: 'Transparent log of secondary details condensed or omitted.',
                },
                conceptAdaptations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      originalConcept: { type: Type.STRING },
                      adaptedExplanation: { type: Type.STRING },
                    },
                    required: ['originalConcept', 'adaptedExplanation'],
                  },
                  description: 'How complex concepts were tailored for the chosen audience.',
                },
              },
              required: [
                'fidelityScore',
                'fidelityVerdict',
                'preservedCoreFacts',
                'omittedOrCondensedDetails',
                'conceptAdaptations',
              ],
            },
            metadata: {
              type: Type.OBJECT,
              properties: {
                targetAudience: { type: Type.STRING },
                readingLevelAchieved: { type: Type.STRING },
                toneAssessment: { type: Type.STRING },
                estimatedWordCount: { type: Type.INTEGER },
                estimatedReadingTimeMinutes: { type: Type.INTEGER },
              },
              required: ['targetAudience', 'readingLevelAchieved', 'toneAssessment', 'estimatedWordCount', 'estimatedReadingTimeMinutes'],
            },
          },
          required: [
            'title',
            'transformedContent',
            'summaryOverview',
            'keyTakeaways',
            'fidelityChecklist',
            'metadata',
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response received from the Gemini model.');
    }

    const parsedData = JSON.parse(responseText);

    // Compute exact word count of the generated transformed content
    if (parsedData.transformedContent) {
      parsedData.metadata.actualTransformedWordCount = countWords(parsedData.transformedContent);
    }

    res.json({
      success: true,
      result: parsedData,
    });
  } catch (err: any) {
    console.error('Error during transformation:', err);
    res.status(500).json({
      error: 'Transformation failed. Please try again or adjust your prompt parameters.',
      details: err.message || String(err),
    });
  }
});

// 4. Export DOCX Route
app.post('/api/export-docx', async (req, res) => {
  try {
    const { title, content, metadata, fidelityChecklist } = req.body;

    const docChildren: Paragraph[] = [];

    // Title
    docChildren.push(
      new Paragraph({
        text: title || 'Transformed Document — Content Transformer',
        heading: HeadingLevel.TITLE,
        spacing: { after: 200 },
      })
    );

    // Metadata header
    if (metadata) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Target Audience: ', bold: true }),
            new TextRun({ text: `${metadata.targetAudience || 'General'}  |  ` }),
            new TextRun({ text: 'Reading Level: ', bold: true }),
            new TextRun({ text: `${metadata.readingLevelAchieved || 'Standard'}  |  ` }),
            new TextRun({ text: 'Tone: ', bold: true }),
            new TextRun({ text: `${metadata.toneAssessment || 'Objective'}` }),
          ],
          spacing: { after: 300 },
        })
      );
    }

    // Divider
    docChildren.push(
      new Paragraph({
        children: [new TextRun({ text: '―'.repeat(30), color: '999999' })],
        spacing: { after: 300 },
      })
    );

    // Content paragraphs (split markdown by double newlines)
    const rawParagraphs = (content || '').split(/\n\s*\n/);
    for (const para of rawParagraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('# ')) {
        docChildren.push(
          new Paragraph({
            text: trimmed.replace(/^#\s+/, ''),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (trimmed.startsWith('## ')) {
        docChildren.push(
          new Paragraph({
            text: trimmed.replace(/^##\s+/, ''),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (trimmed.startsWith('### ')) {
        docChildren.push(
          new Paragraph({
            text: trimmed.replace(/^###\s+/, ''),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 160, after: 80 },
          })
        );
      } else {
        // Plain or bullet text
        const lines = trimmed.split('\n');
        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
            docChildren.push(
              new Paragraph({
                children: [new TextRun({ text: cleanLine.replace(/^[-*]\s+/, '') })],
                bullet: { level: 0 },
                spacing: { after: 80 },
              })
            );
          } else {
            docChildren.push(
              new Paragraph({
                children: [new TextRun({ text: cleanLine })],
                spacing: { after: 140 },
              })
            );
          }
        }
      }
    }

    // Source Fidelity Appendix
    if (fidelityChecklist) {
      docChildren.push(
        new Paragraph({
          text: 'Source Fidelity & Verification Checklist',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 120 },
        })
      );

      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Fidelity Score: `, bold: true }),
            new TextRun({ text: `${fidelityChecklist.fidelityScore || 95}%  —  ` }),
            new TextRun({ text: fidelityChecklist.fidelityVerdict || '' }),
          ],
          spacing: { after: 150 },
        })
      );

      if (fidelityChecklist.preservedCoreFacts && fidelityChecklist.preservedCoreFacts.length > 0) {
        docChildren.push(
          new Paragraph({
            children: [new TextRun({ text: 'Core Preserved Facts:', bold: true })],
            spacing: { before: 100, after: 80 },
          })
        );
        for (const fact of fidelityChecklist.preservedCoreFacts) {
          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: fact })],
              bullet: { level: 0 },
              spacing: { after: 60 },
            })
          );
        }
      }

      if (fidelityChecklist.omittedOrCondensedDetails && fidelityChecklist.omittedOrCondensedDetails.length > 0) {
        docChildren.push(
          new Paragraph({
            children: [new TextRun({ text: 'Omitted / Condensed Details (With Rationale):', bold: true })],
            spacing: { before: 140, after: 80 },
          })
        );
        for (const item of fidelityChecklist.omittedOrCondensedDetails) {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${item.detail}: `, bold: true }),
                new TextRun({ text: item.reason, italics: true }),
              ],
              bullet: { level: 0 },
              spacing: { after: 60 },
            })
          );
        }
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    const safeTitle = (title || 'transformed-document')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 40);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.docx"`);
    res.send(buffer);
  } catch (err: any) {
    console.error('Error exporting DOCX:', err);
    res.status(500).json({ error: 'Failed to generate DOCX file.', details: err.message });
  }
});

// Setup Vite or static serving
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Content Transformer Server running on port ${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error('Failed to start server:', err);
});

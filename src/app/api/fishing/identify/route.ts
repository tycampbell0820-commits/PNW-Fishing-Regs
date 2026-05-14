import { NextRequest, NextResponse } from 'next/server';

const IDENTIFY_PROMPT = `You are an expert Pacific Northwest fishing guide and fish taxonomist. Analyze this photo and identify the fish species.

Focus on Washington State / PNW species. Common ones: Chinook/King salmon, Coho salmon, Pink salmon, Chum salmon, Sockeye salmon, Steelhead, Rainbow trout, Cutthroat trout, Dolly Varden/Bull trout, Halibut, Lingcod, Rockfish (black, yelloweye, copper, quillback), Cabezon, Greenling, Dungeness crab, various surfperch, Pacific cod.

Respond ONLY with valid JSON, no markdown, no explanation outside the JSON:
{
  "species": "Common Name (e.g. Chinook Salmon)",
  "scientificName": "Genus species",
  "confidence": "High|Medium|Low",
  "features": ["key visible ID feature 1", "key visible ID feature 2", "key visible ID feature 3"],
  "confusionSpecies": [{"name": "Species that looks similar", "difference": "how to tell them apart"}],
  "waState": "1-2 sentences about this species in Washington - habitat, behavior, conservation status, best fishing times",
  "typicalSize": "typical size range (e.g. 18-36 inches, 10-40 lbs)",
  "notFish": false
}

If this is not a fish or aquatic species, set "notFish": true.
If image is too blurry/dark to identify, set confidence to "Low" and explain in species field.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, mimeType = 'image/jpeg' } = body as { image: string; mimeType?: string };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured on server. Add it to your .env.local file.' },
        { status: 500 }
      );
    }

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mimeType, data: image },
              },
              { type: 'text', text: IDENTIFY_PROMPT },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Anthropic API error: ${errText}` }, { status: 502 });
    }

    const data = await response.json();
    const text: string = data?.content?.[0]?.text ?? '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse response from AI' }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

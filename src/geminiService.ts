import { GoogleGenAI, Modality } from "@google/genai";

const POEM_TEXT = `هي نارٌ خُلقت لتضيء،
وهو ثلجٌ يرى في الاشتعال خطرًا.
هي صبحٌ يمشي بخطى واضحة،
وهو ليلٌ يرتاح في الظلال.
لا عيب في الليل،
ولا نقص في الثلج،
لكن الشمس إن انطفأت كي لا تذيب الجليد،
لم تعد شمسًا.
تعبت من محاولة الاعتدال بين الاحتراق والتجمد،
من أن تقيس وهجها كي لا يذوب ما حولها،
ومن أن تعتذر عن الضوء كأنه خطيئة.
- روان`;

export async function generatePoemAudio() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this Arabic poem beautifully and emotionally as an Arabian girl: ${POEM_TEXT}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return addWavHeader(base64Audio, 24000);
    }
  } catch (error) {
    console.error("Error generating audio:", error);
  }
  return null;
}

function addWavHeader(base64Pcm: string, sampleRate: number): string {
  const pcmData = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0));
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const buffer = new ArrayBuffer(headerSize);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, totalSize - 8, true);
  // WAVE identifier
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // fmt chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true);

  const combined = new Uint8Array(totalSize);
  combined.set(new Uint8Array(buffer));
  combined.set(pcmData, headerSize);

  let binary = '';
  for (let i = 0; i < combined.length; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

export { POEM_TEXT };

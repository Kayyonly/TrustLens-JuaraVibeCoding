// lib/cleanOCRText.ts

// Lightweight dictionary for common Indonesian OCR typos
const OCR_TYPO_DICTIONARY: Record<string, string> = {
  saklt: "sakit",
  Blsa: "Bisa",
  nom0r: "nomor",
  sekaranq: "sekarang",
  "0ke": "Oke",
  "1ya": "Iya",
  "b!sa": "bisa",
  t0long: "tolong",
  darl: "dari",
  krlm: "kirim"
};

/**
 * Preprocesses and cleans raw OCR text to reduce token usage
 * and improve AI analysis accuracy.
 */
export function cleanOCRText(rawText: string): string {
  let text = rawText;

  // 1. Remove Timestamps (e.g., 11:42, 09:00 AM)
  text = text.replace(/\b\d{1,2}:\d{2}(?:\s?[aApP][mM])?\b/g, "");

  // 2. Remove UI Junk & System Indicators
  const uiJunkRegex = /\b(online|typing\.*|4G|5G|LTE|VoLTE|WiFi|read|delivered|today|yesterday|pesan|panggilan|kamera|status)\b/gi;
  text = text.replace(uiJunkRegex, "");

  // 3. Remove excessive symbols (reduces "!!!!@@@###" to "!")
  text = text.replace(/([!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])\1{2,}/g, "$1");

  // 4. Apply Common Typo Fixes
  Object.entries(OCR_TYPO_DICTIONARY).forEach(([typo, fix]) => {
    const regex = new RegExp(`\\b${typo}\\b`, "gi");
    text = text.replace(regex, fix);
  });

  // 5. Clean up whitespaces and split into lines
  const lines = text.split("\n")
    .map(line => line.replace(/\s{2,}/g, " ").trim()) // remove duplicate spaces
    .filter(line => line.length > 0);

  // 6. Remove consecutive duplicate lines (common in glitchy OCR)
  const uniqueLines = lines.filter((line, index, arr) => 
    index === 0 || line !== arr[index - 1]
  );

  // 7. Merge broken sentence fragments
  // If a line ends with a letter/comma and the next starts with lowercase, merge them.
  const mergedLines: string[] = [];
  for (let i = 0; i < uniqueLines.length; i++) {
    const current = uniqueLines[i];
    if (i < uniqueLines.length - 1) {
      const next = uniqueLines[i + 1];
      if (/[a-zA-Z0-9,]$/.test(current) && /^[a-z]/.test(next)) {
        uniqueLines[i + 1] = current + " " + next;
        continue;
      }
    }
    mergedLines.push(current);
  }

  return mergedLines.join("\n").trim();
}

/**
 * Evaluates the quality of the cleaned text to detect if the OCR output is garbage.
 */
export function assessOCRQuality(cleanedText: string): boolean {
  if (cleanedText.length < 15) return true; // Too short to be useful
  
  // Calculate noise ratio: if letters & numbers make up less than 50% of the text, it's mostly noise.
  const alphanumericCount = (cleanedText.match(/[a-zA-Z0-9]/g) || []).length;
  if (alphanumericCount / cleanedText.length < 0.5) return true;

  return false; // Good quality
}
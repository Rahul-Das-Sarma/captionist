import { CaptionSegment, CaptionStyle } from "../types.js";

function hexToAssColor(hex: string) {
  const m = hex.replace("#", "");
  const rr = m.substring(0, 2);
  const gg = m.substring(2, 4);
  const bb = m.substring(4, 6);
  return `&H${bb}${gg}${rr}&`;
}

function positionToAlignment(position: CaptionStyle["position"]) {
  if (position === "top") return 8;
  if (position === "center") return 5;
  return 2;
}

export function buildAssFileContent(
  captions: CaptionSegment[],
  style: CaptionStyle,
  videoWidth = 1080,
  videoHeight = 1920
) {
  const alignment = positionToAlignment(style.position);
  const primaryColor = hexToAssColor(style.color);
  const backColor = hexToAssColor(style.backgroundColor);

  const header = [
    "[Script Info]",
    "ScriptType: v4.00+",
    "Collisions: Normal",
    "WrapStyle: 2",
    `PlayResX: ${videoWidth}`,
    `PlayResY: ${videoHeight}`,
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, " +
      "Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, " +
      "Alignment, MarginL, MarginR, MarginV, Encoding",
    `Style: Default,${style.fontFamily},${style.fontSize},${primaryColor},&H000000FF&,${backColor},${backColor},` +
      `0,0,0,0,100,100,0,0,1,0,0,${alignment},20,20,20,0`,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"
  ].join("\n");

  const toAssTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const cs = Math.floor((sec % 1) * 100);
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
  };

  const events = captions.map((c) => {
    const start = toAssTime(c.startTime);
    const end = toAssTime(c.endTime);
    const text = c.text.replace(/\n/g, "\\N").replace(/,/g, "\\,");
    return `Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`;
  });

  return `${header}\n${events.join("\n")}\n`;
}


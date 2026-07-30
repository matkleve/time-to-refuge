import { Person } from "./types";
import { renderPersonCardPng } from "./card-image";

export type ShareResult = "shared" | "downloaded" | "cancelled" | "unavailable";

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "person"
  );
}

/**
 * Shares the person's card as a PNG through the OS share sheet, falling back to
 * downloading the image where the Web Share API can't take files (desktop
 * browsers, and iOS Safari over plain HTTP).
 */
export async function sharePerson(person: Person): Promise<ShareResult> {
  const blob = await renderPersonCardPng(person);
  if (!blob) return "unavailable";

  const filename = `refuge-${slugify(person.name)}.png`;
  const file = new File([blob], filename, { type: "image/png" });

  if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `${person.name} — Time to Refuge` });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
      // Any other failure falls through to the download path below.
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return "downloaded";
}

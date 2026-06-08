import type { Note } from "@hackmd/api/dist/type";
import type { PinnedNote } from "../hooks/usePinnedNotes";
import { getNoteUrl } from "./noteHelper";

export type NoteWithCachedUrl = Note & { cachedNoteUrl?: string };

export function buildPinnedNote(note: Note): PinnedNote {
  return {
    noteId: note.id,
    pinnedAt: Date.now(),
    title: note.title,
    noteUrl: getNoteUrl(note),
    teamPath: note.teamPath ?? undefined,
    tags: note.tags,
    lastChangedAt: note.lastChangedAt,
  };
}

export function createNoteFromPinned(pin: PinnedNote): NoteWithCachedUrl {
  const pinnedAt = pin.pinnedAt;
  const lastChangedAt = pin.lastChangedAt ?? new Date(pinnedAt).toISOString();

  return {
    id: pin.noteId,
    title: pin.title || "Pinned note",
    tags: pin.tags ?? [],
    lastChangedAt,
    createdAt: lastChangedAt,
    lastChangeUser: null,
    publishType: "view",
    publishedAt: null,
    userPath: null,
    teamPath: pin.teamPath ?? null,
    permalink: null,
    shortId: pin.noteId,
    publishLink: pin.noteUrl ?? "",
    readPermission: "guest",
    writePermission: "guest",
    cachedNoteUrl: pin.noteUrl,
  } as NoteWithCachedUrl;
}

export function getDisplayNoteUrl(note: NoteWithCachedUrl, editMode = false): string {
  const baseUrl = note.cachedNoteUrl || getNoteUrl(note);
  if (!editMode) {
    return baseUrl;
  }
  return baseUrl.endsWith("/edit") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/edit`;
}

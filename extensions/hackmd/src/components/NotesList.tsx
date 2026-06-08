import type { Note } from "@hackmd/api/dist/type";
import { type ReactElement, useMemo } from "react";
import { List } from "@raycast/api";
import NoteListItem from "./NoteListItem";
import { usePinnedNotes } from "../hooks/usePinnedNotes";
import { createNoteFromPinned } from "../helpers/pinnedNote";

const sortByLastChanged = (a: Note, b: Note) =>
  new Date(b.lastChangedAt).valueOf() - new Date(a.lastChangedAt).valueOf();

const sortCategoryByLastChanged = (a: [string, Note[]], b: [string, Note[]]) => {
  const [aCategory, aNotes] = a;
  const [bCategory, bNotes] = b;

  if (aCategory === "No Category") {
    return -1;
  }
  if (bCategory === "No Category") {
    return 1;
  }

  return sortByLastChanged(aNotes[0], bNotes[0]);
};

export default function NotesList({
  notes,
  isLoading,
  mutate,
  searchBarAccessory,
  sortByCategory,
  unpinnedSectionTitle,
}: {
  notes?: Note[];
  mutate?: () => void;
  isLoading: boolean;
  searchBarAccessory?: ReactElement<List.Dropdown.Props, string>;
  sortByCategory?: boolean;
  unpinnedSectionTitle?: string;
}) {
  const { pinnedNotesMap } = usePinnedNotes();

  const { pinnedNotes, unpinnedNotes } = useMemo(() => {
    const notesList = notes ?? [];

    const pinByNoteId = new Map<string, (typeof pinnedNotesMap)[string][number]>();
    for (const workspacePins of Object.values(pinnedNotesMap)) {
      for (const pin of workspacePins) {
        const existing = pinByNoteId.get(pin.noteId);
        if (!existing || pin.pinnedAt > existing.pinnedAt) {
          pinByNoteId.set(pin.noteId, pin);
        }
      }
    }

    const notesById = new Map(notesList.map((note) => [note.id, note]));
    const pinnedIds = new Set(pinByNoteId.keys());

    const pinned = [...pinByNoteId.values()]
      .sort((a, b) => b.pinnedAt - a.pinnedAt)
      .map((pin) => notesById.get(pin.noteId) ?? createNoteFromPinned(pin));

    const unpinned = notesList.filter((note) => !pinnedIds.has(note.id)).sort(sortByLastChanged);

    return { pinnedNotes: pinned, unpinnedNotes: unpinned };
  }, [notes, pinnedNotesMap]);

  const groupedNotesByCategory = useMemo(() => {
    const groupedNotes = unpinnedNotes.reduce(
      (acc, note) => {
        const category = (note.tags?.length > 0 && Array.isArray(note.tags) && note.tags[0]) || "No Category";

        if (!acc[category]) {
          acc[category] = [note];
        } else {
          acc[category].push(note);
        }

        return acc;
      },
      {} as Record<string, Note[]>,
    );

    return Object.entries(groupedNotes).sort(sortCategoryByLastChanged);
  }, [unpinnedNotes]);

  const groupedNotesByWorkspace = useMemo(() => {
    const grouped = unpinnedNotes.reduce(
      (acc, note) => {
        const workspace = note.teamPath || "Personal Workspace";
        if (!acc[workspace]) {
          acc[workspace] = [];
        }
        acc[workspace].push(note);
        return acc;
      },
      {} as Record<string, Note[]>,
    );

    return Object.entries(grouped).sort(([a], [b]) => {
      if (a === "Personal Workspace") return -1;
      if (b === "Personal Workspace") return 1;
      return a.localeCompare(b);
    });
  }, [unpinnedNotes]);

  return (
    <List isLoading={isLoading} searchBarAccessory={searchBarAccessory}>
      {pinnedNotes.length > 0 && (
        <List.Section title="Pinned" subtitle={`${pinnedNotes.length}`}>
          {pinnedNotes.map((note) => (
            <NoteListItem note={note} key={note.id} mutate={mutate} />
          ))}
        </List.Section>
      )}

      {sortByCategory ? (
        groupedNotesByCategory.map(([category, notes]) => (
          <List.Section key={category} title={category}>
            {notes.map((note) => (
              <NoteListItem note={note} key={note.id} mutate={mutate} />
            ))}
          </List.Section>
        ))
      ) : unpinnedSectionTitle ? (
        <List.Section title={unpinnedSectionTitle}>
          {unpinnedNotes.map((note) => (
            <NoteListItem note={note} key={note.id} mutate={mutate} />
          ))}
        </List.Section>
      ) : (
        groupedNotesByWorkspace.map(([workspace, notes]) => (
          <List.Section key={workspace} title={workspace === "Personal Workspace" ? workspace : `Team: ${workspace}`}>
            {notes.map((note) => (
              <NoteListItem note={note} key={note.id} mutate={mutate} />
            ))}
          </List.Section>
        ))
      )}
    </List>
  );
}

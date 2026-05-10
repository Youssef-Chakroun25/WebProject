import NoteItem from "./NoteItem.js";
import "./NoteList.css";

function NoteList({ notes, onEdit, onDelete, loading }) {
  if (!notes.length) {
    return (
      <section className="empty-notes">
        <h3>Aucune note trouvée</h3>
        <p>Commence par ajouter ta première note personnelle.</p>
      </section>
    );
  }

  return (
    <section className="note-list">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
        />
      ))}
    </section>
  );
}

export default NoteList;

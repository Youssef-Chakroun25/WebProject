import "./NoteItem.css";

const priorityClassMap = {
  low: "low",
  medium: "medium",
  high: "high"
};

const priorityLabelMap = {
  low: "Basse",
  medium: "Moyenne",
  high: "Haute"
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function NoteItem({ note, onEdit, onDelete, loading }) {
  const priorityClass = priorityClassMap[note.priority] || "medium";

  return (
    <article className={`note-item ${priorityClass}`}>
      <div className="note-header">
        <h3>{note.title}</h3>
        <span className={`priority-badge ${priorityClass}`}>
          {priorityLabelMap[note.priority] || note.priority}
        </span>
      </div>

      <p className="note-content">{note.content || "Aucun contenu."}</p>

      <div className="note-actions">
        <button type="button" onClick={() => onEdit(note)}>
          Modifier
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => onDelete(note.id)}
          disabled={loading}
        >
          Supprimer
        </button>
      </div>

      <p className="note-date">{formatDate(note.created_at)}</p>
    </article>
  );
}

export default NoteItem;

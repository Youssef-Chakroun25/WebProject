import { useEffect, useState } from "react";
import "./NoteForm.css";

const defaultState = {
  title: "",
  content: "",
  priority: "medium"
};

function NoteForm({ onSubmit, selectedNote, loading, onCancelEdit }) {
  const [formData, setFormData] = useState(defaultState);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (selectedNote) {
      setFormData({
        title: selectedNote.title ?? "",
        content: selectedNote.content ?? "",
        priority: selectedNote.priority ?? "medium"
      });
      return;
    }
    setFormData(defaultState);
  }, [selectedNote]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    const title = formData.title.trim();
    const content = formData.content.trim();
    if (!title) {
      setLocalError("Le titre est obligatoire.");
      return;
    }

    if (title.length > 100) {
      setLocalError("Le titre ne doit pas dépasser 100 caractères.");
      return;
    }

    if (!content) {
      setLocalError("Le contenu est obligatoire.");
      return;
    }

    await onSubmit({
      ...formData,
      title,
      content
    });

    if (!selectedNote) {
      setFormData(defaultState);
    }
  };

  return (
    <section className="note-form-card">
      <h2>{selectedNote ? "Modifier une note" : "Ajouter une note"}</h2>

      <form onSubmit={handleSubmit} className="note-form">
        <label htmlFor="title">Titre *</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          maxLength={100}
          placeholder="Ex: Réviser React Hooks"
          required
        />

        <label htmlFor="content">Contenu</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={4}
          placeholder="Décris ta note..."
          required
        />

        <label htmlFor="priority">Priorité</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">🟢Basse</option>
          <option value="medium">🟡Moyenne</option>
          <option value="high">🔴Haute</option>
        </select>

        {localError ? <p className="form-error">{localError}</p> : null}

        <div className="note-form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Traitement..." : selectedNote ? "Mettre à jour" : "Ajouter"}
          </button>
          {selectedNote ? (
            <button type="button" className="secondary" onClick={onCancelEdit}>
              Annuler
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default NoteForm;

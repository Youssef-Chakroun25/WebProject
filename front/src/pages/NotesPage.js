import { useEffect, useMemo, useState } from "react";
import client from "../api/client.js";
import NoteForm from "../components/NoteForm.js";
import NoteList from "../components/NoteList.js";
import AlertMessage from "../components/AlertMessage.js";
import { useAuth } from "../context/AuthContext.js";
import "./NotesPage.css";

function NotesPage() {
  const { currentUser, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageMessage, setPageMessage] = useState({ type: "", text: "" });
  const [filter, setFilter] = useState("all");
  const priorityRank = { high: 0, medium: 1, low: 2 };

  const handleApiError = (error) => {
    const status = error.response?.status;
    if (status === 401) {
      setPageMessage({
        type: "error",
        text: "Session expirée, reconnecte-toi.",
      });
      logout();
      return;
    }
    if (status === 404) {
      setPageMessage({ type: "error", text: "Ressource non trouvée." });
      return;
    }
    if (status === 422) {
      setPageMessage({
        type: "error",
        text: "Données invalides, vérifie les champs avant de continuer.",
      });
      return;
    }
    setPageMessage({ type: "error", text: "Une erreur est survenue." });
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await client.get("/notes");
      const incomingNotes = Array.isArray(data?.data) ? data.data : [];
      const sortedNotes = [...incomingNotes].sort((a, b) => {
        const priorityDiff =
          (priorityRank[a.priority] ?? 99) - (priorityRank[b.priority] ?? 99);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setNotes(sortedNotes);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const submitNote = async (payload) => {
    setLoading(true);
    try {
      if (selectedNote) {
        await client.put(`/notes/${selectedNote.id}`, payload);
        setPageMessage({ type: "success", text: "Note modifiée avec succès." });
        setSelectedNote(null);
      } else {
        await client.post("/notes", payload);
        setPageMessage({ type: "success", text: "Note ajoutée avec succès." });
      }
      await fetchNotes();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    const confirmed = window.confirm(
      "Confirmer la suppression définitive de cette note ?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await client.delete(`/notes/${id}`);
      setPageMessage({ type: "success", text: "Note supprimée avec succès." });
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
      await fetchNotes();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = useMemo(() => {
    if (filter === "all") return notes;
    return notes.filter((note) => note.priority === filter);
  }, [notes, filter]);

  return (
    <main className="notes-page">
      <header className="notes-header">
        <div>
          <p className="welcome-line">
            Bienvenue {currentUser?.name || "Utilisateur"}</p>
          <h1>Mes notes personnelles</h1>
        </div>
        <button className="logout-button" type="button" onClick={logout}>
          Déconnexion
        </button>
      </header>

      <AlertMessage type={pageMessage.type} message={pageMessage.text} />

      <section className="notes-layout">
        <div className="left-panel">
          <NoteForm
            onSubmit={submitNote}
            selectedNote={selectedNote}
            loading={loading}
            onCancelEdit={() => setSelectedNote(null)}
          />
        </div>

        <div className="right-panel">
          <div className="list-toolbar">
            <h2>Liste des notes</h2>
            <div className="filter-box">
              <label htmlFor="priority-filter">Filtrer par priorité :</label>
              <select
                id="priority-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Toutes</option>
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>

          {loading && !notes.length ? <p>Chargement des notes...</p> : null}

          <NoteList
            notes={filteredNotes}
            onEdit={setSelectedNote}
            onDelete={deleteNote}
            loading={loading}
          />
        </div>
      </section>
    </main>
  );
}

export default NotesPage;

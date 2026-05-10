import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard.js";
import AlertMessage from "../components/AlertMessage.js";
import { useAuth } from "../context/AuthContext.js";
import "./RegisterPage.css";

function RegisterPage() {
  const { register, authError, setAuthError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAuthError("");

    try {
      await register(formData);
    } catch (error) {
      if (error.response?.status === 422) {
        setAuthError("Données invalides. Vérifie les champs saisis.");
      } else {
        setAuthError("Erreur serveur. Réessaie dans un instant.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Inscription"
      subtitle="Crée ton compte pour commencer à organiser tes notes."
    >
      <AlertMessage type="error" message={authError} />
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nom d'utilisateur</label>
        <input
          id="name"
          type="text"
          placeholder="Votre nom"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          minLength={6}
          placeholder="Crée votre mot de passe"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Inscription..." : "Créer le compte"}
        </button>
      </form>

      <p className="auth-link-line">
        Déjà inscrit ? <Link to="/login">Se connecter</Link>
      </p>
    </AuthCard>
  );
}

export default RegisterPage;

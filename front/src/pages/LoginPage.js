import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard.js";
import AlertMessage from "../components/AlertMessage.js";
import { useAuth } from "../context/AuthContext.js";
import "./LoginPage.css";

function LoginPage() {
  const { login, authError, setAuthError } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      await login(formData);
    } catch (error) {
      if (error.response?.status === 401) {
        setAuthError("Données invalides.");
      } else {
        setAuthError("Erreur serveur. Réessaie dans un instant.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Connexion"
      subtitle="Accède à ton espace pour gérer tes notes personnelles."
    >
      <AlertMessage type="error" message={authError} />
      <form className="auth-form" onSubmit={handleSubmit}>
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
          placeholder="Tapez Votre mot de passe..."
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="auth-link-line">
        Pas de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </AuthCard>
  );
}

export default LoginPage;

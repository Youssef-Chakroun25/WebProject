import "./AuthCard.css";
import authVisual from "../../photo.png";

function AuthCard({ title, subtitle, children }) {
  return (
    <main className="auth-shell">
      <section className="auth-layout">
        <article className="auth-card">
          <div className="auth-brand-inline">
            <span className="auth-brand">Mon Pense-Bête</span>
            <span className="auth-brand-sub">Notes personnelles</span>
          </div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
        </article>

        <aside className="auth-visual" aria-hidden="true">
          <img src={authVisual} alt="" />
        </aside>
      </section>
    </main>
  );
}

export default AuthCard;

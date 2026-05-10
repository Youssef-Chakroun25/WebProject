import "./AlertMessage.css";

function AlertMessage({ type = "info", message }) {
  if (!message) return null;

  return <div className={`alert-message ${type}`}>{message}</div>;
}

export default AlertMessage;

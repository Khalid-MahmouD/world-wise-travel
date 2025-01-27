import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Message from "../components/Message";
import { toast } from "react-toastify";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  function handleForm(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password, setError);
      toast.success("You have successfully logged in!"); // Trigger toast notification
      
    }

  }
  useEffect(function () {
    if (isAuthenticated) navigate('/app', { replace: true });
    if (!isAuthenticated) <Message message={"NOT AUTHORIZED"} />
  }, [isAuthenticated, navigate]);
  return (
    <main className={styles.login} >
      <PageNav />
      <form className={styles.form} onSubmit={handleForm}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="error">
          {error && <Message message={error} />} {/* Display error message */}
        </div>
        <div>
          <Button type='primary'>Login</Button>
        </div>
      </form>
    </main>
  );
}

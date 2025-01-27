import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import styles from "./User.module.css";
import { toast } from "react-toastify";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  function handleClick() {
    logout();
    toast.error("You have successfully logged out!");
    navigate("/", { replace: true });
  }
  
  if (!user) return null;

  return (
    <div className={styles.user}>
      <img src={user.avatar} alt={user.name} />
      <span>Welcome, {user.name}</span>
      <button onClick={handleClick} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

export default User;

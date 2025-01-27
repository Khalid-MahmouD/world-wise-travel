import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import styles from "./AppLayout.module.css";
import User from '../components/User'
import {ToastContainer } from "react-toastify";

function AppLayout() {
  
  return (
    <div className={styles.app}>

      <Sidebar />
      <Map />
      <User />


    </div>
  );
}

export default AppLayout;

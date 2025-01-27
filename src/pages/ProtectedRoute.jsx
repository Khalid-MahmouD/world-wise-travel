import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext"
import { useEffect } from "react";

function ProtectedRoute({ children, redirectTo = "/" }) {
    const {isAuthenticated} = useAuth();
   const navigate = useNavigate();
   useEffect(function(){
    if(!isAuthenticated) navigate(redirectTo)
   },[isAuthenticated, navigate, redirectTo])
   return isAuthenticated ? children : null; // Render children only if authenticated

}

export default ProtectedRoute

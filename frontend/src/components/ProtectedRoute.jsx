import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there is no user logged in, kick them back to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, let them see the page
  return children;
};

export default ProtectedRoute;
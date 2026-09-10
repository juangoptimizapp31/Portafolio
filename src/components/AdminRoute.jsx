import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AdminRoute = ({ children }) => {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    if (user === undefined) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

export default AdminRoute;
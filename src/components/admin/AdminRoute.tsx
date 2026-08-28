import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { ShieldAlert } from 'lucide-react';

export function AdminRoute() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userExists, setUserExists] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserExists(true);
        const email = (user.email || '').toLowerCase().trim();
        const isMasterAdminEmail = email === 'xpzunayed01@gmail.com' || email === 'xpeee01@gmail.com' || email.includes('xpzunayed');

        try {
          const adminRef = doc(db, 'admins', user.uid);
          const adminDoc = await getDoc(adminRef);

          if (adminDoc.exists() || isMasterAdminEmail) {
            setIsAdmin(true);
            // Ensure admin doc exists in Firestore
            if (!adminDoc.exists()) {
              await setDoc(adminRef, {
                email: user.email,
                role: 'super_admin',
                createdAt: new Date().toISOString(),
              }, { merge: true });
            }
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.warn("Admin verification notice:", error);
          if (isMasterAdminEmail) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } else {
        setUserExists(false);
        setIsAdmin(false);
      }
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F4]">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-800 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!userExists) {
    return <Navigate to="/xpzunayed" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F4] p-4 text-center">
        <ShieldAlert size={48} className="text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6 max-w-sm">
          Your account is not registered as an administrator for Medilux.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return <Outlet />;
}

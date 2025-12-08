// ============================================
// AUTH CONTEXT - Sistema de Autenticación (Admin + Clientes)
// ============================================

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  COLLECTIONS,
} from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { sendVerificationEmail } from "../services/emailService";

// Tipos para usuario cliente
export interface ClientUser {
  id: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  city?: string;
  emailVerified?: boolean;
  isVerified?: boolean;
  verificationCode?: string | null;
}

interface AuthContextType {
  // Admin
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;

  // Cliente
  clientUser: ClientUser | null;
  loading: boolean;
  loginClient: (email: string, password: string) => Promise<void>;
  registerClient: (
    userData: ClientUser & { password: string }
  ) => Promise<void>;
  logoutClient: () => Promise<void>;
  updateClientData: (data: Partial<ClientUser>) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  verifyEmailCode: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = "admin123";
const ADMIN_EMAIL = "admin@minimoda.com";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estado Admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Estado Cliente
  // Estado Cliente
  const [clientUser, setClientUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado temporal para registro (datos antes de crear usuario en Firebase)
  const [tempUserData, setTempUserData] = useState<
    (ClientUser & { password: string; code: string }) | null
  >(null);

  // Efecto para monitorear el estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuario autenticado, obtener datos adicionales de Firestore
        try {
          const userDoc = await getDoc(doc(db, COLLECTIONS.USUARIOS, user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as ClientUser;
            setClientUser({
              ...userData,
              id: user.uid,
              email: user.email || "",
              emailVerified: user.emailVerified,
              isVerified: true,
            });
          } else {
            // Caso raro: usuario en Auth pero no en Firestore
            setClientUser({
              id: user.uid,
              name: user.displayName || "Usuario",
              email: user.email || "",
              isVerified: user.emailVerified,
            });
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      } else {
        setClientUser(null);
      }
      setLoading(false);
    });

    // Verificar sesión Admin (local)
    const savedAdmin = localStorage.getItem("isAdmin");
    if (savedAdmin === "true") setIsAdmin(true);

    return () => unsubscribe();
  }, []);

  // --- Funciones Admin ---
  const loginAdmin = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    window.location.hash = "#/";
  };

  // --- Funciones Cliente (Firebase) ---
  const loginClient = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Verificar estado en Firestore
      const userDoc = await getDoc(
        doc(db, COLLECTIONS.USUARIOS, userCredential.user.uid)
      );
      if (userDoc.exists()) {
        const userData = userDoc.data() as ClientUser;
        if (userData.isVerified === false) {
          // Si no está verificado pero logueó correctamente, forzamos cierre para pedir código
          await signOut(auth);
          throw new Error("email-not-verified");
        }
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const registerClient = async (
    userData: ClientUser & { password: string }
  ): Promise<void> => {
    try {
      // 1. Generar código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // 2. Enviar Email
      const emailSent = await sendVerificationEmail(
        userData.email,
        userData.name,
        code
      );
      if (!emailSent) {
        console.log(`[FALLBACK EMAIL] Código para ${userData.email}: ${code}`);
      }

      // 3. Guardar en estado temporal (NO crear en Firebase aún)
      setTempUserData({
        ...userData,
        code: code,
      });
      console.log("Datos temporales guardados, esperando verificación...");
    } catch (error: any) {
      console.error("Error en inicio de registro:", error);
      throw error;
    }
  };

  const verifyEmailCode = async (code: string): Promise<boolean> => {
    // CASO 1: Verificación durante el registro (Usuario NO existe en Auth ni Firestore aún)
    if (tempUserData) {
      if (tempUserData.code === code) {
        try {
          // Ahora sí creamos el usuario en Firebase
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            tempUserData.email,
            tempUserData.password
          );
          const user = userCredential.user;

          // Guardamos en Firestore
          const { password, code, ...userProfile } = tempUserData;

          await setDoc(doc(db, COLLECTIONS.USUARIOS, user.uid), {
            ...userProfile,
            isVerified: true, // Ya validó
            verificationCode: null,
            createdAt: new Date().toISOString(),
          });

          // Limpiar temporal
          setTempUserData(null);
          return true;
        } catch (err) {
          console.error("Error creando usuario final:", err);
          return false;
        }
      } else {
        return false; // Código incorrecto
      }
    }

    // CASO 2: Verificación de usuario ya existente (fallback)
    if (auth.currentUser) {
      return false;
    }

    return false;
  };

  const logoutClient = async (): Promise<void> => {
    try {
      await signOut(auth);
      setClientUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const updateClientData = async (data: Partial<ClientUser>): Promise<void> => {
    if (!auth.currentUser) return;
    try {
      await setDoc(doc(db, COLLECTIONS.USUARIOS, auth.currentUser.uid), data, {
        merge: true,
      });
      setClientUser((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      console.error("Error actualizando datos:", error);
      throw error;
    }
  };

  const resendVerificationEmail = async () => {
    // Si estamos en flujo de registro temporal
    if (tempUserData) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Actualizar código en temp
      setTempUserData({ ...tempUserData, code });

      const sent = await sendVerificationEmail(
        tempUserData.email,
        tempUserData.name,
        code
      );
      if (!sent) console.log(`[REENVÍO FALLBACK] ${code}`);
      return;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        loginAdmin,
        logoutAdmin,
        clientUser,
        loading,
        loginClient,
        registerClient,
        logoutClient,
        updateClientData,
        resendVerificationEmail,
        verifyEmailCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

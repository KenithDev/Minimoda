import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { X, ArrowRight, RotateCcw } from "lucide-react";

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClientAuthModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ClientAuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  // @ts-ignore - verifyEmailCode y resendVerificationEmail existen en AuthContext
  const {
    loginClient,
    registerClient,
    verifyEmailCode,
    resendVerificationEmail,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  // Reseteamos el estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setShowVerificationStep(false);
      setVerificationCode("");
      setError("");
    }
  }, [isOpen]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    city: "",
  });
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const mapFirebaseError = (err: any) => {
    const code =
      err.message === "email-not-verified" ? "email-not-verified" : err.code;

    if (code === "email-not-verified") {
      return "user-unverified";
    }
    if (
      code === "auth/invalid-credential" ||
      code === "auth/wrong-password" ||
      code === "auth/user-not-found"
    ) {
      return "Correo o contraseña incorrectos";
    }
    if (code === "auth/email-already-in-use") {
      return "El correo ya está registrado";
    }
    if (code === "auth/weak-password") {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    return "Ocurrió un error. Inténtalo de nuevo.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await loginClient(formData.email, formData.password);
        onSuccess();
        onClose();
      } else {
        // Registro
        await registerClient({
          id: "",
          name: formData.name,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          phone: formData.phone,
          city: formData.city,
        });

        // Cambiar a paso de verificación
        setShowVerificationStep(true);
      }
    } catch (err: any) {
      console.error(err);
      const msg = mapFirebaseError(err);

      if (msg === "user-unverified") {
        setShowVerificationStep(true);
        setError(
          "Cuenta no verificada. Ingresa el código enviado a tu correo."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isValid = await verifyEmailCode(verificationCode);
      if (isValid) {
        onSuccess();
        onClose();
      } else {
        setError("Código incorrecto. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Error al verificar.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    await resendVerificationEmail();
    alert("¡Código reenviado! Revisa la consola (simulación) o tu correo.");
  };

  if (showVerificationStep) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
          {/* Header Simple */}
          <div className="bg-[#5A4633] p-6 text-white text-center relative overflow-hidden">
            <h2 className="text-2xl font-black mb-1 relative z-10">
              Verificación
            </h2>
            <p className="text-orange-100 text-sm relative z-10">
              Ingresa el código enviado a {formData.email}
            </p>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 text-[#5A4633] rounded-full mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <p className="text-gray-600 text-sm">
                Hemos enviado un código de 6 dígitos. <br />
                <span className="text-xs text-gray-400">
                  (Revisa la consola del navegador para ver el código simulado)
                </span>
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 border-b-2 border-gray-200 focus:border-[#5A4633] outline-none transition-all placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-300 text-[#5A4633]"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center animate-in shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || verificationCode.length < 6}
                className="w-full bg-[#5A4633] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#3D2F24] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Verificar <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleResendCode}
                className="text-sm font-semibold text-gray-500 hover:text-[#5A4633] flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Reenviar código
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#5A4633] p-8 text-white flex justify-between items-center relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight mb-1">
              {isLogin ? "Bienvenido de nuevo" : "Únete a Minimoda"}
            </h2>
            <p className="text-orange-100 text-sm font-medium">
              {isLogin
                ? "Ingresa a tu cuenta para continuar"
                : "Crea una cuenta y disfruta de beneficios exclusivos"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all hover:rotate-90 duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 shrink-0">
          <button
            className={`flex-1 py-5 font-bold text-lg transition-all relative ${
              isLogin
                ? "text-[#5A4633] bg-white shadow-sm"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            type="button"
          >
            Ingresar
            {isLogin && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5A4633] rounded-t-full mx-12"></div>
            )}
          </button>
          <button
            className={`flex-1 py-5 font-bold text-lg transition-all relative ${
              !isLogin
                ? "text-[#5A4633] bg-white shadow-sm"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            type="button"
          >
            Registrarse
            {!isLogin && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#5A4633] rounded-t-full mx-12"></div>
            )}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                required
                className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              required
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          {!isLogin && (
            <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Dirección de Envío
                </label>
                <input
                  type="text"
                  placeholder="Av. Principal 123, Dpto 401"
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    placeholder="Lima"
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="999 999 999"
                    className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white text-lg"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-xl text-sm font-medium flex items-center gap-3 animate-in shake">
              <span className="text-2xl">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5A4633] text-white py-5 rounded-xl font-black text-lg hover:bg-[#3D2F24] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:scale-98 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            )}
            {isLogin ? "Iniciar Sesión" : "Crear mi Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
};

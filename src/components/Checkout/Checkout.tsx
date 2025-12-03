// ============================================
// CHECKOUT COMPONENT
// ============================================

import { useState, useEffect } from 'react';
import { useCart } from '../../hooks';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { ClientAuthModal } from '../Auth/ClientAuthModal';
import { CreditCard, Truck, CheckCircle2, ArrowLeft, User } from 'lucide-react';

export const Checkout = () => {
  const { items, calcularTotal, vaciarCarrito } = useCart();
  const toast = useToast();
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [loading, setLoading] = useState(false);
  const { clientUser } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Autocompletar datos si el usuario está logueado
  useEffect(() => {
    if (clientUser) {
      setShippingData(prev => ({
        ...prev,
        nombre: clientUser.name,
        direccion: clientUser.address || prev.direccion,
        ciudad: clientUser.city || prev.ciudad,
        telefono: clientUser.phone || prev.telefono
      }));
    }
  }, [clientUser]);

  // Formulario de envío
  const [shippingData, setShippingData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: ''
  });

  // Formulario de pago (simulado)
  const [paymentData, setPaymentData] = useState({
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: ''
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingData.nombre || !shippingData.direccion || !shippingData.ciudad || !shippingData.telefono) {
      toast.warning('Por favor completa todos los campos de envío');
      return;
    }
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentData.numeroTarjeta || !paymentData.fechaExpiracion || !paymentData.cvv) {
      toast.warning('Por favor completa los datos de pago');
      return;
    }

    setLoading(true);
    
    // Simular procesamiento de pago
    setTimeout(async () => {
      setLoading(false);
      setStep('confirmation');
      await vaciarCarrito();
      toast.success('¡Pedido realizado con éxito!');
      window.scrollTo(0, 0);
    }, 2000);
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-[#5A4633] mb-4">No hay productos para comprar</h2>
        <a href="#/" className="text-[#D4A574] hover:underline font-semibold">Volver a la tienda</a>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-[#D4A574]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-[#5A4633] mb-4">¡Gracias por tu compra!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Tu pedido ha sido procesado exitosamente. Recibirás un correo de confirmación pronto.
          </p>
          <div className="bg-[#F5EFE7] rounded-xl p-6 mb-8 text-center">
            <h3 className="font-bold text-[#5A4633] mb-2">Detalles del envío:</h3>
            <p className="text-gray-700">{shippingData.nombre}</p>
            <p className="text-gray-700">{shippingData.direccion}</p>
            <p className="text-gray-700">{shippingData.ciudad}</p>
          </div>
          <a 
            href="#/"
            className="inline-block px-8 py-4 bg-[#5A4633] text-white rounded-xl hover:bg-[#3D2F24] transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Volver a la Tienda
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 max-w-[1920px]">
      <div className="flex items-center gap-2 mb-8">
        <a href="#/carrito" className="text-gray-500 hover:text-[#5A4633] transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </a>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#5A4633]">
          Finalizar Compra
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Formularios */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pasos */}
          <div className="flex items-center mb-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === 'shipping' ? 'bg-[#5A4633] text-white' : 'bg-green-500 text-white'}`}>
              {step === 'payment' ? <CheckCircle2 className="w-6 h-6" /> : '1'}
            </div>
            <div className={`flex-1 h-1 mx-4 ${step === 'payment' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === 'payment' ? 'bg-[#5A4633] text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
          </div>

          {step === 'shipping' ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-[#5A4633] mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6" />
                Información de Envío
              </h2>

              {!clientUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-blue-900">¿Ya tienes cuenta?</p>
                      <p className="text-sm text-blue-700">Inicia sesión para usar tus datos guardados</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Ingresar
                  </button>
                </div>
              )}

              <form onSubmit={handleShippingSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo</label>
                  <input
                      type="text"
                      required
                      value={shippingData.nombre}
                      onChange={e => setShippingData({...shippingData, nombre: e.target.value})}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="Juan Pérez"
                    />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Dirección de Entrega</label>
                  <input
                      type="text"
                      required
                      value={shippingData.direccion}
                      onChange={e => setShippingData({...shippingData, direccion: e.target.value})}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="Av. Principal 123, Dpto 401"
                    />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ciudad</label>
                    <input
                      type="text"
                      required
                      value={shippingData.ciudad}
                      onChange={e => setShippingData({...shippingData, ciudad: e.target.value})}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="Lima"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      required
                      value={shippingData.telefono}
                      onChange={e => setShippingData({...shippingData, telefono: e.target.value})}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="999 999 999"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#5A4633] text-white py-4 rounded-xl hover:bg-[#3D2F24] transition-all font-bold shadow-lg hover:shadow-xl transform active:scale-99 mt-4 flex items-center justify-center gap-2"
                >
                  Continuar al Pago
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-[#5A4633] mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Información de Pago
              </h2>

              {/* Tarjeta Visual */}
              <div className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-[#5A4633] to-[#2A2118] rounded-2xl text-white shadow-2xl relative overflow-hidden transform transition-all hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4A574]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8 sm:mb-10">
                    <div className="w-12 h-8 sm:w-14 sm:h-9 bg-gradient-to-r from-yellow-200 to-yellow-500 rounded-md flex items-center justify-center shadow-md">
                      <div className="w-8 h-5 border border-black/10 rounded-sm"></div>
                    </div>
                    <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />
                  </div>
                  
                  <div className="mb-6 sm:mb-8">
                    <p className="text-[10px] sm:text-xs text-white/70 mb-1.5 uppercase tracking-wider font-semibold">Número de Tarjeta</p>
                    <p className="text-xl sm:text-3xl font-mono tracking-widest drop-shadow-md">
                      {paymentData.numeroTarjeta || '0000 0000 0000 0000'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] sm:text-xs text-white/70 mb-1 uppercase tracking-wider font-semibold">Titular</p>
                      <p className="font-medium tracking-wide uppercase text-sm sm:text-base drop-shadow-sm max-w-[150px] sm:max-w-[200px] truncate">
                        {shippingData.nombre || 'NOMBRE DEL TITULAR'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] sm:text-xs text-white/70 mb-1 uppercase tracking-wider font-semibold">Expira</p>
                      <p className="font-mono tracking-widest text-sm sm:text-base drop-shadow-sm">
                        {paymentData.fechaExpiracion || 'MM/YY'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Número de Tarjeta</label>
                  <input
                      type="text"
                      required
                      maxLength={19}
                      value={paymentData.numeroTarjeta}
                      onChange={e => {
                        // Formato simple de tarjeta (espacios cada 4 dígitos)
                        let v = e.target.value.replace(/\D/g, '');
                        if (v.length > 16) v = v.slice(0, 16);
                        const parts = [];
                        for (let i = 0; i < v.length; i += 4) {
                          parts.push(v.slice(i, i + 4));
                        }
                        setPaymentData({...paymentData, numeroTarjeta: parts.join(' ')})
                      }}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white font-mono"
                      placeholder="0000 0000 0000 0000"
                    />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Vencimiento</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      value={paymentData.fechaExpiracion}
                      onChange={e => {
                        // Formato simple de fecha (MM/YY)
                        let v = e.target.value.replace(/\D/g, '');
                        if (v.length > 4) v = v.slice(0, 4);
                        if (v.length >= 2) {
                          v = v.slice(0, 2) + '/' + v.slice(2);
                        }
                        setPaymentData({...paymentData, fechaExpiracion: v})
                      }}
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                    <div className="relative group">
                      <input
                        type="password"
                        required
                        maxLength={3}
                        value={paymentData.cvv}
                        onChange={e => setPaymentData({...paymentData, cvv: e.target.value.replace(/\D/g, '')})}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#5A4633] focus:ring-4 focus:ring-[#5A4633]/10 outline-none transition-all bg-gray-50 focus:bg-white font-mono text-center tracking-widest"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Atrás
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-[#5A4633] text-white py-4 rounded-xl hover:bg-[#3D2F24] transition-all font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-xl transform active:scale-99"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Pagar S/ {calcularTotal().toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Columna Derecha: Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#D4A574] sticky top-24">
            <h3 className="text-xl font-bold text-[#5A4633] mb-4 pb-4 border-b border-gray-100">
              Resumen del Pedido
            </h3>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img 
                    src={item.producto.imagenUrl} 
                    alt={item.producto.nombre}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.producto.nombre}</p>
                    <p className="text-xs text-gray-500">Cant: {item.cantidad}</p>
                    <p className="text-sm font-bold text-[#5A4633]">S/ {(item.producto.precio * item.cantidad).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-[#D4A574] pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>S/ {calcularTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-bold">Gratis</span>
              </div>
              <div className="flex justify-between text-xl font-black text-[#5A4633] pt-2">
                <span>Total</span>
                <span>S/ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ClientAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => toast.success('¡Sesión iniciada! Tus datos se han cargado.')} 
      />
    </div>
  );
};

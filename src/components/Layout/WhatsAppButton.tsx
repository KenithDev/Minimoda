import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  const phoneNumber = '51999999999'; // Número de ejemplo
  const message = 'Hola, estoy interesado en sus productos de Minimoda.';

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-3 sm:p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 hover:shadow-2xl flex items-center justify-center group animate-in fade-in slide-in-from-bottom-4"
      aria-label="Contactar por WhatsApp"
    >
      {/* Efecto de pulso */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      
      <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 fill-current relative z-10" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-[#5A4633] px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0 border border-[#D4A574]/20 hidden sm:block">
        ¡Escríbenos!
      </span>
    </a>
  );
};

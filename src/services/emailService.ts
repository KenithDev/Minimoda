import emailjs from "@emailjs/browser";

// ---------------------------------------------------
// CONFIGURACIÓN DE EMAILJS
// ---------------------------------------------------

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendVerificationEmail = async (
  email: string,
  name: string,
  code: string
) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn(
      " EmailJS no configurado en .env. Revisa VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID y VITE_EMAILJS_PUBLIC_KEY."
    );
    return false;
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: email,
        to_name: name,
        code: code,
      },
      PUBLIC_KEY
    );
    console.log("Correo enviado correctamente a", email);
    return true;
  } catch (error) {
    console.error("Error enviando correo:", error);
    return false;
  }
};

// Función para validar formato de número USA
export const validateUSPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === "1");
};

export function generateProjectCode(): string {
  // Genera un código de 6 caracteres fácil de recordar
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sin I,O,0,1 para evitar confusión
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

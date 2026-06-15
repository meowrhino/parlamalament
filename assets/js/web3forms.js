// ============================================================
// web3forms.js — enviament del formulari per email (servei sense backend).
//   La clau d'en Jordi ja està posada: els tràmits 002/003 ENVIEN de debò a
//   jordi.bretcha@gmail.com. És una clau pública per disseny (Web3Forms no té
//   backend); convé restringir el domini permès a meowrhino.github.io al panell.
//   Si es torna a posar el placeholder "POSA-AQUI-LA-ACCESS-KEY", els tràmits
//   passen a MODE DE PROVA (no s'envia res, però el flux es pot provar igual).
// ============================================================

export const WEB3FORMS_ACCESS_KEY = "36cdc278-30a2-4bdf-9b22-b751bd8866c6";
export const TEST_MODE = WEB3FORMS_ACCESS_KEY === "POSA-AQUI-LA-ACCESS-KEY";

/**
 * Envia un FormData a Web3Forms. En mode de prova simula èxit (no fa cap POST).
 * @param {FormData} formData
 * @returns {Promise<{success:boolean, test?:boolean}>}
 */
export async function submitWeb3Forms(formData) {
  if (TEST_MODE) {
    console.info("[tràmit] MODE DE PROVA: no s'envia res (falta WEB3FORMS_ACCESS_KEY).");
    return { success: true, test: true };
  }
  formData.append("access_key", WEB3FORMS_ACCESS_KEY);
  const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) {
    throw new Error(data.message || "No s'ha pogut registrar el tràmit. Torna-ho a provar.");
  }
  return data;
}

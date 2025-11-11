
import { GoogleGenAI, Type } from "@google/genai";
import { Subvention } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const subventionSchema = {
  type: Type.OBJECT,
  properties: {
    subvenciones: {
      type: Type.ARRAY,
      description: "Una lista de subvenciones encontradas.",
      items: {
        type: Type.OBJECT,
        properties: {
          concepto: {
            type: Type.STRING,
            description: "Nombre oficial y conciso de la subvención.",
          },
          explicacion: {
            type: Type.STRING,
            description: "Párrafo breve que describe el objetivo de la subvención.",
          },
          requisitos: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Lista de los 3-5 requisitos más importantes para solicitar la ayuda.",
          },
          plazos: {
            type: Type.STRING,
            description: 'Fechas de la convocatoria o estado (ej. "Abierta todo el año", "Cerrada", "Del 01/01/2025 al 31/03/2025").',
          },
        },
        required: ["concepto", "explicacion", "requisitos", "plazos"],
      },
    },
  },
  required: ["subvenciones"],
};

export const findSubventions = async (query: string): Promise<Subvention[]> => {
  try {
    const prompt = `
      Actúa como un experto en la Base de Datos Nacional de Subvenciones (BDNS) de España.
      El usuario está buscando subvenciones relacionadas con: "${query}".

      Realiza una búsqueda simulada en la BDNS y devuelve una lista de 4 subvenciones ficticias pero muy realistas que coincidan con la búsqueda.
      La respuesta debe ser exclusivamente un objeto JSON que se ajuste al esquema proporcionado.
      Para cada subvención, proporciona la siguiente información: 'concepto', 'explicacion', 'requisitos' y 'plazos'.
      Asegúrate de que los detalles sean creíbles y relevantes para el sistema de ayudas públicas de España.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: subventionSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);

    return data.subvenciones || [];
  } catch (error) {
    console.error("Error fetching subventions from Gemini API:", error);
    throw new Error("No se pudo obtener una respuesta del servicio de IA. Por favor, inténtelo de nuevo más tarde.");
  }
};

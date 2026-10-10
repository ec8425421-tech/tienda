
export type ProductoWilma = {
  id: number;
  categoria: string;
  producto: string;
  presentacion: string;
  precio: number;
  variedades: string;
};

export const productosWilma: ProductoWilma[] = [
  {
    id: 1,
    categoria: "Cuidado capilar",
    producto: "Tónico",
    presentacion: "125 ml",
    precio: 150,
    variedades: "Rosas; Lavanda; Romero",
  },
  {
    id: 2,
    categoria: "Cuidado corporal",
    producto: "Crema fluida corporal",
    presentacion: "120 ml",
    precio: 150,
    variedades: "Rosas; Lavanda; Aloe vera; Caléndula",
  },
  {
    id: 3,
    categoria: "Limpieza facial",
    producto: "Agua micelar de flor de hibisco",
    presentacion: "120 ml",
    precio: 115,
    variedades: "",
  },
  {
    id: 4,
    categoria: "Cuidado capilar",
    producto: "Shampoo líquido de romero y miel",
    presentacion: "250 ml",
    precio: 250,
    variedades: "Romero y miel",
  },
  {
    id: 5,
    categoria: "Cuidado capilar",
    producto: "Crema para peinar de romero y miel",
    presentacion: "250 ml",
    precio: 250,
    variedades: "Romero y miel",
  },
  {
    id: 6,
    categoria: "Cuidado capilar",
    producto: "Shampoo sólido anticaída",
    presentacion: "50 g",
    precio: 90,
    variedades:
      "Romero y salvia blanca; Romero, árbol de té y aloe vera",
  },
  {
    id: 7,
    categoria: "Jabones",
    producto: "Jabón terapéutico artesanal",
    presentacion: "110 g",
    precio: 75,
    variedades: "Miel; Miel con avena; Caléndula; Karité",
  },
  {
    id: 8,
    categoria: "Jabones",
    producto: "Jabón terapéutico artesanal",
    presentacion: "100 g",
    precio: 70,
    variedades:
      "Rosas; Lavanda; Aloe vera; Romero; Arcilla y árbol de té; Chaya y árbol de té; Toronja y café; Café con toronja",
  },
  {
    id: 9,
    categoria: "Higiene personal",
    producto: "Desodorante natural",
    presentacion: "",
    precio: 120,
    variedades: "Árbol de té; Bambú",
  },
  {
    id: 10,
    categoria: "Cuidado personal",
    producto: "Bálsamo labial",
    presentacion: "",
    precio: 75,
    variedades: "Neutro; Con color",
  },
  {
    id: 11,
    categoria: "Cuidado facial",
    producto: "Bálsamo para contorno de ojos",
    presentacion: "",
    precio: 75,
    variedades: "Desinflamatorio",
  },
  {
    id: 12,
    categoria: "Cuidado corporal",
    producto: "Pomada de árnica y caléndula",
    presentacion: "50 g",
    precio: 110,
    variedades: "",
  },
  {
    id: 13,
    categoria: "Aceites vegetales",
    producto: "Aceite vegetal",
    presentacion: "20 ml",
    precio: 220,
    variedades:
      "Rosas; Rosas con miel; Lavanda y lechuga; Romero; Cola de caballo y laurel; Neem",
  },
  {
    id: 14,
    categoria: "Baño",
    producto: "Sales para baño",
    presentacion: "120 g",
    precio: 80,
    variedades:
      "Rosas; Caléndula; Romero; Eucalipto y menta; Vainilla con anís estrella",
  },
  {
    id: 15,
    categoria: "Macerados",
    producto: "Macerado terapéutico de flores y especias",
    presentacion: "250 g",
    precio: 300,
    variedades:
      "Auxiliar en el tratamiento de la tos; Perimenopausia y menopausia; Colon irritable y estreñimiento",
  },
];
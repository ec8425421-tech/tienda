
export type MenuEmpresa = {
  empresaId: string;
  tipo: "imagen" | "excel";
  archivo: string;
};

export const menus: MenuEmpresa[] = [
  {
    empresaId: "Awhi",
    tipo: "imagen",
    archivo: "/empresas/awhi/menu.jpg",
  },
  {
    empresaId: "dona-y-maria",
    tipo: "imagen",
    archivo: "/empresas/dona-y-maria/menu.jpg",
  },
  {
    empresaId: "Fidelina",
    tipo: "excel",
    archivo: "catalogofidelina.xlsx",
  },
  {
    empresaId: "Wilma",
    tipo: "excel",
    archivo: "catalogowilma.xlsx",
  },
];
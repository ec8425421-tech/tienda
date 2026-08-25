"use client";

import { useParams } from "next/navigation";

export default function ContactoPage() {
  const params = useParams();

  const locale =
    params.locale === "en" ? "en" : "es";

  const textos =
    locale === "en"
      ? {
          etiqueta: "TIENDA TEYA",
          titulo: "Get to know us",
          descripcion:
            "We are preparing all the information about our store to share with you.",

          sobreTitulo: "About Tienda Teya",
          sobreTexto:
            "Coming soon you will find information about our store, our history and everything we offer.",

          contactoTitulo: "Contact",
          direccion: "Address",
          telefono: "Phone",
          whatsapp: "WhatsApp",
          correo: "Email",
          proximamente: "Coming soon",

          horariosTitulo: "Opening hours",
          horario: "Opening hours",

          redesTitulo: "Follow us",
          redesTexto:
            "Soon you will be able to find our social media here.",

          facebook: "Facebook",
          instagram: "Instagram",
          tiktok: "TikTok",
        }
      : {
          etiqueta: "TIENDA TEYA",
          titulo: "Conócenos",
          descripcion:
            "Estamos preparando toda la información de nuestra tienda para compartirla contigo.",

          sobreTitulo: "Sobre Tienda Teya",
          sobreTexto:
            "Próximamente encontrarás aquí información sobre nuestra tienda, nuestra historia y todo lo que ofrecemos.",

          contactoTitulo: "Contacto",
          direccion: "Dirección",
          telefono: "Teléfono",
          whatsapp: "WhatsApp",
          correo: "Correo electrónico",
          proximamente: "Próximamente",

          horariosTitulo: "Horarios",
          horario: "Horario de atención",

          redesTitulo: "Síguenos",
          redesTexto:
            "Próximamente podrás encontrar aquí nuestras redes sociales.",

          facebook: "Facebook",
          instagram: "Instagram",
          tiktok: "TikTok",
        };

  return (
    <main className="contacto-page">

      {/* ==================================
          ENCABEZADO
      ================================== */}

      <section className="contacto-header">
        <span className="contacto-etiqueta">
          {textos.etiqueta}
        </span>

        <h1>{textos.titulo}</h1>

        <p>{textos.descripcion}</p>
      </section>


      {/* ==================================
          INFORMACIÓN
      ================================== */}

      <section className="contacto-contenido">

        {/* SOBRE TEYA */}

        <div className="contacto-card">
          <div className="contacto-icono">
            ✦
          </div>

          <h2>{textos.sobreTitulo}</h2>

          <p>{textos.sobreTexto}</p>
        </div>


        {/* CONTACTO */}

        <div className="contacto-card">
          <div className="contacto-icono">
            ✉
          </div>

          <h2>{textos.contactoTitulo}</h2>

          <div className="contacto-datos">

            <div className="contacto-dato">
              <span className="contacto-dato-icono">
                📍
              </span>

              <div>
                <strong>
                  {textos.direccion}
                </strong>

                <span>
                  {textos.proximamente}
                </span>
              </div>
            </div>


            <div className="contacto-dato">
              <span className="contacto-dato-icono">
                📞
              </span>

              <div>
                <strong>
                  {textos.telefono}
                </strong>

                <span>
                  {textos.proximamente}
                </span>
              </div>
            </div>


            <div className="contacto-dato">
              <span className="contacto-dato-icono">
                💬
              </span>

              <div>
                <strong>
                  {textos.whatsapp}
                </strong>

                <span>
                  {textos.proximamente}
                </span>
              </div>
            </div>


            <div className="contacto-dato">
              <span className="contacto-dato-icono">
                ✉
              </span>

              <div>
                <strong>
                  {textos.correo}
                </strong>

                <span>
                  {textos.proximamente}
                </span>
              </div>
            </div>

          </div>
        </div>


        {/* HORARIOS */}

        <div className="contacto-card">
          <div className="contacto-icono">
            ◷
          </div>

          <h2>{textos.horariosTitulo}</h2>

          <div className="contacto-horario">
            <span>{textos.horario}</span>

            <strong>
              {textos.proximamente}
            </strong>
          </div>
        </div>


        {/* REDES */}

        <div className="contacto-card contacto-redes">
          <div className="contacto-icono">
            ◎
          </div>

          <h2>{textos.redesTitulo}</h2>

          <p>{textos.redesTexto}</p>

          <div className="contacto-redes-botones">
            <span>{textos.facebook}</span>

            <span>{textos.instagram}</span>

            <span>{textos.tiktok}</span>
          </div>
        </div>

      </section>
    </main>
  );
}
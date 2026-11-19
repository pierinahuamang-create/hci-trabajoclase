document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // HU-01: REGISTRO / INGRESO RÁPIDO Y PERSISTENCIA DE SESIÓN
    // =========================================================================
    const modal = document.getElementById('modal-auth');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnGoogle = document.getElementById('btn-google');
    const btnFacebook = document.getElementById('btn-facebook');
    const btnInvitado = document.getElementById('btn-invitado');
    const botonesEmpieza = document.querySelectorAll('.boton-cabecera, .acciones .boton');
    const usuarioBadge = document.getElementById('usuario-badge');
    const usuarioNombre = document.getElementById('usuario-nombre');
    const btnLogout = document.getElementById('btn-logout');

    const verificarSesion = () => {
        const usuarioGuardado = localStorage.getItem('usuario_registrado');
        if (usuarioGuardado && usuarioBadge && usuarioNombre) {
            usuarioNombre.textContent = `Hola, ${usuarioGuardado}`;
            usuarioBadge.style.display = 'flex';
        } else if (usuarioBadge) {
            usuarioBadge.style.display = 'none';
        }
    };

    const abrirModal = (e) => {
        if (localStorage.getItem('usuario_registrado')) {
            return; // Desplazamiento normal si ya tiene sesión
        }
        e.preventDefault();
        if (modal) {
            modal.classList.add('activo');
            modal.setAttribute('aria-hidden', 'false');
        }
    };

    const cerrarModal = () => {
        if (modal) {
            modal.classList.remove('activo');
            modal.setAttribute('aria-hidden', 'true');
        }
    };

    const registrarUsuario = (proveedor) => {
        localStorage.setItem('usuario_registrado', proveedor);
        verificarSesion();
        cerrarModal();
        const seccionAnemia = document.getElementById('anemia');
        if (seccionAnemia) {
            seccionAnemia.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('usuario_registrado');
            verificarSesion();
        });
    }

    botonesEmpieza.forEach(boton => boton.addEventListener('click', abrirModal));
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
    if (btnInvitado) {
        btnInvitado.addEventListener('click', () => {
            cerrarModal();
            const seccionAnemia = document.getElementById('anemia');
            if (seccionAnemia) {
                seccionAnemia.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (btnGoogle) btnGoogle.addEventListener('click', () => registrarUsuario('Usuario Google'));
    if (btnFacebook) btnFacebook.addEventListener('click', () => registrarUsuario('Usuario Facebook'));

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    }

    verificarSesion();

    // =========================================================================
    // HU-02: CATÁLOGO DE ALIMENTOS CON FILTRADO COMBINADO Y BÚSQUEDA
    // =========================================================================
const alimentosData = [
    {
        id: 'lentejas',
        nombre: 'Lentejas',
        categoria: 'legumbres',
        nivelClase: 'hierro-alto',
        nivelEtiqueta: 'Alto en hierro',
        nivelBadgeClase: 'nivel-alto',
        imagen: 'IMAGENES/lentejas-legumbre.jpg',
        alt: 'Lentejas cocidas ricas en hierro',
        detalle: 'Una legumbre muy económica e ideal para estudiantes. Combínala con frutas o ensaladas con limón (Vitamina C) para absorber al máximo el hierro vegetal.'
    },
    {
        id: 'higado-pollo',
        nombre: 'Hígado de pollo / Sangrecita',
        categoria: 'carnes',
        nivelClase: 'hierro-muy-alto',
        nivelEtiqueta: 'Muy alto en hierro',
        nivelBadgeClase: 'nivel-muy-alto',
        imagen: 'IMAGENES/higado-pollo.jpg',
        alt: 'Hígado de pollo cocido en plato',
        detalle: 'Excelente fuente de hierro hemo (de origen animal), el cual se absorbe rápidamente por el organismo. Opción altamente nutritiva y accesible.'
    },
    {
        id: 'carne-res',
        nombre: 'Carne de res',
        categoria: 'carnes',
        nivelClase: 'hierro-alto',
        nivelEtiqueta: 'Alto en hierro',
        nivelBadgeClase: 'nivel-alto',
        imagen: 'IMAGENES/carne-res.jpg',
        alt: 'Carne de res servida',
        detalle: 'Aporta hierro de alta absorción y proteínas clave para contrarrestar la fatiga muscular durante la jornada universitaria.'
    },
    {
        id: 'quinua',
        nombre: 'Quinua',
        categoria: 'otros',
        nivelClase: 'hierro-fuente',
        nivelEtiqueta: 'Fuente de hierro',
        nivelBadgeClase: 'nivel-fuente',
        imagen: 'IMAGENES/quinua.jpg',
        alt: 'Cuenco con quinua cocida',
        detalle: 'Grano andino súper completo con hierro, fibra y proteínas. Muy versátil tanto para desayunos como para guisos o ensaladas.'
    },
    {
        id: 'brocoli',
        nombre: 'Brócoli',
        categoria: 'verduras',
        nivelClase: 'hierro-fuente',
        nivelEtiqueta: 'Fuente de hierro',
        nivelBadgeClase: 'nivel-fuente',
        imagen: 'IMAGENES/brocoli-salteado.jpg',
        alt: 'Brócoli fresco y salteado',
        detalle: 'Aporta hierro vegetal y una alta concentración de Vitamina C, convirtiéndolo en el acompañamiento perfecto para legumbres.'
    }
];

    const contenedorAlimentos = document.getElementById('contenedor-alimentos');
    const inputBusqueda = document.getElementById('input-busqueda');
    const radiosCategoria = document.querySelectorAll('input[name="filtro-alimento"]');
    const radiosHierro = document.querySelectorAll('input[name="filtro-hierro"]');
    const mensajeSinResultados = document.getElementById('mensaje-sin-resultados');

    const renderizarAlimentos = (lista) => {
        if (!contenedorAlimentos) return;
        contenedorAlimentos.innerHTML = '';

        if (lista.length === 0) {
            if (mensajeSinResultados) mensajeSinResultados.classList.remove('mensaje-oculto');
            return;
        }

        if (mensajeSinResultados) mensajeSinResultados.classList.add('mensaje-oculto');

        lista.forEach(alimento => {
            const article = document.createElement('article');
            article.className = `alimento ${alimento.categoria} ${alimento.nivelClase}`;

            article.innerHTML = `
                <div class="alimento-imagen">
                    <img src="${alimento.imagen}" alt="${alimento.alt}" width="300" height="225" loading="lazy">
                </div>
                <div class="alimento-texto">
                    <span class="nivel ${alimento.nivelBadgeClase}">${alimento.nivelEtiqueta}</span>
                    <h3>${alimento.nombre}</h3>
                    <details>
                        <summary>Ver detalle</summary>
                        <p>${alimento.detalle}</p>
                    </details>
                </div>
            `;
            contenedorAlimentos.appendChild(article);
        });
    };

    const filtrarAlimentos = () => {
        const textoBusqueda = inputBusqueda ? inputBusqueda.value.toLowerCase().trim() : '';
        const categoriaSeleccionada = Array.from(radiosCategoria).find(r => r.checked)?.value || 'todos';
        const hierroSeleccionado = Array.from(radiosHierro).find(r => r.checked)?.value || 'todos';

        const resultados = alimentosData.filter(alimento => {
            const coincideTexto = alimento.nombre.toLowerCase().includes(textoBusqueda) ||
                                 alimento.detalle.toLowerCase().includes(textoBusqueda);
            const coincideCategoria = categoriaSeleccionada === 'todos' || alimento.categoria === categoriaSeleccionada;
            const coincideHierro = hierroSeleccionado === 'todos' || alimento.nivelClase === hierroSeleccionado;

            return coincideTexto && coincideCategoria && coincideHierro;
        });

        renderizarAlimentos(resultados);
    };

    if (inputBusqueda) inputBusqueda.addEventListener('input', filtrarAlimentos);
    radiosCategoria.forEach(r => r.addEventListener('change', filtrarAlimentos));
    radiosHierro.forEach(r => r.addEventListener('change', filtrarAlimentos));

    renderizarAlimentos(alimentosData);

    // =========================================================================
    // HU-03: PLAN DE ALIMENTACIÓN SEMANAL PERSONALIZADO
    // =========================================================================
    const mensajesObjetivos = {
        energia: "Una rutina con buena ingesta de hierro previene la fatiga constante y mantiene tus niveles de energía durante las clases.",
        concentracion: "Evita los baches de concentración: organizar tus comidas asegura el aporte de hierro necesario para el cerebro.",
        habitos: "Pequeños cambios cuentan: incluir legumbres al menos 2 veces por semana forma hábitos sostenibles a largo plazo."
    };

    const menuSemanal = {
        lunes: {
            titulo: "Lunes",
            subtitulo: "Inicio de semana con energía",
            desayuno: "Avena fortificada con plátano y jugo de naranja.",
            almuerzo: "Guiso de lentejas con arroz integral y ensalada de tomate con limón.",
            cena: "Ensalada de quinua con brócoli al vapor y huevo sancochado."
        },
        martes: {
            titulo: "Martes",
            subtitulo: "Menú práctico para la universidad",
            desayuno: "Pan integral con palta, huevo sancochado y una mandarina.",
            almuerzo: "Sangrecita salteada con cebolla, tomate y papa sancocha.",
            cena: "Sopa reconfortante de quinua con verduras variadas."
        },
        miercoles: {
            titulo: "Miércoles",
            subtitulo: "Variedad a mitad de semana",
            desayuno: "Ponche o crema de quinua con manzana y canela.",
            almuerzo: "Garbanzos guisados con arroz y ensalada fresca.",
            cena: "Tortilla rica en espinacas y brócoli con tostadas."
        },
        jueves: {
            titulo: "Jueves",
            subtitulo: "Pausa nutritiva y ligera",
            desayuno: "Avena cocida con semillas de chía y rodajas de plátano.",
            almuerzo: "Pescado a la plancha o quinua atotada con verduras.",
            cena: "Ensalada tibia de lentejas con pimientos rojos."
        },
        viernes: {
            titulo: "Viernes",
            subtitulo: "Cierre de semana sencillo",
            desayuno: "Pan integral con tortilla de espinaca y limonada.",
            almuerzo: "Frejoles negros con arroz y ensalada de zanahoria rallada.",
            cena: "Salteado express de brócoli y pimiento con huevo."
        },
        sabado: {
            titulo: "Sábado",
            subtitulo: "Cocina tranquila en casa",
            desayuno: "Omelette de huevos con tomate picado y fruta fresca.",
            almuerzo: "Guiso de carne de res con papas nativas y ensalada.",
            cena: "Crema de zapallo y espinacas acompañada de quinua."
        },
        domingo: {
            titulo: "Domingo",
            subtitulo: "Planificación para la siguiente semana",
            desayuno: "Yogur natural con fruta picada y granola.",
            almuerzo: "Guiso especial de lentejas o sangrecita con ensalada rica en limón.",
            cena: "Quinua salteada tipo chaufa con verduras y huevo."
        }
    };

    const radiosObjetivo = document.querySelectorAll('input[name="objetivo"]');
    const radiosDia = document.querySelectorAll('input[name="dia"]');
    const elMensajeObjetivo = document.getElementById('mensaje-objetivo-dinamico');
    const contenedorMenuDia = document.getElementById('contenedor-menu-dia');

    const actualizarMensajeObjetivo = () => {
        const objetivoSeleccionado = Array.from(radiosObjetivo).find(r => r.checked)?.value;
        if (elMensajeObjetivo && mensajesObjetivos[objetivoSeleccionado]) {
            elMensajeObjetivo.textContent = mensajesObjetivos[objetivoSeleccionado];
        }
    };

    const actualizarMenuDia = () => {
        const diaSeleccionado = Array.from(radiosDia).find(r => r.checked)?.value;
        const datosDia = menuSemanal[diaSeleccionado];

        if (contenedorMenuDia && datosDia) {
            contenedorMenuDia.innerHTML = `
                <article class="menu-dia menu-dia-activo">
                    <h3>${datosDia.titulo} <span>${datosDia.subtitulo}</span></h3>
                    <div class="comidas">
                        <p>
                            <strong>Desayuno</strong>
                            <span>${datosDia.desayuno}</span>
                        </p>
                        <p>
                            <strong>Almuerzo</strong>
                            <span>${datosDia.almuerzo}</span>
                        </p>
                        <p>
                            <strong>Cena</strong>
                            <span>${datosDia.cena}</span>
                        </p>
                    </div>
                </article>
            `;
        }
    };

    radiosObjetivo.forEach(r => r.addEventListener('change', actualizarMensajeObjetivo));
    radiosDia.forEach(r => r.addEventListener('change', actualizarMenuDia));

    actualizarMensajeObjetivo();
    actualizarMenuDia();
});
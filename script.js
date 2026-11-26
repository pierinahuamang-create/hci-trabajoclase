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
    // HU-02: CATÁLOGO DE ALIMENTOS CON BÚSQUEDA INTELIGENTE Y RECUPERACIÓN
    // =========================================================================
    const alimentosData = [
        {
            id: 'lentejas',
            nombre: 'Lentejas',
            categoria: 'legumbres',
            nivelClase: 'hierro-alto',
            nivelEtiqueta: 'Alto en hierro',
            nivelBadgeClase: 'nivel-alto',
            nivelPeso: 2,
            economico: true,
            sinCarne: true,
            imagen: 'IMAGENES/lentejas-legumbre.jpg',
            alt: 'Lentejas cocidas ricas en hierro',
            detalle: 'Una legumbre muy económica e ideal para estudiantes. Combínala con frutas o ensaladas con limón (Vitamina C) para absorber al máximo el hierro vegetal.',
            palabrasClave: ['menestra', 'legumbre', 'vegetal', 'sin carne', 'economico', 'barato', 'estudiantes', 'anemia', 'vitamina c', 'limon']
        },
        {
            id: 'higado-pollo',
            nombre: 'Hígado de pollo / Sangrecita',
            categoria: 'carnes',
            nivelClase: 'hierro-muy-alto',
            nivelEtiqueta: 'Muy alto en hierro',
            nivelBadgeClase: 'nivel-muy-alto',
            nivelPeso: 3,
            economico: true,
            sinCarne: false,
            imagen: 'IMAGENES/higado-pollo.jpg',
            alt: 'Hígado de pollo cocido en plato',
            detalle: 'Excelente fuente de hierro hemo (de origen animal), el cual se absorbe rápidamente por el organismo. Opción altamente nutritiva y accesible.',
            palabrasClave: ['visceras', 'sangrecita', 'hemo', 'anemia', 'subir hierro', 'aumentar hierro', 'economico', 'barato', 'accesible']
        },
        {
            id: 'carne-res',
            nombre: 'Carne de res',
            categoria: 'carnes',
            nivelClase: 'hierro-alto',
            nivelEtiqueta: 'Alto en hierro',
            nivelBadgeClase: 'nivel-alto',
            nivelPeso: 2,
            economico: false,
            sinCarne: false,
            imagen: 'IMAGENES/carne-res.jpg',
            alt: 'Carne de res servida',
            detalle: 'Aporta hierro de alta absorción y proteínas clave para contrarrestar la fatiga muscular durante la jornada universitaria.',
            palabrasClave: ['carne', 'roja', 'proteina', 'hemo', 'fatiga', 'cansancio', 'energia', 'aumentar hierro']
        },
        {
            id: 'quinua',
            nombre: 'Quinua',
            categoria: 'otros',
            nivelClase: 'hierro-fuente',
            nivelEtiqueta: 'Fuente de hierro',
            nivelBadgeClase: 'nivel-fuente',
            nivelPeso: 1,
            economico: true,
            sinCarne: true,
            imagen: 'IMAGENES/quinua.jpg',
            alt: 'Cuenco con quinua cocida',
            detalle: 'Grano andino súper completo con hierro, fibra y proteínas. Muy versátil tanto para desayunos como para guisos o ensaladas.',
            palabrasClave: ['grano', 'andino', 'cereal', 'vegetal', 'sin carne', 'fibra', 'proteina', 'desayuno', 'economico', 'energia']
        },
        {
            id: 'brocoli',
            nombre: 'Brócoli',
            categoria: 'verduras',
            nivelClase: 'hierro-fuente',
            nivelEtiqueta: 'Fuente de hierro',
            nivelBadgeClase: 'nivel-fuente',
            nivelPeso: 1,
            economico: true,
            sinCarne: true,
            imagen: 'IMAGENES/brocoli-salteado.jpg',
            alt: 'Brócoli fresco y salteado',
            detalle: 'Aporta hierro vegetal y una alta concentración de Vitamina C, convirtiéndolo en el acompañamiento perfecto para legumbres.',
            palabrasClave: ['verdura', 'vegetal', 'sin carne', 'vitamina c', 'absorcion', 'economico', 'barato', 'ensalada']
        }
    ];

    const consultasSugeridas = [
        'comidas para aumentar el hierro',
        'alimentos económicos',
        'opciones sin carne',
        'alimentos con vitamina c'
    ];

    // Referencias DOM HU-02
    const contenedorAlimentos = document.getElementById('contenedor-alimentos');
    const inputBusqueda = document.getElementById('input-busqueda');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const aiToggle = document.getElementById('ai-toggle');
    const suggestionsPanel = document.getElementById('suggestions-panel');
    const suggestionsListbox = document.getElementById('suggestions-listbox');
    const ignoreSuggestionsBtn = document.getElementById('ignore-suggestions-btn');
    const exampleChips = document.querySelectorAll('.nf-example-chip');

    const aiIntentBanner = document.getElementById('ai-intent-banner');
    const aiIntentMessage = document.getElementById('ai-intent-message');
    const applyAiIntentBtn = document.getElementById('apply-ai-intent-btn');
    const dismissAiIntentBtn = document.getElementById('dismiss-ai-intent-btn');

    const radiosCategoria = document.querySelectorAll('input[name="filtro-alimento"]');
    const radiosHierro = document.querySelectorAll('input[name="filtro-hierro"]');
    const filterEconomicBtn = document.getElementById('filter-economic');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const resultsCount = document.getElementById('results-count');

    const recoveryPanel = document.getElementById('recovery-panel');
    const recoveryReason = document.getElementById('recovery-reason');
    const recoveryActions = document.getElementById('recovery-actions');
    const recoveryGrid = document.getElementById('recovery-grid');
    const recoveryAlternatives = document.querySelector('.nf-recovery-alternatives');

    // Estado de HU-02
    const estado = {
        busqueda: '',
        categoria: 'todos',
        hierro: 'todos',
        soloEconomicos: false,
        aiActiva: aiToggle ? aiToggle.checked : true,
        intencionActual: null,
        intencionDescartada: '',
        sugerencias: [],
        indiceSugerenciaActiva: -1
    };

    const normalizar = (texto = '') =>
        texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();

    const crearTarjetaAlimento = (alimento) => {
        const article = document.createElement('article');
        article.className = `alimento ${alimento.categoria} ${alimento.nivelClase}`;

        const badgeEconomico = alimento.economico
            ? '<span class="nf-badge-economico">Económico</span>'
            : '';

        article.innerHTML = `
            <div class="alimento-imagen">
                <img src="${alimento.imagen}" alt="${alimento.alt}" width="300" height="225" loading="lazy">
            </div>
            <div class="alimento-texto">
                <div class="nf-badges-row">
                    <span class="nivel ${alimento.nivelBadgeClase}">${alimento.nivelEtiqueta}</span>
                    ${badgeEconomico}
                </div>
                <h3>${alimento.nombre}</h3>
                <details>
                    <summary>Ver detalle</summary>
                    <p>${alimento.detalle}</p>
                </details>
            </div>
        `;
        return article;
    };

    const detectarIntencionIA = (consulta) => {
        const q = normalizar(consulta);
        if (!q || q.length < 3) return null;

        if (/(aumentar|subir|mas hierro|anemia|hemoglobina|fatiga|cansancio)/.test(q)) {
            return {
                id: 'subir-hierro',
                mensaje: 'Detectamos que buscas opciones para aumentar el hierro. ¿Aplicar el filtro "Muy alto" en aporte de hierro?',
                aplicar: () => {
                    seleccionarRadio(radiosHierro, 'hierro-muy-alto');
                    estado.hierro = 'hierro-muy-alto';
                    limpiarSoloTexto();
                },
                alternativas: () => [...alimentosData].sort((a, b) => b.nivelPeso - a.nivelPeso).slice(0, 3)
            };
        }

        if (/(economico|economicos|barato|baratos|presupuesto|accesible|estudiantes)/.test(q)) {
            return {
                id: 'economicos',
                mensaje: 'Detectamos que priorizas opciones accesibles. ¿Activar el filtro "Solo alimentos económicos"?',
                aplicar: () => {
                    actualizarFiltroEconomico(true);
                    limpiarSoloTexto();
                },
                alternativas: () => alimentosData.filter(a => a.economico)
            };
        }

        if (/(sin carne|vegetariano|vegano|vegetal|plantas|no carne)/.test(q)) {
            return {
                id: 'sin-carne',
                mensaje: 'Detectamos que buscas opciones sin carne. ¿Filtrar por "Legumbres" como fuente principal de hierro vegetal?',
                aplicar: () => {
                    seleccionarRadio(radiosCategoria, 'legumbres');
                    estado.categoria = 'legumbres';
                    limpiarSoloTexto();
                },
                alternativas: () => alimentosData.filter(a => a.sinCarne)
            };
        }

        if (/(vitamina c|absorber|absorcion|limon)/.test(q)) {
            return {
                id: 'vitamina-c',
                mensaje: 'La Vitamina C mejora la absorción del hierro vegetal. ¿Filtrar por "Verduras" para ver opciones como el brócoli?',
                aplicar: () => {
                    seleccionarRadio(radiosCategoria, 'verduras');
                    estado.categoria = 'verduras';
                    limpiarSoloTexto();
                },
                alternativas: () => alimentosData.filter(a => a.id === 'brocoli' || a.id === 'lentejas')
            };
        }

        return null;
    };

    const seleccionarRadio = (radios, valor) => {
        radios.forEach(r => {
            r.checked = r.value === valor;
        });
    };

    const actualizarFiltroEconomico = (activo) => {
        estado.soloEconomicos = activo;
        if (filterEconomicBtn) {
            filterEconomicBtn.setAttribute('aria-pressed', String(activo));
            filterEconomicBtn.classList.toggle('activo', activo);
        }
    };

    const limpiarSoloTexto = () => {
        estado.busqueda = '';
        if (inputBusqueda) inputBusqueda.value = '';
        if (clearSearchBtn) clearSearchBtn.hidden = true;
        cerrarSugerencias();
    };

    const limpiarTodosLosFiltros = () => {
        limpiarSoloTexto();
        seleccionarRadio(radiosCategoria, 'todos');
        seleccionarRadio(radiosHierro, 'todos');
        estado.categoria = 'todos';
        estado.hierro = 'todos';
        estado.intencionDescartada = '';
        actualizarFiltroEconomico(false);
        actualizarVista();
    };

    // --- Autocompletado accesible ---
    const cerrarSugerencias = () => {
        if (!suggestionsPanel || !inputBusqueda) return;
        suggestionsPanel.hidden = true;
        inputBusqueda.setAttribute('aria-expanded', 'false');
        inputBusqueda.setAttribute('aria-activedescendant', '');
        estado.indiceSugerenciaActiva = -1;
    };

    const construirSugerencias = (consulta) => {
        if (!estado.aiActiva) return [];
        const q = normalizar(consulta);
        if (!q) return [];

        const items = [];

        alimentosData.forEach(alimento => {
            const nombreNorm = normalizar(alimento.nombre);
            const coincide =
                nombreNorm.includes(q) ||
                alimento.palabrasClave.some(p => normalizar(p).includes(q));
            if (coincide) {
                items.push({
                    tipo: 'Alimento',
                    texto: alimento.nombre,
                    valor: alimento.nombre
                });
            }
        });

        consultasSugeridas.forEach(frase => {
            if (normalizar(frase).includes(q) && normalizar(frase) !== q) {
                items.push({
                    tipo: '✨ IA',
                    texto: frase,
                    valor: frase
                });
            }
        });

        return items.slice(0, 5);
    };

    const renderizarSugerencias = () => {
        if (!suggestionsPanel || !suggestionsListbox || !inputBusqueda) return;
        estado.sugerencias = construirSugerencias(estado.busqueda);
        estado.indiceSugerenciaActiva = -1;

        if (estado.sugerencias.length === 0) {
            cerrarSugerencias();
            return;
        }

        suggestionsListbox.innerHTML = '';
        estado.sugerencias.forEach((sug, idx) => {
            const li = document.createElement('li');
            li.id = `nf-sug-${idx}`;
            li.setAttribute('role', 'option');
            li.setAttribute('aria-selected', 'false');
            li.className = 'nf-suggestion-item';

            const spanTexto = document.createElement('span');
            spanTexto.textContent = sug.texto;

            const spanTipo = document.createElement('span');
            spanTipo.className = 'nf-suggestion-tag';
            spanTipo.textContent = sug.tipo;

            li.appendChild(spanTexto);
            li.appendChild(spanTipo);

            li.addEventListener('mousedown', (e) => {
                e.preventDefault();
                aplicarSugerencia(sug.valor);
            });

            suggestionsListbox.appendChild(li);
        });

        suggestionsPanel.hidden = false;
        inputBusqueda.setAttribute('aria-expanded', 'true');
    };

    const aplicarSugerencia = (valor) => {
        if (inputBusqueda) inputBusqueda.value = valor;
        estado.busqueda = valor;
        estado.intencionDescartada = '';
        cerrarSugerencias();
        actualizarVista();
    };

    const resaltarSugerencia = (nuevoIndice) => {
        const opciones = suggestionsListbox.querySelectorAll('[role="option"]');
        if (opciones.length === 0) return;

        opciones.forEach(op => {
            op.setAttribute('aria-selected', 'false');
            op.classList.remove('activa');
        });

        estado.indiceSugerenciaActiva = nuevoIndice;
        if (nuevoIndice >= 0 && nuevoIndice < opciones.length) {
            const activa = opciones[nuevoIndice];
            activa.setAttribute('aria-selected', 'true');
            activa.classList.add('activa');
            inputBusqueda.setAttribute('aria-activedescendant', activa.id);
        } else {
            inputBusqueda.setAttribute('aria-activedescendant', '');
        }
    };

    // --- Panel de recuperación ---
    const obtenerAlternativasCercanas = () => {
        if (estado.intencionActual) {
            return estado.intencionActual.alternativas().slice(0, 3);
        }

        // Priorizar alimentos que cumplan al menos uno de los filtros activos
        const cercanos = alimentosData.filter(a => {
            if (estado.categoria !== 'todos' && a.categoria === estado.categoria) return true;
            if (estado.hierro !== 'todos' && a.nivelClase === estado.hierro) return true;
            if (estado.soloEconomicos && a.economico) return true;
            return false;
        });

        if (cercanos.length > 0) return cercanos.slice(0, 3);

        // Respaldo: los 3 con mayor aporte de hierro
        return [...alimentosData].sort((a, b) => b.nivelPeso - a.nivelPeso).slice(0, 3);
    };

    const mostrarPanelRecuperacion = () => {
        if (!recoveryPanel || !recoveryReason || !recoveryActions || !recoveryGrid) return;

        const razones = [];
        if (estado.busqueda.trim()) razones.push(`la búsqueda "${estado.busqueda.trim()}"`);
        if (estado.categoria !== 'todos') razones.push(`la categoría "${estado.categoria}"`);
        if (estado.hierro !== 'todos') razones.push(`el nivel seleccionado de hierro`);
        if (estado.soloEconomicos) razones.push(`el filtro de alimentos económicos`);

        recoveryReason.textContent = razones.length > 0
            ? `No encontramos alimentos que combinen exactamente ${razones.join(' y ')}.`
            : 'No se encontraron alimentos con los criterios actuales.';

        recoveryActions.innerHTML = '';

        if (estado.busqueda.trim()) {
            const btnLimpiarTexto = document.createElement('button');
            btnLimpiarTexto.type = 'button';
            btnLimpiarTexto.className = 'nf-btn-ai-primary';
            btnLimpiarTexto.textContent = 'Limpiar búsqueda';
            btnLimpiarTexto.addEventListener('click', () => {
                limpiarSoloTexto();
                actualizarVista();
            });
            recoveryActions.appendChild(btnLimpiarTexto);
        }

        if (estado.categoria !== 'todos' || estado.hierro !== 'todos' || estado.soloEconomicos) {
            const btnReset = document.createElement('button');
            btnReset.type = 'button';
            btnReset.className = 'nf-btn-ai-ghost';
            btnReset.textContent = 'Ver todos los alimentos';
            btnReset.addEventListener('click', limpiarTodosLosFiltros);
            recoveryActions.appendChild(btnReset);
        }

        if (recoveryAlternatives) {
            recoveryAlternatives.hidden = !estado.aiActiva;
        }

        recoveryGrid.innerHTML = '';
        if (estado.aiActiva) {
            obtenerAlternativasCercanas().forEach(alimento => {
                recoveryGrid.appendChild(crearTarjetaAlimento(alimento));
            });
        }

        recoveryPanel.hidden = false;
    };

    // --- Filtrado y renderizado principal ---
    const actualizarBannerIA = () => {
        if (!aiIntentBanner || !aiIntentMessage) return;

        if (!estado.aiActiva) {
            estado.intencionActual = null;
            aiIntentBanner.hidden = true;
            return;
        }

        const intencion = detectarIntencionIA(estado.busqueda);
        estado.intencionActual = intencion;

        if (intencion && estado.intencionDescartada !== intencion.id) {
            aiIntentMessage.textContent = intencion.mensaje;
            aiIntentBanner.hidden = false;
        } else {
            aiIntentBanner.hidden = true;
        }
    };

    const actualizarVista = () => {
        if (!contenedorAlimentos) return;

        const q = normalizar(estado.busqueda);
        const hayFiltrosActivos =
            Boolean(q) ||
            estado.categoria !== 'todos' ||
            estado.hierro !== 'todos' ||
            estado.soloEconomicos;

        if (clearSearchBtn) clearSearchBtn.hidden = !estado.busqueda;
        if (resetFiltersBtn) resetFiltersBtn.hidden = !hayFiltrosActivos;

        actualizarBannerIA();

        const resultados = alimentosData.filter(alimento => {
            const coincideTexto = !q ||
                normalizar(alimento.nombre).includes(q) ||
                normalizar(alimento.detalle).includes(q) ||
                normalizar(alimento.categoria).includes(q) ||
                alimento.palabrasClave.some(p => normalizar(p).includes(q));

            const coincideCategoria = estado.categoria === 'todos' || alimento.categoria === estado.categoria;
            const coincideHierro = estado.hierro === 'todos' || alimento.nivelClase === estado.hierro;
            const coincideEconomico = !estado.soloEconomicos || alimento.economico;

            return coincideTexto && coincideCategoria && coincideHierro && coincideEconomico;
        });

        contenedorAlimentos.innerHTML = '';

        if (resultsCount) {
            resultsCount.textContent = `Mostrando ${resultados.length} de ${alimentosData.length} alimentos`;
        }

        if (resultados.length === 0) {
            mostrarPanelRecuperacion();
            return;
        }

        if (recoveryPanel) recoveryPanel.hidden = true;

        resultados.forEach(alimento => {
            contenedorAlimentos.appendChild(crearTarjetaAlimento(alimento));
        });
    };

    // --- Eventos HU-02 ---
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', (e) => {
            estado.busqueda = e.target.value;
            estado.intencionDescartada = '';
            renderizarSugerencias();
            actualizarVista();
        });

        inputBusqueda.addEventListener('focus', () => {
            if (estado.busqueda.trim()) renderizarSugerencias();
        });

        inputBusqueda.addEventListener('keydown', (e) => {
            if (suggestionsPanel && !suggestionsPanel.hidden) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const sig = (estado.indiceSugerenciaActiva + 1) % estado.sugerencias.length;
                    resaltarSugerencia(sig);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = estado.indiceSugerenciaActiva <= 0
                        ? estado.sugerencias.length - 1
                        : estado.indiceSugerenciaActiva - 1;
                    resaltarSugerencia(prev);
                } else if (e.key === 'Enter' && estado.indiceSugerenciaActiva >= 0) {
                    e.preventDefault();
                    aplicarSugerencia(estado.sugerencias[estado.indiceSugerenciaActiva].valor);
                } else if (e.key === 'Escape') {
                    cerrarSugerencias();
                }
            }
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            limpiarSoloTexto();
            actualizarVista();
            if (inputBusqueda) inputBusqueda.focus();
        });
    }

    if (ignoreSuggestionsBtn) {
        ignoreSuggestionsBtn.addEventListener('click', cerrarSugerencias);
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nf-combobox-wrapper')) {
            cerrarSugerencias();
        }
    });

    if (aiToggle) {
        aiToggle.addEventListener('change', (e) => {
            estado.aiActiva = e.target.checked;
            if (!estado.aiActiva) cerrarSugerencias();
            actualizarVista();
        });
    }

    exampleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query || '';
            if (inputBusqueda) inputBusqueda.value = query;
            estado.busqueda = query;
            estado.intencionDescartada = '';
            cerrarSugerencias();
            actualizarVista();
        });
    });

    if (applyAiIntentBtn) {
        applyAiIntentBtn.addEventListener('click', () => {
            if (estado.intencionActual) {
                estado.intencionActual.aplicar();
                actualizarVista();
            }
        });
    }

    if (dismissAiIntentBtn) {
        dismissAiIntentBtn.addEventListener('click', () => {
            if (estado.intencionActual) {
                estado.intencionDescartada = estado.intencionActual.id;
            }
            if (aiIntentBanner) aiIntentBanner.hidden = true;
        });
    }

    radiosCategoria.forEach(r => r.addEventListener('change', (e) => {
        estado.categoria = e.target.value;
        actualizarVista();
    }));

    radiosHierro.forEach(r => r.addEventListener('change', (e) => {
        estado.hierro = e.target.value;
        actualizarVista();
    }));

    if (filterEconomicBtn) {
        filterEconomicBtn.addEventListener('click', () => {
            actualizarFiltroEconomico(!estado.soloEconomicos);
            actualizarVista();
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', limpiarTodosLosFiltros);
    }

    actualizarVista();

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

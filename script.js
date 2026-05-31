
    // ════════════════════════════════════════════════════════════════
    // CONFIGURACIÓN GLOBAL
    // ════════════════════════════════════════════════════════════════
    // Editá estos valores para personalizar el comportamiento del sitio.

    // Número de WhatsApp de la tienda (con código de país, sin +)
    // Uruguay: 598 + número sin el 0 inicial
    // Ejemplo: 598099123456 para el número uruguayo 099123456
    const WHATSAPP_NUMBER = '59800000000';

    // Mensaje base que se enviará por WhatsApp (antes del nombre del producto)
    // Los espacios y caracteres especiales se codifican automáticamente
    const WHATSAPP_MESSAGE_TEMPLATE = 'Hola NOVAstreet 👋 Estoy interesado en el producto: {PRODUCTO} ¿Podrían brindarme más información?';


    // ════════════════════════════════════════════════════════════════
    // ESPERAR A QUE EL DOM ESTÉ LISTO
    // ════════════════════════════════════════════════════════════════
    // 'DOMContentLoaded' se dispara cuando el HTML terminó de parsearse.
    // Todo el código JS que manipula el HTML va DENTRO de este listener.
    // Así evitamos errores del tipo "el elemento no existe todavía".
    document.addEventListener('DOMContentLoaded', function () {

      // ──────────────────────────────────────────────────────────────
      // 1. MENÚ HAMBURGUESA (MENÚ LATERAL)
      // ──────────────────────────────────────────────────────────────
      // Seleccionamos los elementos que vamos a manipular.
      // getElementById() busca un elemento por su atributo id="..."

      // El botón hamburguesa (☰)
      const hamburgerBtn = document.getElementById('hamburgerBtn');
      // El panel del menú lateral
      const navMenu = document.getElementById('navMenu');
      // El overlay oscuro que cubre el fondo cuando el menú está abierto
      const navOverlay = document.getElementById('navOverlay');
      // El botón de cierre (✕) dentro del menú
      const navClose = document.getElementById('navClose');

      // Función para ABRIR el menú
      // Se llama cuando el usuario clickea el hamburguesa
      function openMenu() {
        // Agrega la clase 'active' al menú → activa el CSS que lo hace visible
        navMenu.classList.add('active');
        // Agrega la clase 'active' al overlay → lo hace visible
        navOverlay.classList.add('active');
        // Agrega la clase 'active' al botón → lo convierte en una X
        hamburgerBtn.classList.add('active');
        // Actualiza el atributo aria-expanded para accesibilidad
        // Esto le dice a lectores de pantalla que el menú está abierto
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        // Bloquea el scroll del body mientras el menú está abierto
        // Evita que el usuario pueda scrollear la página por detrás del menú
        document.body.style.overflow = 'hidden';
      }

      // Función para CERRAR el menú
      // Se llama al clickear el ✕, el overlay, o un link del menú
      function closeMenu() {
        // Remueve las clases 'active' para ocultar el menú y el overlay
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        // Restaura el atributo aria-expanded a 'false'
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        // Restaura el scroll del body
        document.body.style.overflow = '';
      }

      // Asignar eventos de click:
      // Al clickear el hamburguesa → abrir el menú
      hamburgerBtn.addEventListener('click', openMenu);
      // Al clickear el botón de cierre → cerrar el menú
      navClose.addEventListener('click', closeMenu);
      // Al clickear el overlay (fondo oscuro) → cerrar el menú
      navOverlay.addEventListener('click', closeMenu);

      // Cerrar el menú al clickear cualquier link dentro del menú
      // querySelectorAll devuelve TODOS los elementos que coinciden con el selector
      const navLinks = navMenu.querySelectorAll('.nav-menu__link');
      navLinks.forEach(function (link) {
        // Por cada link, agregamos un listener de click
        link.addEventListener('click', closeMenu);
      });

      // Cerrar el menú con la tecla Escape (accesibilidad)
      document.addEventListener('keydown', function (event) {
        // Si la tecla presionada es Escape Y el menú está abierto
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
          closeMenu();
        }
      });


      // ──────────────────────────────────────────────────────────────
      // 2. HEADER STICKY CON SOMBRA AL HACER SCROLL
      // ──────────────────────────────────────────────────────────────
      // El header ya es sticky por CSS (position: sticky).
      // Acá agregamos una sombra sutil cuando el usuario baja la página,
      // para dar más sensación de profundidad y separación.

      // Seleccionamos el elemento header
      const header = document.getElementById('mainHeader');

      // Función que se ejecuta cada vez que el usuario hace scroll
      function handleScroll() {
        // window.scrollY → cuántos píxeles se scrolleó hacia abajo
        // Si scrolleó más de 50px → agregar clase 'scrolled'
        // Si scrolleó menos → remover la clase
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Agregar el listener de scroll
      // 'passive: true' optimiza el rendimiento (le dice al browser
      // que el listener no va a llamar a preventDefault)
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Ejecutar una vez al inicio por si la página carga scrolleada
      handleScroll();


      // ──────────────────────────────────────────────────────────────
      // 3. ANIMACIÓN DE ZOOM DEL HERO AL CARGAR
      // ──────────────────────────────────────────────────────────────
      // Agrega la clase 'loaded' al hero para activar el zoom suave
      // de la imagen de fondo (definido en el CSS con .hero.loaded .hero__bg)

      // Seleccionamos la sección hero
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        // setTimeout: espera 100ms antes de agregar la clase
        // Esto asegura que la transición CSS se active correctamente
        // (si la agregamos de inmediato, el navegador puede no detectar el cambio)
        setTimeout(function () {
          heroSection.classList.add('loaded');
        }, 100);
      }


      // ──────────────────────────────────────────────────────────────
      // 4. BOTONES DE WHATSAPP
      // ──────────────────────────────────────────────────────────────
      // Esta función gestiona el redirect a WhatsApp cuando el usuario
      // clickea cualquier botón de compra.
      //
      // Funciona así:
      // 1. Busca todos los botones con clase 'whatsapp-btn'
      // 2. Para cada botón, busca el producto más cercano (parent con data-product)
      // 3. Construye el mensaje personalizado con el nombre del producto
      // 4. Codifica el mensaje para URL (encodeURIComponent)
      // 5. Abre el link de WhatsApp

      // Seleccionamos TODOS los botones de WhatsApp (pueden ser varios en la página)
      const whatsappBtns = document.querySelectorAll('.whatsapp-btn');

      // Recorremos cada botón y le asignamos un listener de click
      whatsappBtns.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
          // Previene el comportamiento por defecto del link (no navegar a href="#")
          event.preventDefault();

          // Buscar el nombre del producto:
          // closest() busca el ancestro más cercano que tenga el selector indicado
          // El atributo data-product está en el <article class="product-card">
          const productCard = btn.closest('[data-product]');

          // Si encontramos una tarjeta de producto, obtenemos su nombre
          // Si no (por ejemplo, si el botón está en otro contexto), usamos un texto genérico
          const productName = productCard
            ? productCard.getAttribute('data-product')
            : 'un producto de NOVAstreet';

          // Construimos el mensaje reemplazando {PRODUCTO} por el nombre real
          // WHATSAPP_MESSAGE_TEMPLATE está definida arriba en CONFIGURACIÓN GLOBAL
          const message = WHATSAPP_MESSAGE_TEMPLATE.replace('{PRODUCTO}', productName);

          // encodeURIComponent() convierte caracteres especiales a formato URL:
          // espacios → %20, ñ → %C3%B1, emojis → su código, etc.
          // Esto es NECESARIO para que WhatsApp interprete el mensaje correctamente
          const encodedMessage = encodeURIComponent(message);

          // Construimos la URL completa de WhatsApp
          // Formato: https://wa.me/NUMERO?text=MENSAJE_CODIFICADO
          const whatsappURL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodedMessage;

          // Abrimos WhatsApp en una nueva pestaña
          // '_blank' = nueva pestaña
          // 'noopener,noreferrer' = seguridad (evita que la pestaña de WA acceda a nuestro window)
          window.open(whatsappURL, '_blank', 'noopener,noreferrer');
        });
      });


      // ──────────────────────────────────────────────────────────────
      // 5. ANIMACIONES AL HACER SCROLL (Intersection Observer)
      // ──────────────────────────────────────────────────────────────
      // Intersection Observer es la API moderna para detectar cuándo
      // un elemento entra en el viewport (área visible de la pantalla).
      //
      // Cuando un elemento con clase 'animate-on-scroll' entra al viewport:
      // → se le agrega la clase 'is-visible'
      // → el CSS hace que aparezca con una animación de fade-up
      //
      // Ventajas vs usar el evento 'scroll':
      // · Mejor rendimiento (no se ejecuta en cada frame de scroll)
      // · Más simple y preciso
      // · El browser lo optimiza automáticamente

      // Configuración del observer
      const observerOptions = {
        // threshold: 0.15 → el elemento se considera "visible" cuando el 15% de él
        // está dentro del viewport. Cambiá este valor entre 0 (apenas visible) y 1 (completamente)
        threshold: 0.15,
        // rootMargin: amplía o reduce el área de detección
        // '0px 0px -50px 0px' → el bottom del viewport se reduce en 50px
        // Es decir, el elemento se detecta 50px antes de llegar al borde
        rootMargin: '0px 0px -50px 0px'
      };

      // Función callback: se ejecuta cuando un elemento cambia su estado de intersección
      // 'entries' es un array de elementos observados que cambiaron
      function handleIntersection(entries) {
        entries.forEach(function (entry) {
          // entry.isIntersecting → true si el elemento está visible en el viewport
          if (entry.isIntersecting) {
            // Agrega la clase 'is-visible' → activa la animación CSS
            entry.target.classList.add('is-visible');
            // unobserve: dejamos de observar el elemento una vez que ya se animó
            // Así la animación solo ocurre UNA VEZ (al aparecer, no al volver a aparecer)
            // Si querés que la animación se repita al scrollear hacia arriba y volver:
            // → comentá esta línea (observer.unobserve)
            observer.unobserve(entry.target);
          }
        });
      }

      // Creamos el observer con la función callback y las opciones
      const observer = new IntersectionObserver(handleIntersection, observerOptions);

      // Seleccionamos TODOS los elementos que queremos animar
      const animatedElements = document.querySelectorAll('.animate-on-scroll');

      // Registramos cada elemento en el observer
      animatedElements.forEach(function (el) {
        observer.observe(el);
      });


      // ──────────────────────────────────────────────────────────────
      // 6. SMOOTH SCROLL PARA LINKS INTERNOS
      // ──────────────────────────────────────────────────────────────
      // Hace que los links con href="#seccion" naveguen suavemente
      // en lugar de saltar directamente.
      //
      // Nota: el HTML ya tiene 'scroll-behavior: smooth' en el CSS,
      // pero esta implementación JS ofrece más control y compatibilidad.

      // Seleccionamos todos los links que empiezan con "#"
      const internalLinks = document.querySelectorAll('a[href^="#"]');

      internalLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
          // Obtenemos el href del link (ej: "#productos")
          const href = link.getAttribute('href');

          // Si es solo "#" (link vacío), no hacemos nada especial
          if (href === '#') return;

          // Buscamos el elemento destino en la página
          // El href es "#productos" → el selector es "#productos"
          const target = document.querySelector(href);

          if (target) {
            // Prevenimos la navegación por defecto del navegador
            event.preventDefault();

            // Calculamos la posición del elemento destino
            // getBoundingClientRect() devuelve la posición relativa al viewport
            // window.scrollY → posición actual del scroll
            // headerHeight → altura del header (para que no quede tapado por el header sticky)
            const headerHeight = document.getElementById('mainHeader').offsetHeight || 70;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            // scrollTo con behavior: 'smooth' hace el scroll suave
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });


      // ──────────────────────────────────────────────────────────────
      // 7. FALLBACK: Si el navegador no soporta Intersection Observer
      // ──────────────────────────────────────────────────────────────
      // Intersection Observer es compatible con todos los browsers modernos.
      // Pero si por algún motivo falla, mostramos todos los elementos de una vez.
      if (!('IntersectionObserver' in window)) {
        // Hacemos visibles todos los elementos animados directamente
        document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
          el.classList.add('is-visible');
        });
      }

    }); // Fin del DOMContentLoaded


    // ════════════════════════════════════════════════════════════════
    // FUNCIONES UTILITARIAS (fuera del DOMContentLoaded)
    // Estas funciones son helpers que pueden usarse globalmente.
    // ════════════════════════════════════════════════════════════════

    // Función para construir URLs de WhatsApp (exportable si separás el JS)
    // Uso: buildWhatsAppURL('59811223344', 'Hola, quiero info')
    // Retorna: 'https://wa.me/59811223344?text=Hola%2C%20quiero%20info'
    function buildWhatsAppURL(number, message) {
      return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
    }

    // Función para hacer scroll suave a un elemento (usable desde otros scripts)
    // Uso: scrollToElement('#productos')
    function scrollToElement(selector) {
      const target = document.querySelector(selector);
      if (target) {
        const headerHeight = 70;  // Cambiá si cambiás la altura del header
        const position = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    }

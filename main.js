if ('scrollRestoration' in history) {
    history.scrollRestoration = "auto";
    }


        // Desactivar animación de los grid items solo al volver hacia atrás
        window.addEventListener('pageshow', function(event) {
            if (event.persisted || (performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0]?.type === 'back_forward')) {
                document.body.classList.add('no-grid-anim');
            }
        });
        // Mobile menu functionality
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileClose = document.querySelector('.mobile-close');
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
        const body = document.body;

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            body.classList.add('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        });

        mobileClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                body.classList.remove('menu-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe all elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });

        // Section animations
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const title = section.querySelector('.section-title');
                    const content = section.querySelector('.about-text, .about-image, .contact-info, .contact-form');
                    
                    if (title) title.classList.add('animate');
                    if (content) content.classList.add('animate');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.about, .contact').forEach(section => {
            sectionObserver.observe(section);
        });

        // Form submission
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
        });

        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });

        // AI Chat functionality
        function toggleChat() {
            const chatWidget = document.getElementById('chatWidget');
            const chatToggle = document.querySelector('.chat-toggle');
            
            if (chatWidget.classList.contains('active')) {
                chatWidget.classList.remove('active');
                chatToggle.style.display = 'block';
            } else {
                chatWidget.classList.add('active');
                chatToggle.style.display = 'none';
            }
        }

        let chatState = {
            awaitingContact: false,
            lastUserMessage: '',
            name: '',
            contact: '',
            awaitingConsent: false,
            userQuestions: 0
        };

        function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            if (!message) return;
            addMessage(message, 'user');
            input.value = '';

            if (chatState.awaitingContact) {
                addMessage('Por favor, completa el formulario que aparece al final de la página para que podamos contactarte. ¡Gracias!', 'ai');
                chatState.awaitingContact = false;
                chatState.lastUserMessage = '';
                chatState.awaitingConsent = false;
                return;
            }

            if (chatState.awaitingConsent) {
                const yesWords = ['si', 'sí', 'claro', 'por favor', 'me gustaría', 'me gustaria', 'quiero', 'deseo', 'afirmativo', 'ok', 'de acuerdo'];
                if (yesWords.some(w => message.toLowerCase().includes(w))) {
                    addMessage('Por favor, completa el formulario que aparece al final de la página para que podamos contactarte. ¡Gracias!', 'ai');
                    chatState.awaitingContact = false;
                    chatState.awaitingConsent = false;
                } else {
                    addMessage('Perfecto, si necesita más información no dude en consultarnos nuevamente.', 'ai');
                    chatState.awaitingConsent = false;
                }
                return;
            }

            // Primer consulta normal
            chatState.lastUserMessage = message;
            // Se elimina el conteo de preguntas y la lógica de pedir datos tras varias preguntas
            setTimeout(() => {
                const aiResponse = generateAIResponse(message);
                addMessage(aiResponse, 'ai');
                // Si la respuesta es la default, pedir contacto
                if (aiResponse === responses.default) {
                    setTimeout(() => {
                        addMessage('Para poder contactarte, por favor completa el formulario que aparece al final de la página. ¡Gracias!', 'ai');
                        chatState.awaitingContact = false;
                    }, 800);
                    return;
                }
            }, 1000);
        }

        function handleChatKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        function addMessage(text, sender) {
            const messagesContainer = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            messageDiv.textContent = text;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function generateAIResponse(userMessage) {
            const responses = {
                'productos': 'Nuestros productos comprenden láminas de plomo, vidrios plomados, ladrillos de plomo y piezas especiales. Todos ellos cumplen con los estándares internacionales más exigentes en materia de protección radiológica.',
                'precio': 'Los precios pueden variar en función del tipo de producto y las especificaciones requeridas. Le sugerimos contactarnos directamente para recibir una cotización personalizada y adecuada a sus necesidades.',
                'contacto': 'Puede comunicarse con nosotros al +54 11 6820-8998, por correo electrónico a ventas@dmlblindajes.com.ar, o completar el formulario disponible en nuestro sitio web.',
                'instalación': 'Disponemos de un servicio de instalación profesional realizado por técnicos altamente capacitados. El mismo incluye la planificación, ejecución y certificación conforme a las normativas vigentes.',
                'certificaciones': 'Todos nuestros productos cuentan con certificaciones ISO 9001, ANMAT y cumplen con los estándares internacionales de seguridad radiológica.',
                'sillon': 'Para equipos de sillón, tales como los utilizados en consultorios odontológicos o clínicas veterinarias, se recomienda emplear un espesor de 0.5 mm de lámina de plomo para el revestimiento de paredes.',
                'odontologico': 'En consultorios odontológicos, el espesor sugerido de lámina de plomo para el revestimiento de paredes es de 0.5 mm.',
                'veterinaria': 'En clínicas veterinarias, para equipos de rayos, se sugiere un espesor de 0.5 mm de plomo para el revestimiento de paredes.',
                'medidas': 'Las láminas de plomo se comercializan en tamaño estándar de 2 x 1 metro en todos los espesores, salvo requerimientos especiales. Existe una excepción: la lámina de 0.5 mm también se ofrece en formato de 1 x 1 metro.',
                'cotizacion': 'Para poder enviarle una cotización adecuada, le solicitamos que nos indique qué tipo de revestimiento en plomo necesita realizar (por ejemplo: pared, puerta, ventana, etc.) y la cantidad de láminas requeridas. Con esta información podremos asesorarle de manera precisa.',
                'pegamento': 'Además de las láminas de plomo, también comercializamos el adhesivo especializado necesario para su correcta instalación. Si requiere información sobre el pegamento para láminas, no dude en consultarnos.',
                'vidrios': 'También comercializamos vidrios plomados de alta calidad, diseñados para brindar protección radiológica y máxima transparencia. Si desea información sobre nuestros vidrios plomados, por favor consúltenos.',
                'envio': 'Realizamos envíos a coordinar con el comprador, de acuerdo a la cantidad de unidades y la ubicación geográfica. En base a estos datos, se selecciona el expreso o transporte más apropiado para asegurar la entrega eficiente y segura.',
                'default': 'Agradecemos su consulta. Para obtener información más específica, le pedimos que complete el formulario que aparece al final de la página para poder contactarnos con usted.',
                'blindaje': 'Recomendamos solicitar un cálculo de blindaje para determinar el espesor de plomo que deberán llevar las paredes de la sala donde se encuentra el equipo de Rx. Factores como la potencia del equipo, ubicación, calidad de las paredes, distancia del operador respecto del equipo de Rx y determinación de los diferentes sectores que limitan con la sala son tenidos en cuenta para realizar el mencionado cálculo.\n\nPor experiencia podemos inferir que equipos de odontología periapicales y mamógrafos requieren una protección de 0.5mm de plomo. Equipos de Rx 1mm o más teniendo en cuenta lo mencionado previamente. Equipos de TC llevarán entre 1 y 3mm luego del análisis de los factores mencionados.'
            };

            const lowerMessage = userMessage.toLowerCase();
            
            if (lowerMessage.includes('envio') || lowerMessage.includes('envío') || lowerMessage.includes('envios') || lowerMessage.includes('envíos') || lowerMessage.includes('transporte') || lowerMessage.includes('entrega')) return responses.envio;
            if (lowerMessage.includes('vidrio') || lowerMessage.includes('vidrios')) return responses.vidrios;
            if (lowerMessage.includes('pegamento') || lowerMessage.includes('adhesivo') || lowerMessage.includes('pegar')) return responses.pegamento;
            if (lowerMessage.includes('cotiz') || lowerMessage.includes('presup')) return responses.cotizacion;
            if (lowerMessage.includes('medida') || lowerMessage.includes('tamaño') || lowerMessage.includes('dimens')) return responses.medidas;
            if (lowerMessage.includes('sillon') || lowerMessage.includes('sillón')) return responses.sillon;
            if (lowerMessage.includes('odontolog') || lowerMessage.includes('dentista')) return responses.odontologico;
            if (lowerMessage.includes('veterinaria') || lowerMessage.includes('veterinario')) return responses.veterinaria;
            if (lowerMessage.includes('producto')) return responses.productos;
            if (lowerMessage.includes('precio') || lowerMessage.includes('costo')) return responses.precio;
            if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono')) return responses.contacto;
            if (lowerMessage.includes('instalación') || lowerMessage.includes('instalar')) return responses.instalación;
            if (lowerMessage.includes('certificación') || lowerMessage.includes('certificado')) return responses.certificaciones;
            if (lowerMessage.includes('blindaje') || lowerMessage.includes('espesor de plomo') || lowerMessage.includes('proteccion de sala') || lowerMessage.includes('protección de sala') || lowerMessage.includes('protección') && lowerMessage.includes('plomo')) return responses.blindaje;
            
            return responses.default;
        }

        // Service modal functionality
        function openServiceModal(service) {
            const serviceData = {
                laminados: {
                    title: 'Productos Laminados',
                    description: 'Nuestros productos laminados están diseñados específicamente para proporcionar protección radiológica efectiva en diversos entornos médicos e industriales.',
                    features: [
                        'Láminas de plomo de diferentes espesores',
                        'Materiales compuestos de alta densidad',
                        'Cumplimiento con estándares internacionales',
                        'Personalización según requerimientos específicos'
                    ],
                    image: 'IMG-20170207-WA0013-495x400.jpg'
                },
                piezas: {
                    title: 'Piezas Especiales',
                    description: 'Desarrollamos piezas especiales personalizadas que se adaptan perfectamente a las necesidades específicas de cada instalación y aplicación.',
                    features: [
                        'Diseño personalizado según especificaciones',
                        'Fabricación con materiales de alta calidad',
                        'Pruebas de calidad exhaustivas',
                        'Instalación y mantenimiento incluido'
                    ],
                    image: 'IMG-20170207-WA0024-495x400.jpg'
                },
                ladrillos: {
                    title: 'Ladrillos de Plomo',
                    description: 'Nuestros ladrillos de plomo están fabricados con la más alta calidad para construcción de barreras radiológicas efectivas.',
                    features: [
                        'Diferentes densidades disponibles',
                        'Múltiples tamaños estándar',
                        'Fácil instalación y manipulación',
                        'Durabilidad excepcional'
                    ],
                    image: 'IMG-20170207-WA0013-495x400.jpg'
                },
                vidrios: {
                    title: 'Vidrios Plomados',
                    description: 'Ofrecemos vidrios plomados de alta transparencia que permiten observación segura en áreas con radiación.',
                    features: [
                        'Alta transparencia óptica',
                        'Protección radiológica efectiva',
                        'Diferentes espesores disponibles',
                        'Instalación profesional incluida'
                    ],
                    image: 'IMG-20170207-WA0024-495x400.jpg'
                },
                instalacion: {
                    title: 'Instalación Profesional',
                    description: 'Nuestro equipo de profesionales altamente capacitados garantiza una instalación segura y eficiente de todos nuestros productos.',
                    features: [
                        'Equipo técnico especializado',
                        'Planificación detallada del proyecto',
                        'Cumplimiento de normativas de seguridad',
                        'Servicio post-instalación'
                    ],
                    image: 'IMG-20170207-WA0013-495x400.jpg'
                },
                certificaciones: {
                    title: 'Certificaciones',
                    description: 'Todos nuestros productos cumplen con las normativas internacionales más estrictas de seguridad radiológica.',
                    features: [
                        'Certificación ISO 9001',
                        'Cumplimiento con estándares ANMAT',
                        'Pruebas de calidad certificadas',
                        'Documentación técnica completa'
                    ],
                    image: 'IMG-20170207-WA0024-495x400.jpg'
                }
            };

            const data = serviceData[service];
            if (data) {
                showServiceModal(data);
            }
        }

        function showServiceModal(data) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s ease;
                overflow: hidden;
            `;

            modal.innerHTML = `
                <div style="
                    background: white;
                    padding: 3rem 4rem;
                    border-radius: 18px;
                    max-width: 900px;
                    width: 90vw;
                    max-height: 90vh;
                    overflow-y: auto;
                "
                class="modal-content-responsive"
                >
                    <button onclick="closeModal(this)" style="
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: #6b7280;
                        z-index: 10;
                    ">×</button>
                    <h2 style="color: #1f2937; margin-bottom: 1rem; font-size: 2rem;">${data.title}</h2>
                    <p style="color: #4b5563; margin-bottom: 1.5rem; line-height: 1.6;">${data.description}</p>
                    <h3 style="color: #1f2937; margin-bottom: 1rem;">Características principales:</h3>
                    <ul style="color: #4b5563; line-height: 1.6;">
                        ${data.features.map(feature => `<li style="margin-bottom: 0.5rem;">${feature}</li>`).join('')}
                    </ul>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
            
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.querySelector('div').style.transform = 'translateY(0)';
            }, 10);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }


        function closeModal(element) {
            const modal = element.closest('div[style*="position: fixed"]');
            if (modal) {
                modal.remove();
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.height = '';
            }
        }

        // Unir las dos últimas palabras de cada párrafo de .about-text para evitar huérfanas

document.addEventListener('DOMContentLoaded', function() {
document.querySelectorAll('.about-text p').forEach(function(p) {
    let html = p.innerHTML.trim();
    p.innerHTML = html.replace(/\s+(\S+)\s*$/, '&nbsp;$1');
    });
    document.querySelectorAll('.service-card p').forEach(function(p) {
    let html = p.innerHTML.trim();
    p.innerHTML = html.replace(/\s+(\S+)\s*$/, '&nbsp;$1');
    });
});
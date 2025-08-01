// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
const body = document.body;

if (mobileMenuBtn && mobileMenu && mobileClose) {
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
}

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
        const parts = message.split(/[,;
]/);
        if (parts.length >= 2) {
            chatState.name = parts[0].trim();
            chatState.contact = parts[1].trim();
            addMessage('¡Gracias! Sus datos han sido recibidos. Un asesor se pondrá en contacto a la brevedad.', 'ai');
            chatState.awaitingContact = false;
            chatState.lastUserMessage = '';
            chatState.awaitingConsent = false;
        } else {
            addMessage('Por favor, indique su nombre y teléfono o correo electrónico, separados por coma.', 'ai');
        }
        return;
    }

    if (chatState.awaitingConsent) {
        const yesWords = ['si', 'sí', 'claro', 'por favor', 'me gustaría', 'me gustaria', 'quiero', 'deseo', 'afirmativo', 'ok', 'de acuerdo'];
        if (yesWords.some(w => message.toLowerCase().includes(w))) {
            addMessage('¿Podría indicarme su nombre y teléfono o correo electrónico para que podamos contactarlo? Por favor, escríbalo así: Nombre, Teléfono/Correo', 'ai');
            chatState.awaitingContact = true;
            chatState.awaitingConsent = false;
        } else {
            addMessage('Perfecto, si necesita más información no dude en consultarnos nuevamente.', 'ai');
            chatState.awaitingConsent = false;
        }
        return;
    }

    chatState.lastUserMessage = message;
    setTimeout(() => {
        const aiResponse = generateAIResponse(message);
        addMessage(aiResponse, 'ai');
        if (aiResponse === responses.default) {
            setTimeout(() => {
                addMessage('¿Podría indicarme su correo electrónico o teléfono para que podamos responderle a la brevedad?', 'ai');
                chatState.awaitingContact = true;
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
        'contacto': 'Puede comunicarse con nosotros al +54 11 6820-8998, por correo electrónico a info@dmlblindajes.com.ar, o completar el formulario disponible en nuestro sitio web.',
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
        'default': 'Agradecemos su consulta. Para obtener información más específica, le pedimos un número de teléfono o correo electrónico para contactarnos directamente.'
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
    return responses.default;
} 
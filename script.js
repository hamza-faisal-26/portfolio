// Chat functionality
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const chatToggle = document.querySelector('.chat-toggle');

// API Configuration
// When deployed: replace 'http://localhost:8000' with your Render.com URL
// Example: 'https://portfolio-chatbot-api.onrender.com'
// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = 'https://hamzafaisal26-portfolio-chatbot-api.hf.space';

// Add event listeners
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Smooth scroll to chat when chat toggle is clicked
chatToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const chatSection = document.getElementById('chat');
    chatSection.scrollIntoView({ behavior: 'smooth' });
    chatInput.focus();
});

// Send message function
async function sendMessage() {
    const message = chatInput.value.trim();

    if (!message) return;

    // Display user message
    addMessageToChat(message, 'user');
    chatInput.value = '';
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    try {
        // Send to backend API
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: message })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        const botResponse = data.response || data.message || 'Sorry, I could not process your request.';

        // Display bot response
        addMessageToChat(botResponse, 'bot');
    } catch (error) {
        console.error('Chat error:', error);
        addMessageToChat("Sorry, I can't work right now. Please retry later.", 'bot');
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
        chatInput.focus();
    }
}

// Add message to chat display
function addMessageToChat(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

    const p = document.createElement('p');
    p.textContent = text;
    messageDiv.appendChild(p);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}



// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if it's the chat toggle button
        if (href === '#chat' && this.classList.contains('chat-toggle')) {
            return;
        }

        const target = document.querySelector(href);
        if (target && href !== '#chat') {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initialize
console.log('Portfolio website loaded. Chat is ready to use!');
console.log(`API endpoint configured at: ${API_BASE_URL}`);

// Optional: Display initialization message
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // You can add any additional initialization code here
    // For example, checking if the API is available
    checkAPIAvailability();
});

// Check if backend API is available
async function checkAPIAvailability() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            console.log('✓ Backend API is available');
        } else {
            console.warn('⚠ Backend API is not responding correctly');
        }
    } catch (error) {
        console.warn('⚠ Backend API is not available. Using fallback responses.');
        console.log('Start your FastAPI server to enable live AI responses.');
    }
}

// Dark mode toggle (optional feature)
function initDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        // Optionally add dark mode support here
        console.log('Dark mode preference detected');
    }
}

// Performance: Lazy load images if any
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

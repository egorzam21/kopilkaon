// Функция для отслеживания событий аналитики
function trackEvent(eventName, eventData = {}) {
    // Отправка в Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Отправка в Яндекс.Метрику
    if (typeof ym !== 'undefined') {
        ym(105203779, 'reachGoal', eventName, eventData);
    }
    
    console.log('Event tracked:', eventName, eventData);
}

// Обработчик кликов для data-event атрибутов
document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-event]');
    if (target) {
        const eventName = target.getAttribute('data-event');
        const eventData = {};
        
        // Собираем дополнительные данные из data-атрибутов
        for (let attr of target.attributes) {
            if (attr.name.startsWith('data-') && attr.name !== 'data-event') {
                eventData[attr.name.replace('data-', '')] = attr.value;
            }
        }
        
        trackEvent(eventName, eventData);
    }
});

// Функции для работы с модальными окнами
function openModal(modal) {
    modal.style.display = 'flex';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const heroRegisterBtn = document.getElementById('hero-register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');

    // Переменные состояния
    let isAuthenticated = false;
    let currentUser = null;

    // Обработчики событий для кнопок авторизации
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (registerBtn) registerBtn.addEventListener('click', () => openModal(registerModal));
    if (heroRegisterBtn) heroRegisterBtn.addEventListener('click', () => openModal(registerModal));

    // Переключение между модальными окнами
    if (showRegister) showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        openModal(registerModal);
    });

    if (showLogin) showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
        openModal(loginModal);
    });

    // Закрытие модальных окон
    closeModals.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Обработка форм
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            
            // Здесь должна быть реальная логика авторизации
            isAuthenticated = true;
            currentUser = {
                name: email.split('@')[0],
                email: email
            };
            
            updateUI();
            closeAllModals();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            
            // Здесь должна быть реальная логика регистрации
            isAuthenticated = true;
            currentUser = {
                name: name,
                email: email
            };
            
            updateUI();
            closeAllModals();
        });
    }

    // Выход из системы
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            isAuthenticated = false;
            currentUser = null;
            updateUI();
        });
    }

    // Мобильное меню
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // Обновление интерфейса в зависимости от состояния авторизации
    function updateUI() {
        if (isAuthenticated && currentUser) {
            // Показать информацию о пользователе
            if (authButtons) authButtons.style.display = 'none';
            if (userInfo) userInfo.style.display = 'flex';
            if (userName) userName.textContent = currentUser.name;
            if (userAvatar) userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        } else {
            // Показать кнопки авторизации
            if (authButtons) authButtons.style.display = 'flex';
            if (userInfo) userInfo.style.display = 'none';
        }
    }

    // Инициализация
    updateUI();
});

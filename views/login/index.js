/**
 * ===========================================
 * JAVASCRIPT PARA A TELA DE LOGIN/CADASTRO
 * ===========================================
 * 
 * Arquivo: script.js
 * Descrição: Lógica completa para autenticação com sistema de demonstração
 * Autor: Equipe NexusTrack
 * Data: 2025
 * Versão: 2.0 (Com ID e sistema demo completo)
 * 
 * Funcionalidades:
 * 1. Detecção de tema (claro/escuro)
 * 2. Alternância entre formulários
 * 3. Validação de campos
 * 4. Tratamento de erros
 * 5. Feedback ao usuário
 * 6. Sistema de ID automático
 * 7. Painel de demonstração visual
 * 8. Comandos de console para desenvolvedores
 * 9. Gestão de usuários demo
 * 10. Redirecionamento para dashboard
 */

'use strict';

// ===========================================
// 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// ===========================================

/**
 * Sistema de ID automático para usuários
 */
let nextUserId = 1;

/**
 * Simulação de um banco de dados de usuários
 * ATENÇÃO: Em um app real, isso seria gerenciado no backend!
 * Esta implementação é APENAS para prototipagem
 */
let users = [];

/**
 * Função para gerar próximo ID único
 */
function generateNextId() {
    return nextUserId++;
}

/**
 * Adiciona usuários de demonstração com IDs únicos
 */
function addDemoUsers() {
    const demoUsers = [
        {
            id: generateNextId(),
            firstName: 'Admin',
            lastName: 'Sistema',
            email: 'admin@nexustrack.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date('2024-01-01').toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true
        },
        {
            id: generateNextId(),
            firstName: 'Usuário',
            lastName: 'Teste',
            email: 'teste@email.com',
            password: 'senha123',
            role: 'user',
            createdAt: new Date('2024-06-15').toISOString(),
            lastLogin: new Date('2024-12-20').toISOString(),
            isActive: true
        },
        {
            id: generateNextId(),
            firstName: 'Ana',
            lastName: 'Silva',
            email: 'ana.silva@demo.com',
            password: '123456',
            role: 'user',
            createdAt: new Date('2024-03-10').toISOString(),
            lastLogin: new Date('2024-12-18').toISOString(),
            isActive: true
        },
        {
            id: generateNextId(),
            firstName: 'Carlos',
            lastName: 'Santos',
            email: 'carlos.santos@demo.com',
            password: 'demo123',
            role: 'manager',
            createdAt: new Date('2024-02-28').toISOString(),
            lastLogin: new Date('2024-12-15').toISOString(),
            isActive: true
        },
        {
            id: generateNextId(),
            firstName: 'Maria',
            lastName: 'Oliveira',
            email: 'maria.oliveira@demo.com',
            password: 'maria2025',
            role: 'user',
            createdAt: new Date('2024-08-22').toISOString(),
            lastLogin: new Date('2024-12-10').toISOString(),
            isActive: false
        },
        {
            id: generateNextId(),
            firstName: 'João',
            lastName: 'Pereira',
            email: 'joao.pereira@demo.com',
            password: 'joao456',
            role: 'user',
            createdAt: new Date('2024-11-05').toISOString(),
            lastLogin: new Date('2024-12-22').toISOString(),
            isActive: true
        },
                {
            id: generateNextId(),
            firstName: 'Victtor',
            lastName: 'Dezan',
            email: 'victtordezan@gmail.com',
            password: '19130506',
            role: 'user',
            createdAt: new Date('2024-11-05').toISOString(),
            lastLogin: new Date('2024-12-22').toISOString(),
            isActive: true
        }
    ];

    // Adiciona todos os usuários de demonstração
    users.push(...demoUsers);
}

// Chama a função para adicionar os usuários
addDemoUsers();

console.log("🚀 Sistema NexusTrack inicializado!");
console.log(`📊 Usuários de demonstração carregados: ${users.length}`);
console.log("🔧 Use demoCommands no console para gerenciar usuários");

// ===========================================
// 2. INICIALIZAÇÃO E DETECÇÃO DE TEMA
// ===========================================

/**
 * Detecção automática do tema (claro/escuro)
 * baseado na preferência do sistema do usuário
 */
function initThemeDetection() {
    // Verifica preferência inicial
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }

    // Escuta mudanças na preferência do tema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
}

/**
 * Ajusta a altura mínima do formulário com base no conteúdo
 * Garante que o efeito de flip funcione adequadamente
 */
function adjustFormHeight() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const formContainer = document.getElementById('formContainer');
    const perspective = document.querySelector('.perspective');
   
    if (registerForm && loginForm && formContainer && perspective) {
        const registerHeight = registerForm.scrollHeight;
        const loginHeight = loginForm.scrollHeight;
        const maxHeight = Math.max(registerHeight, loginHeight) + 40;
       
        formContainer.style.minHeight = maxHeight + 'px';
        perspective.style.minHeight = maxHeight + 'px';
    }
}

/**
 * Atualiza contadores de usuários na interface
 */
function updateUserCounters() {
    const headerCount = document.getElementById('headerUserCount');
    const panelCount = document.getElementById('userCount');
    
    if (headerCount) headerCount.textContent = users.length;
    if (panelCount) panelCount.textContent = users.length;
}

// ===========================================
// 3. ALTERNÂNCIA ENTRE FORMULÁRIOS
// ===========================================

/**
 * Classe para gerenciar a alternância entre formulários
 */
class FormToggler {
    constructor() {
        this.formContainer = document.getElementById('formContainer');
        this.toRegisterBtn = document.getElementById('toRegisterBtn');
        this.toLoginBtn = document.getElementById('toLoginBtn');
        this.leftToggleBtn = document.getElementById('leftToggleBtn');
        
        this.initEventListeners();
    }

    /**
     * Inicializa os event listeners para os botões de alternância
     */
    initEventListeners() {
        this.toRegisterBtn?.addEventListener('click', () => this.showRegisterForm());
        this.toLoginBtn?.addEventListener('click', () => this.showLoginForm());
        
        this.leftToggleBtn?.addEventListener('click', () => {
            if (this.formContainer.classList.contains('flipped')) {
                this.showLoginForm();
            } else {
                this.showRegisterForm();
            }
        });
    }

    /**
     * Exibe o formulário de cadastro
     */
    showRegisterForm() {
        this.formContainer.classList.add('flipped');
        this.updateToggleButtonText();
    }

    /**
     * Exibe o formulário de login
     */
    showLoginForm() {
        this.formContainer.classList.remove('flipped');
        this.updateToggleButtonText();
    }

    /**
     * Atualiza o texto do botão de alternância lateral
     */
    updateToggleButtonText() {
        if (!this.leftToggleBtn) return;
        
        const isFlipped = this.formContainer.classList.contains('flipped');
        this.leftToggleBtn.textContent = isFlipped ? 'Alternar para Login' : 'Alternar para Cadastro';
    }
}

// ===========================================
// 4. SISTEMA DE VALIDAÇÃO
// ===========================================

/**
 * Classe para gerenciar validações e feedback de erro
 */
class ValidationManager {
    /**
     * Exibe mensagem de erro para um campo específico
     * @param {string} inputId - ID do campo de entrada
     * @param {string} message - Mensagem de erro
     * @returns {boolean} - Sempre retorna false para uso em validações
     */
    showError(inputId, message) {
        const errorElement = document.getElementById(`${inputId}Error`);
        const inputElement = document.getElementById(inputId);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        
        if (inputElement) {
            inputElement.classList.add('border-red-500');
        }
        
        return false;
    }

    /**
     * Limpa as mensagens de erro de um campo específico
     * @param {string} inputId - ID do campo de entrada
     */
    clearError(inputId) {
        const errorElement = document.getElementById(`${inputId}Error`);
        const inputElement = document.getElementById(inputId);
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.add('hidden');
        }
        
        if (inputElement) {
            inputElement.classList.remove('border-red-500');
        }
    }

    /**
     * Valida formato de email
     * @param {string} email - Email a ser validado
     * @returns {boolean} - True se válido
     */
    isValidEmail(email) {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    }

    /**
     * Inicializa listeners para limpeza automática de erros
     */
    initAutoErrorClear() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.id) {
                    this.clearError(input.id);
                }
            });
        });
    }
}

// ===========================================
// 5. SISTEMA DE AUTENTICAÇÃO (SIMULADO)
// ===========================================

/**
 * Classe para gerenciar operações de autenticação
 */
class AuthManager {
    constructor(validationManager) {
        this.validator = validationManager;
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        this.initEventListeners();
    }

    /**
     * Inicializa os event listeners dos formulários
     */
    initEventListeners() {
        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm?.addEventListener('submit', (e) => this.handleRegister(e));
    }

    /**
     * Processa o login do usuário
     * @param {Event} e - Evento de submit do formulário
     */
    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        // Limpa erros anteriores
        this.validator.clearError('loginEmail');
        this.validator.clearError('loginPassword');
        
        // Validações
        if (!this.validateLoginFields(email, password)) {
            return;
        }

        // Verificação de usuário e senha
        this.authenticateUser(email, password);
    }

    /**
     * Valida os campos do formulário de login
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {boolean} - True se todos os campos são válidos
     */
    validateLoginFields(email, password) {
        let isValid = true;

        if (!email) {
            isValid = this.validator.showError('loginEmail', 'Email é obrigatório');
        } else if (!this.validator.isValidEmail(email)) {
            isValid = this.validator.showError('loginEmail', 'Formato de email inválido');
        }

        if (!password) {
            isValid = this.validator.showError('loginPassword', 'Senha é obrigatória');
        }

        return isValid;
    }

    /**
     * Autentica o usuário no sistema simulado
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     */
    authenticateUser(email, password) {
        const foundUser = users.find(user => user.email === email);
        
        if (foundUser) {
            if (!foundUser.isActive) {
                this.validator.showError('loginEmail', 'Conta desativada. Contate o administrador.');
                return;
            }
            
            if (foundUser.password === password) {
                this.onLoginSuccess(foundUser);
            } else {
                this.validator.showError('loginPassword', 'Senha incorreta.');
            }
        } else {
            this.validator.showError('loginEmail', 'Email não cadastrado.');
        }
    }

    /**
 * Executa ações após login bem-sucedido
 * @param {Object} user - Dados do usuário logado
 */
onLoginSuccess(user) {
    // Atualiza último login
    user.lastLogin = new Date().toISOString();
    
    // Salva os dados do usuário no localStorage
    localStorage.setItem('loggedInUser', JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        isActive: user.isActive
    }));
    
    const roleText = {
        'admin': '👑 Administrador',
        'manager': '👔 Gerente',
        'user': '👤 Usuário'
    };
    
    alert(`Login bem-sucedido! 🎉\n\nBem-vindo(a), ${user.firstName}!\nID: ${user.id}\nPerfil: ${roleText[user.role] || user.role}`);
    this.loginForm.reset();
    
    console.log("✅ Usuário logado (simulação):", {
        id: user.id,
        nome: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
    });
    
    // Atualiza painel se estiver aberto
    const demoManager = window.demoManagerInstance;
    if (demoManager) {
        demoManager.updateUserCount();
    }
    
    window.location.href = '/views/home/dashboard.html';
}

    /**
     * Processa o cadastro do usuário
     * @param {Event} e - Evento de submit do formulário
     */
    handleRegister(e) {
        e.preventDefault();
        
        const formData = this.getRegisterFormData();
        
        // Limpa erros anteriores
        this.clearRegisterErrors();
        
        // Validações
        if (!this.validateRegisterFields(formData)) {
            return;
        }

        // Registro do usuário
        this.registerUser(formData);
    }

    /**
     * Coleta dados do formulário de cadastro
     * @returns {Object} - Dados do formulário
     */
    getRegisterFormData() {
        return {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('registerEmail').value.trim(),
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            terms: document.getElementById('terms').checked
        };
    }

    /**
     * Limpa todos os erros do formulário de cadastro
     */
    clearRegisterErrors() {
        const fields = ['firstName', 'lastName', 'registerEmail', 'registerPassword', 'confirmPassword', 'terms'];
        fields.forEach(field => this.validator.clearError(field));
    }

    /**
     * Valida todos os campos do formulário de cadastro
     * @param {Object} data - Dados do formulário
     * @returns {boolean} - True se todos os campos são válidos
     */
    validateRegisterFields(data) {
        let isValid = true;

        // Validação do nome
        if (!data.firstName) {
            isValid = this.validator.showError('firstName', 'Nome é obrigatório');
        }

        // Validação do sobrenome
        if (!data.lastName) {
            isValid = this.validator.showError('lastName', 'Sobrenome é obrigatório');
        }

        // Validação do email
        if (!data.email) {
            isValid = this.validator.showError('registerEmail', 'Email é obrigatório');
        } else if (!this.validator.isValidEmail(data.email)) {
            isValid = this.validator.showError('registerEmail', 'Email inválido');
        } else if (this.emailExists(data.email)) {
            isValid = this.validator.showError('registerEmail', 'Este email já está cadastrado.');
        }

        // Validação da senha
        if (!data.password) {
            isValid = this.validator.showError('registerPassword', 'Senha é obrigatória');
        } else if (data.password.length < 6) {
            isValid = this.validator.showError('registerPassword', 'Senha deve ter pelo menos 6 caracteres');
        }

        // Validação da confirmação de senha
        if (!data.confirmPassword) {
            isValid = this.validator.showError('confirmPassword', 'Confirme sua senha');
        } else if (data.confirmPassword !== data.password) {
            isValid = this.validator.showError('confirmPassword', 'As senhas não coincidem');
        }

        // Validação dos termos
        if (!data.terms) {
            isValid = this.validator.showError('terms', 'Você deve concordar com os Termos e Política de Privacidade.');
        }

        return isValid;
    }

    /**
     * Verifica se um email já existe no sistema
     * @param {string} email - Email a ser verificado
     * @returns {boolean} - True se o email já existe
     */
    emailExists(email) {
        return users.some(user => user.email === email);
    }

    /**
     * Registra um novo usuário no sistema simulado
     * @param {Object} data - Dados do usuário a ser registrado
     */
    registerUser(data) {
        const newUser = {
            id: generateNextId(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password, // Em produção, seria hasheada no backend
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };

        users.push(newUser);
        
        console.log('✅ Usuário cadastrado (simulação):', {
            id: newUser.id,
            nome: `${newUser.firstName} ${newUser.lastName}`,
            email: newUser.email,
            createdAt: newUser.createdAt
        });
        
        this.onRegisterSuccess(newUser);
    }

    /**
     * Executa ações após cadastro bem-sucedido
     */
    onRegisterSuccess(user) {
        alert(`Cadastro bem-sucedido! 🎉\n\nID: ${user.id}\nNome: ${user.firstName} ${user.lastName}\n\nRedirecionando para o dashboard...`);
        this.registerForm.reset();
        this.validator.clearError('terms');
        
        // Atualiza contadores
        updateUserCounters();
        
        // Redireciona para o dashboard
        window.location.href = 'home/dashboard.html';
    }
}

// ===========================================
// 6. PAINEL DE DEMONSTRAÇÃO
// ===========================================

/**
 * Classe para gerenciar usuários de demonstração
 */
class DemoManager {
    constructor() {
        this.createDemoPanel();
        window.demoManagerInstance = this; // Instância global para referência
    }

    /**
     * Cria um painel flutuante para gerenciar usuários de demo
     */
    createDemoPanel() {
        // Cria o botão para abrir o painel
        const demoButton = document.createElement('button');
        demoButton.innerHTML = '🧪 Demo';
        demoButton.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all z-50 animate-pulse-demo demo-button';
        demoButton.onclick = () => this.togglePanel();
        
        // Cria o painel
        const panel = document.createElement('div');
        panel.id = 'demoPanel';
        panel.className = 'fixed bottom-16 right-4 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-xl p-4 w-80 hidden z-50 demo-panel fade-in-up';
        panel.innerHTML = this.getPanelHTML();
        
        document.body.appendChild(demoButton);
        document.body.appendChild(panel);
        
        this.attachPanelEvents();
    }

    /**
     * HTML do painel de demonstração
     */
    getPanelHTML() {
        return `
            <div class="mb-4">
                <h3 class="font-bold text-lg mb-2 gradient-text">🧪 Painel Demo</h3>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center justify-between">
                    <span>Usuários cadastrados:</span>
                    <span id="userCount" class="counter-badge">${users.length}</span>
                </div>
            </div>
            
            <div class="space-y-3">
                <button id="listUsers" class="w-full bg-blue-500 text-white py-2 px-3 rounded hover:bg-blue-600 transition-all demo-button">
                    📋 Listar Usuários
                </button>
                
                <button id="addRandomUser" class="w-full bg-green-500 text-white py-2 px-3 rounded hover:bg-green-600 transition-all demo-button">
                    ➕ Adicionar Usuário Aleatório
                </button>
                
                <button id="showStats" class="w-full bg-purple-500 text-white py-2 px-3 rounded hover:bg-purple-600 transition-all demo-button">
                    📊 Estatísticas
                </button>
                
                <button id="clearUsers" class="w-full bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition-all demo-button">
                    🗑️ Limpar Usuários
                </button>
                
                <button id="resetDemo" class="w-full bg-yellow-500 text-white py-2 px-3 rounded hover:bg-yellow-600 transition-all demo-button">
                    🔄 Resetar Demo
                </button>
            </div>
            
            <div id="panelContent" class="mt-4 max-h-60 overflow-y-auto text-sm custom-scrollbar"></div>
        `;
    }

    /**
     * Anexa eventos aos botões do painel
     */
    attachPanelEvents() {
        document.getElementById('listUsers').onclick = () => this.showUserList();
        document.getElementById('addRandomUser').onclick = () => this.addRandomUser();
        document.getElementById('showStats').onclick = () => this.showStats();
        document.getElementById('clearUsers').onclick = () => this.clearUsers();
        document.getElementById('resetDemo').onclick = () => this.resetDemo();
    }

    /**
     * Alterna a visibilidade do painel
     */
    togglePanel() {
        const panel = document.getElementById('demoPanel');
        panel.classList.toggle('hidden');
        this.updateUserCount();
    }

    /**
     * Atualiza o contador de usuários
     */
    updateUserCount() {
        updateUserCounters();
    }

    /**
     * Mostra a lista de usuários
     */
    showUserList() {
        const contentElement = document.getElementById('panelContent');
        const sortedUsers = [...users].sort((a, b) => b.id - a.id);
        
        const userListHTML = sortedUsers.map(user => {
            const roleEmoji = {
                'admin': '👑',
                'manager': '👔',
                'user': '👤'
            };
            
            const statusClass = user.isActive ? 'text-green-600' : 'text-red-600';
            const statusText = user.isActive ? 'Ativo' : 'Inativo';
            
            return `
                <div class="p-3 border dark:border-gray-600 rounded-lg mb-2 bg-gray-50 dark:bg-gray-700 user-card">
                    <div class="flex items-center justify-between mb-1">
                        <div class="font-semibold flex items-center">
                            ${roleEmoji[user.role] || '👤'} ${user.firstName} ${user.lastName}
                            <span class="ml-2 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">ID: ${user.id}</span>
                        </div>
                        <span class="text-xs ${statusClass} font-medium">${statusText}</span>
                    </div>
                    <div class="text-xs text-gray-600 dark:text-gray-400 mb-1">${user.email}</div>
                    <div class="text-xs text-blue-600 dark:text-blue-400 mb-1">Senha: ${user.password}</div>
                    <div class="text-xs text-gray-500">
                        Criado: ${new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        ${user.lastLogin ? '| Último login: ' + new Date(user.lastLogin).toLocaleDateString('pt-BR') : '| Nunca logou'}
                    </div>
                </div>
            `;
        }).join('');
        
        contentElement.innerHTML = userListHTML || '<div class="text-gray-500 text-center py-4">Nenhum usuário cadastrado</div>';
    }

    /**
     * Mostra estatísticas dos usuários
     */
    showStats() {
        const contentElement = document.getElementById('panelContent');
        
        const stats = {
            total: users.length,
            active: users.filter(u => u.isActive).length,
            inactive: users.filter(u => !u.isActive).length,
            admins: users.filter(u => u.role === 'admin').length,
            managers: users.filter(u => u.role === 'manager').length,
            regularUsers: users.filter(u => u.role === 'user').length,
            withLogin: users.filter(u => u.lastLogin).length,
            neverLogged: users.filter(u => !u.lastLogin).length
        };
        
        const statsHTML = `
            <div class="space-y-3">
                <h4 class="font-bold text-center mb-3">📊 Estatísticas do Sistema</h4>
                
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                        <div class="font-semibold">Total</div>
                        <div class="text-lg font-bold text-blue-600">${stats.total}</div>
                    </div>
                    <div class="bg-green-100 dark:bg-green-900 p-2 rounded">
                        <div class="font-semibold">Ativos</div>
                        <div class="text-lg font-bold text-green-600">${stats.active}</div>
                    </div>
                    <div class="bg-red-100 dark:bg-red-900 p-2 rounded">
                        <div class="font-semibold">Inativos</div>
                        <div class="text-lg font-bold text-red-600">${stats.inactive}</div>
                    </div>
                    <div class="bg-purple-100 dark:bg-purple-900 p-2 rounded">
                        <div class="font-semibold">Nunca logou</div>
                        <div class="text-lg font-bold text-purple-600">${stats.neverLogged}</div>
                    </div>
                </div>
                
                <div class="border-t dark:border-gray-600 pt-3">
                    <h5 class="font-semibold mb-2">Por Perfil:</h5>
                    <div class="space-y-1 text-xs">
                        <div class="flex justify-between">
                            <span>👑 Administradores:</span>
                            <span class="font-bold">${stats.admins}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>👔 Gerentes:</span>
                            <span class="font-bold">${stats.managers}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>👤 Usuários:</span>
                            <span class="font-bold">${stats.regularUsers}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        contentElement.innerHTML = statsHTML;
    }

    /**
     * Adiciona um usuário aleatório
     */
    addRandomUser() {
        const randomUsers = [
            { firstName: 'Lucas', lastName: 'Martins', email: 'lucas.martins@demo.com', password: 'lucas123', role: 'user' },
            { firstName: 'Fernanda', lastName: 'Costa', email: 'fernanda.costa@demo.com', password: 'fer456', role: 'user' },
            { firstName: 'Pedro', lastName: 'Almeida', email: 'pedro.almeida@demo.com', password: 'pedro789', role: 'manager' },
            { firstName: 'Juliana', lastName: 'Rodrigues', email: 'juliana.rodrigues@demo.com', password: 'jul123', role: 'user' },
            { firstName: 'Rafael', lastName: 'Lima', email: 'rafael.lima@demo.com', password: 'rafa456', role: 'user' },
            { firstName: 'Camila', lastName: 'Ferreira', email: 'camila.ferreira@demo.com', password: 'cam789', role: 'user' },
            { firstName: 'Gabriel', lastName: 'Sousa', email: 'gabriel.sousa@demo.com', password: 'gab123', role: 'manager' },
            { firstName: 'Larissa', lastName: 'Barbosa', email: 'larissa.barbosa@demo.com', password: 'lari456', role: 'user' }
        ];

        // Filtra usuários que ainda não foram adicionados
        const availableUsers = randomUsers.filter(randomUser => 
            !users.some(existingUser => existingUser.email === randomUser.email)
        );

        if (availableUsers.length === 0) {
            alert('❌ Todos os usuários aleatórios já foram adicionados!');
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableUsers.length);
        const userData = availableUsers[randomIndex];
        
        const newUser = {
            id: generateNextId(),
            ...userData,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };
        
        users.push(newUser);
        this.updateUserCount();
        
        alert(`✅ Usuário adicionado!\n\nID: ${newUser.id}\nNome: ${newUser.firstName} ${newUser.lastName}\nEmail: ${newUser.email}`);
        console.log('✅ Usuário aleatório adicionado:', newUser);
    }

    /**
     * Limpa todos os usuários exceto admin
     */
    clearUsers() {
        if (confirm('⚠️ Tem certeza que deseja limpar todos os usuários?\n\n(O administrador será mantido)')) {
            const adminUser = users.find(user => user.role === 'admin');
            users = adminUser ? [adminUser] : [];
            
            // Redefine o próximo ID
            nextUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            
            this.updateUserCount();
            document.getElementById('panelContent').innerHTML = '';
            alert('🗑️ Usuários limpos! Apenas administrador mantido.');
        }
    }

    /**
     * Reseta para o estado inicial da demonstração
     */
    resetDemo() {
        if (confirm('🔄 Resetar demonstração para o estado inicial?\n\nTodos os usuários atuais serão removidos e os usuários demo serão recarregados.')) {
            users = [];
            nextUserId = 1;
            addDemoUsers();
            this.updateUserCount();
            document.getElementById('panelContent').innerHTML = '';
            alert('🔄 Demonstração resetada com sucesso!');
            console.log('🔄 Sistema resetado para estado inicial');
        }
    }
}

// ===========================================
// 7. COMANDOS DE CONSOLE PARA DEMONSTRAÇÃO
// ===========================================

/**
 * Funções globais para facilitar testes via console
 */
window.demoCommands = {
    /**
     * Adiciona um usuário personalizado
     * Uso: demoCommands.addUser('Nome', 'Sobrenome', 'email@test.com', 'senha123', 'user')
     */
    addUser(firstName, lastName, email, password, role = 'user') {
        if (users.some(user => user.email === email)) {
            console.error('❌ Email já existe:', email);
            return false;
        }
        
        const newUser = {
            id: generateNextId(),
            firstName,
            lastName,
            email,
            password,
            role,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };
        
        users.push(newUser);
        updateUserCounters();
        
        console.log('✅ Usuário adicionado:', {
            id: newUser.id,
            nome: `${firstName} ${lastName}`,
            email,
            role
        });
        return newUser;
    },

    /**
     * Lista todos os usuários
     */
    listUsers() {
        console.table(users.map(user => ({
            ID: user.id,
            Nome: `${user.firstName} ${user.lastName}`,
            Email: user.email,
            Senha: user.password,
            Perfil: user.role,
            Status: user.isActive ? 'Ativo' : 'Inativo',
            'Criado em': new Date(user.createdAt).toLocaleDateString('pt-BR'),
            'Último login': user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'
        })));
        return users;
    },

    /**
     * Busca usuário por ID
     */
    getUser(id) {
        const user = users.find(u => u.id === parseInt(id));
        if (user) {
            console.log('👤 Usuário encontrado:', user);
            return user;
        } else {
            console.error('❌ Usuário não encontrado com ID:', id);
            return null;
        }
    },

    /**
     * Atualiza usuário por ID
     */
    updateUser(id, updates) {
        const userIndex = users.findIndex(u => u.id === parseInt(id));
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            updateUserCounters();
            console.log('✅ Usuário atualizado:', users[userIndex]);
            return users[userIndex];
        }
        console.error('❌ Usuário não encontrado com ID:', id);
        return null;
    },

    /**
     * Remove usuário por ID
     */
    removeUser(id) {
        const userIndex = users.findIndex(u => u.id === parseInt(id));
        if (userIndex !== -1) {
            const removed = users.splice(userIndex, 1)[0];
            updateUserCounters();
            console.log('🗑️ Usuário removido:', removed);
            return true;
        }
        console.error('❌ Usuário não encontrado com ID:', id);
        return false;
    },

    /**
     * Ativa/Desativa usuário
     */
    toggleUserStatus(id) {
        const user = users.find(u => u.id === parseInt(id));
        if (user) {
            user.isActive = !user.isActive;
            console.log(`🔄 Status do usuário ${user.firstName} alterado para: ${user.isActive ? 'Ativo' : 'Inativo'}`);
            return user;
        }
        console.error('❌ Usuário não encontrado com ID:', id);
        return null;
    },

    /**
     * Mostra estatísticas
     */
    stats() {
        const stats = {
            total: users.length,
            ativos: users.filter(u => u.isActive).length,
            inativos: users.filter(u => !u.isActive).length,
            admins: users.filter(u => u.role === 'admin').length,
            gerentes: users.filter(u => u.role === 'manager').length,
            usuarios: users.filter(u => u.role === 'user').length,
            comLogin: users.filter(u => u.lastLogin).length,
            semLogin: users.filter(u => !u.lastLogin).length
        };
        
        console.table(stats);
        return stats;
    },

    /**
     * Adiciona vários usuários de uma vez
     */
    bulkAdd(userArray) {
        let added = 0;
        userArray.forEach(userData => {
            if (this.addUser(userData.firstName, userData.lastName, userData.email, userData.password, userData.role)) {
                added++;
            }
        });
        console.log(`✅ ${added} usuários adicionados de ${userArray.length} tentativas`);
        return added;
    },

    /**
     * Reseta sistema
     */
    reset() {
        users = [];
        nextUserId = 1;
        addDemoUsers();
        updateUserCounters();
        console.log('🔄 Sistema resetado para estado inicial');
        return users;
    }
};

// Mostra comandos disponíveis no console
console.log(`
🧪 ========================================
   COMANDOS DE DEMONSTRAÇÃO DISPONÍVEIS
========================================

📝 GESTÃO DE USUÁRIOS:
• demoCommands.addUser('Nome', 'Sobrenome', 'email@test.com', 'senha', 'role')
• demoCommands.listUsers()
• demoCommands.getUser(id)
• demoCommands.updateUser(id, {firstName: 'NovoNome'})
• demoCommands.removeUser(id)
• demoCommands.toggleUserStatus(id)

📊 INFORMAÇÕES:
• demoCommands.stats()

🔧 UTILITÁRIOS:
• demoCommands.bulkAdd([{firstName:'Ana',lastName:'Silva',...}])
• demoCommands.reset()

💡 EXEMPLO:
demoCommands.addUser('João', 'Silva', 'joao@teste.com', 'minhasenha', 'manager')

========================================
`);

// ===========================================
// 8. INICIALIZAÇÃO DA APLICAÇÃO
// ===========================================

/**
 * Inicializa toda a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicialização dos componentes
    initThemeDetection();
    
    const validationManager = new ValidationManager();
    const formToggler = new FormToggler();
    const authManager = new AuthManager(validationManager);
    const demoManager = new DemoManager();
    
    // Configurações adicionais
    validationManager.initAutoErrorClear();
    adjustFormHeight();
    updateUserCounters();
    
    // Ajuste de altura responsivo
    window.addEventListener('resize', adjustFormHeight);
    window.addEventListener('load', adjustFormHeight);
    
    console.log('🚀 NexusTrack Login/Cadastro inicializado com sucesso!');
    console.log(`📊 Sistema carregado com ${users.length} usuários de demonstração`);
});
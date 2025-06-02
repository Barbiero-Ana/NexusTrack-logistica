/**
 * ===========================================
 * JAVASCRIPT PARA A TELA DE LOGIN/CADASTRO
 * ===========================================
 * 
 * Arquivo: login.js
 * Descrição: Lógica completa para autenticação
 * Autor: Equipe NexusTrack
 * Data: 2025
 * 
 * Funcionalidades:
 * 1. Detecção de tema (claro/escuro)
 * 2. Alternância entre formulários
 * 3. Validação de campos
 * 4. Tratamento de erros
 * 5. Feedback ao usuário
 * 6. Simulação de banco de dados (protótipo)
 */

'use strict';

// ===========================================
// 1. CONFIGURAÇÕES E VARIÁVEIS GLOBAIS
// ===========================================

/**
 * Simulação de um banco de dados de usuários
 * ATENÇÃO: Em um app real, isso seria gerenciado no backend!
 * Esta implementação é APENAS para prototipagem
 */
let users = [];

// Usuário de exemplo para demonstração
// NUNCA armazene senhas em texto claro em produção!
users.push({
    firstName: 'Usuário',
    lastName: 'Teste',
    email: 'teste@email.com',
    password: 'senha123'
});

console.log("Usuários iniciais (simulação):", users);

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
        alert(`Login bem-sucedido! Bem-vindo(a), ${user.firstName}!`);
        this.loginForm.reset();
        
        console.log("Usuário logado (simulação):", user);
        
        // Simulação de redirecionamento ou salvamento de estado
        // localStorage.setItem('loggedInUser', JSON.stringify(user));
        // setTimeout(() => window.location.href = 'dashboard.html', 1000);
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
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password // Em produção, seria hasheada no backend
        };

        users.push(newUser);
        
        console.log('Usuário cadastrado (simulação):', newUser);
        console.log('Todos os usuários (simulação):', users);
        
        this.onRegisterSuccess();
    }

    /**
     * Executa ações após cadastro bem-sucedido
     */
    onRegisterSuccess() {
        alert('Cadastro bem-sucedido! Você já pode fazer login.');
        this.registerForm.reset();
        this.validator.clearError('terms');
        
        // Volta para o formulário de login
        const formToggler = new FormToggler();
        formToggler.showLoginForm();
    }
}

// ===========================================
// 6. INICIALIZAÇÃO DA APLICAÇÃO
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
    
    // Configurações adicionais
    validationManager.initAutoErrorClear();
    adjustFormHeight();
    
    // Ajuste de altura responsivo
    window.addEventListener('resize', adjustFormHeight);
    window.addEventListener('load', adjustFormHeight);
    
    console.log('NexusTrack Login/Cadastro inicializado com sucesso!');
});
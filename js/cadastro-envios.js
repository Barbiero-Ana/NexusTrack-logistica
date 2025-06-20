/**
 * ===========================================
 * NEXUSTRACKR - CADASTRO DE ENVIOS
 * ===========================================
 * 
 * Sistema completo de cadastro de envios com:
 * - Validação de formulários
 * - Integração com sistema de usuários
 * - Armazenamento com IDs únicos
 * - Interface responsiva
 * - Máscaras de input
 * - Upload de arquivos
 */

'use strict';

// ===========================================
// 1. VARIÁVEIS GLOBAIS E CONFIGURAÇÃO
// ===========================================

let currentUser = null;
let shipments = [];
let nextShipmentId = 1;
let isSubmitting = false;

// Configuração
const CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: ['application/pdf'],
    maxNotesLength: 500
};

// ===========================================
// 2. GERENCIAMENTO DE USUÁRIO LOGADO
// ===========================================

/**
 * Verifica se há usuário logado e carrega dados
 */
function checkAuthenticatedUser() {
    // Simula verificação de usuário logado
    // Em produção, isso viria de um token/sessão
    const loggedUser = localStorage.getItem('loggedInUser');
    
    if (loggedUser) {
        try {
            currentUser = JSON.parse(loggedUser);
            updateUserInterface();
            loadUserShipments();
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            redirectToLogin();
        }
    } else {
        redirectToLogin();
    }
}

/**
 * Atualiza interface com dados do usuário
 */
function updateUserInterface() {
    if (!currentUser) return;
    
    const userInitials = document.getElementById('userInitials');
    const userName = document.getElementById('userName');
    const userId = document.getElementById('userId');
    
    if (userInitials) {
        userInitials.textContent = (currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)).toUpperCase();
    }
    
    if (userName) {
        userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    if (userId) {
        userId.textContent = currentUser.id || '-';
    }
}

/**
 * Carrega envios do usuário atual
 */
function loadUserShipments() {
    const savedShipments = localStorage.getItem('nexustrack_shipments');
    if (savedShipments) {
        try {
            const allShipments = JSON.parse(savedShipments);
            shipments = allShipments.filter(shipment => shipment.userId === currentUser.id);
            
            // Atualiza próximo ID
            if (allShipments.length > 0) {
                nextShipmentId = Math.max(...allShipments.map(s => s.id)) + 1;
            }
            
            updateShipmentStats();
        } catch (error) {
            console.error('Erro ao carregar envios:', error);
            shipments = [];
        }
    }
}

/**
 * Atualiza estatísticas de envios
 */
function updateShipmentStats() {
    const totalElement = document.getElementById('totalShipments');
    if (totalElement) {
        totalElement.textContent = shipments.length;
    }
}

/**
 * Redireciona para login
 */
function redirectToLogin() {
    showAlert('Você precisa fazer login para acessar esta página.', 'warning');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// ===========================================
// 3. SISTEMA DE ALERTAS
// ===========================================

/**
 * Exibe alertas na interface
 */
function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    const alertId = 'alert-' + Date.now();
    const icons = {
        success: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>`,
        warning: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>`
    };
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} fade-in">
            ${icons[type] || icons.info}
            <span>${message}</span>
            <button onclick="removeAlert('${alertId}')" class="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHTML);
    
    if (duration > 0) {
        setTimeout(() => removeAlert(alertId), duration);
    }
}

/**
 * Remove alerta específico
 */
function removeAlert(alertId) {
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(() => alert.remove(), 300);
    }
}

// ===========================================
// 4. VALIDAÇÃO DE FORMULÁRIO
// ===========================================

/**
 * Classe para gerenciar validações
 */
class FormValidator {
    constructor() {
        this.errors = {};
    }
    
    /**
     * Mostra erro para um campo
     */
    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.add('error');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        
        this.errors[fieldId] = message;
        return false;
    }
    
    /**
     * Limpa erro de um campo
     */
    clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.remove('error');
        }
        
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        
        delete this.errors[fieldId];
    }
    
    /**
     * Limpa todos os erros
     */
    clearAllErrors() {
        Object.keys(this.errors).forEach(fieldId => {
            this.clearError(fieldId);
        });
        this.errors = {};
    }
    
    /**
     * Verifica se há erros
     */
    hasErrors() {
        return Object.keys(this.errors).length > 0;
    }
    
    /**
     * Valida email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Valida CEP
     */
    validateCEP(cep) {
        const cepRegex = /^\d{5}-?\d{3}$/;
        return cepRegex.test(cep);
    }
    
    /**
     * Valida CNPJ
     */
    validateCNPJ(cnpj) {
        if (!cnpj) return true; // Campo opcional
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        return cnpjRegex.test(cnpj);
    }
    
    /**
     * Valida telefone
     */
    validatePhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }
    
    /**
     * Valida data
     */
    validateDate(date) {
        if (!date) return false;
        const selectedDate = new Date(date);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        return selectedDate <= today && selectedDate >= oneYearAgo;
    }
}

// ===========================================
// 5. MÁSCARAS DE INPUT
// ===========================================

/**
 * Classe para gerenciar máscaras de input
 */
class InputMasks {
    static applyCEPMask(input) {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            this.value = value;
        });
    }
    
    static applyPhoneMask(input) {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = '(' + value;
                if (value.length > 3) {
                    value = value.substring(0, 3) + ') ' + value.substring(3);
                }
                if (value.length > 9) {
                    if (value.length > 10) {
                        value = value.substring(0, 10) + '-' + value.substring(10, 15);
                    } else {
                        value = value.substring(0, 9) + '-' + value.substring(9, 13);
                    }
                }
            }
            this.value = value;
        });
    }
    
    static applyCNPJMask(input) {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            this.value = value;
        });
    }
    
    static applyTrackingCodeMask(input) {
        input.addEventListener('input', function() {
            let value = this.value.toUpperCase();
            // Remove caracteres não permitidos
            value = value.replace(/[^A-Z0-9-]/g, '');
            this.value = value;
        });
    }
}

// ===========================================
// 6. GERENCIAMENTO DE ARQUIVO
// ===========================================

/**
 * Classe para gerenciar upload de arquivos
 */
class FileManager {
    constructor() {
        this.currentFile = null;
        this.setupFileUpload();
    }
    
    setupFileUpload() {
        const fileInput = document.getElementById('pdfUpload');
        const filePreview = document.getElementById('filePreview');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const removeFile = document.getElementById('removeFile');
        
        fileInput.addEventListener('change', (event) => {
            this.handleFileSelection(event);
        });
        
        removeFile.addEventListener('click', () => {
            this.removeFile();
        });
        
        // Drag and drop
        const uploadLabel = document.querySelector('.file-upload-label');
        
        uploadLabel.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadLabel.style.borderColor = '#5D5CDE';
            uploadLabel.style.backgroundColor = 'rgba(93, 92, 222, 0.05)';
        });
        
        uploadLabel.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadLabel.style.borderColor = '';
            uploadLabel.style.backgroundColor = '';
        });
        
        uploadLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadLabel.style.borderColor = '';
            uploadLabel.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.handleFileSelection({ target: fileInput });
            }
        });
    }
    
    handleFileSelection(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validações
        if (file.size > CONFIG.maxFileSize) {
            showAlert('Arquivo muito grande. Tamanho máximo: 10MB', 'error');
            this.removeFile();
            return;
        }
        
        if (!CONFIG.allowedFileTypes.includes(file.type)) {
            showAlert('Tipo de arquivo não permitido. Apenas PDF é aceito.', 'error');
            this.removeFile();
            return;
        }
        
        // Atualiza interface
        this.currentFile = file;
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(file.size);
        document.getElementById('filePreview').classList.remove('hidden');
        
        showAlert('Arquivo anexado com sucesso!', 'success', 3000);
    }
    
    removeFile() {
        this.currentFile = null;
        document.getElementById('pdfUpload').value = '';
        document.getElementById('filePreview').classList.add('hidden');
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    getFile() {
        return this.currentFile;
    }
}

// ===========================================
// 7. GERENCIAMENTO DE ENVIOS
// ===========================================

/**
 * Classe para gerenciar envios
 */
class ShipmentManager {
    constructor() {
        this.validator = new FormValidator();
        this.fileManager = new FileManager();
        this.setupForm();
        this.setupEventListeners();
    }
    
    setupForm() {
        // Aplicar máscaras
        const zipCodeInput = document.getElementById('zipCode');
        const phone1Input = document.getElementById('phone1');
        const phone2Input = document.getElementById('phone2');
        const cnpjInput = document.getElementById('cnpj');
        const trackingCodeInput = document.getElementById('trackingCode');
        
        if (zipCodeInput) InputMasks.applyCEPMask(zipCodeInput);
        if (phone1Input) InputMasks.applyPhoneMask(phone1Input);
        if (phone2Input) InputMasks.applyPhoneMask(phone2Input);
        if (cnpjInput) InputMasks.applyCNPJMask(cnpjInput);
        if (trackingCodeInput) InputMasks.applyTrackingCodeMask(trackingCodeInput);
        
        // Contador de caracteres para observações
        const notesInput = document.getElementById('notes');
        const notesCount = document.getElementById('notesCount');
        
        if (notesInput && notesCount) {
            notesInput.addEventListener('input', () => {
                const length = notesInput.value.length;
                notesCount.textContent = length;
                
                if (length > CONFIG.maxNotesLength) {
                    notesInput.value = notesInput.value.substring(0, CONFIG.maxNotesLength);
                    notesCount.textContent = CONFIG.maxNotesLength;
                }
            });
        }
        
        // Gerar código de rastreamento automático
        this.generateTrackingCode();
    }
    
    setupEventListeners() {
        const form = document.getElementById('shipmentForm');
        const clearBtn = document.getElementById('clearForm');
        
        // Submit do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Limpar formulário
        clearBtn.addEventListener('click', () => {
            this.clearForm();
        });
        
        // Limpeza de erros em tempo real
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validator.clearError(input.id);
            });
        });
    }
    
    generateTrackingCode() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        const trackingCode = `NT-${day}${month}${year}-${random}`;
        document.getElementById('trackingCode').value = trackingCode;
    }
    
    validateForm(formData) {
        this.validator.clearAllErrors();
        let isValid = true;
        
        // Código de rastreamento
        if (!formData.trackingCode.trim()) {
            isValid = this.validator.showError('trackingCode', 'Código de rastreamento é obrigatório');
        } else if (formData.trackingCode.length < 5) {
            isValid = this.validator.showError('trackingCode', 'Código deve ter pelo menos 5 caracteres');
        }
        
        // Nome do destinatário
        if (!formData.recipientName.trim()) {
            isValid = this.validator.showError('recipientName', 'Nome do destinatário é obrigatório');
        } else if (formData.recipientName.trim().length < 2) {
            isValid = this.validator.showError('recipientName', 'Nome deve ter pelo menos 2 caracteres');
        }
        
        // CEP
        if (!formData.zipCode.trim()) {
            isValid = this.validator.showError('zipCode', 'CEP é obrigatório');
        } else if (!this.validator.validateCEP(formData.zipCode)) {
            isValid = this.validator.showError('zipCode', 'CEP inválido (formato: 00000-000)');
        }
        
        // Data de compra
        if (!formData.purchaseDate) {
            isValid = this.validator.showError('purchaseDate', 'Data de compra é obrigatória');
        } else if (!this.validator.validateDate(formData.purchaseDate)) {
            isValid = this.validator.showError('purchaseDate', 'Data deve estar entre hoje e um ano atrás');
        }
        
        // Transportadora
        if (!formData.carrier.trim()) {
            isValid = this.validator.showError('carrier', 'Nome da transportadora é obrigatório');
        }
        
        // CNPJ (opcional, mas se preenchido deve ser válido)
        if (formData.cnpj && !this.validator.validateCNPJ(formData.cnpj)) {
            isValid = this.validator.showError('cnpj', 'CNPJ inválido (formato: 00.000.000/0000-00)');
        }
        
        // Email
        if (!formData.email.trim()) {
            isValid = this.validator.showError('email', 'Email é obrigatório');
        } else if (!this.validator.validateEmail(formData.email)) {
            isValid = this.validator.showError('email', 'Email inválido');
        }
        
        // Telefone principal
        if (!formData.phone1.trim()) {
            isValid = this.validator.showError('phone1', 'Telefone principal é obrigatório');
        } else if (!this.validator.validatePhone(formData.phone1)) {
            isValid = this.validator.showError('phone1', 'Telefone inválido (formato: (00) 00000-0000)');
        }
        
        // Telefone secundário (opcional, mas se preenchido deve ser válido)
        if (formData.phone2 && !this.validator.validatePhone(formData.phone2)) {
            isValid = this.validator.showError('phone2', 'Telefone inválido (formato: (00) 00000-0000)');
        }
        
        return isValid;
    }
    
    collectFormData() {
        const form = document.getElementById('shipmentForm');
        const formData = new FormData(form);
        
        return {
            trackingCode: formData.get('trackingCode'),
            recipientName: formData.get('recipientName'),
            corporateRecipient: formData.get('corporateRecipient'),
            zipCode: formData.get('zipCode'),
            purchaseDate: formData.get('purchaseDate'),
            carrier: formData.get('carrier'),
            cnpj: formData.get('cnpj'),
            email: formData.get('email'),
            phone1: formData.get('phone1'),
            phone2: formData.get('phone2'),
            notes: formData.get('notes')
        };
    }
    
    async handleSubmit() {
        if (isSubmitting) return;
        
        const formData = this.collectFormData();
        
        // Validar formulário
        if (!this.validateForm(formData)) {
            showAlert('Por favor, corrija os erros no formulário.', 'error');
            return;
        }
        
        // Verificar se código de rastreamento já existe
        if (this.trackingCodeExists(formData.trackingCode)) {
            this.validator.showError('trackingCode', 'Este código de rastreamento já existe');
            showAlert('Código de rastreamento já existe. Gere um novo código.', 'error');
            return;
        }
        
        // Iniciar submissão
        this.setSubmittingState(true);
        
        try {
            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Criar objeto do envio
            const shipment = {
                id: nextShipmentId++,
                userId: currentUser.id,
                userInfo: {
                    id: currentUser.id,
                    name: `${currentUser.firstName} ${currentUser.lastName}`,
                    email: currentUser.email
                },
                ...formData,
                status: 'Cadastrado',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                file: this.fileManager.getFile() ? {
                    name: this.fileManager.getFile().name,
                    size: this.fileManager.getFile().size,
                    type: this.fileManager.getFile().type,
                    // Em produção, aqui seria a URL do arquivo salvo
                    url: null
                } : null
            };
            
            // Salvar envio
            this.saveShipment(shipment);
            
            // Sucesso
            showAlert(`Envio cadastrado com sucesso! ID: ${shipment.id}`, 'success');
            this.clearForm();
            this.generateTrackingCode();
            
            console.log('✅ Envio cadastrado:', shipment);
            
        } catch (error) {
            console.error('Erro ao cadastrar envio:', error);
            showAlert('Erro ao cadastrar envio. Tente novamente.', 'error');
        } finally {
            this.setSubmittingState(false);
        }
    }
    
    trackingCodeExists(trackingCode) {
        // Verificar em todos os envios salvos
        const savedShipments = localStorage.getItem('nexustrack_shipments');
        if (savedShipments) {
            try {
                const allShipments = JSON.parse(savedShipments);
                return allShipments.some(s => s.trackingCode === trackingCode);
            } catch (error) {
                console.error('Erro ao verificar código de rastreamento:', error);
            }
        }
        return false;
    }
    
    saveShipment(shipment) {
        // Adicionar ao array local
        shipments.push(shipment);
        
        // Salvar no localStorage
        const savedShipments = localStorage.getItem('nexustrack_shipments');
        let allShipments = [];
        
        if (savedShipments) {
            try {
                allShipments = JSON.parse(savedShipments);
            } catch (error) {
                console.error('Erro ao carregar envios salvos:', error);
            }
        }
        
        allShipments.push(shipment);
        localStorage.setItem('nexustrack_shipments', JSON.stringify(allShipments));
        
        // Atualizar estatísticas
        updateShipmentStats();
    }
    
    setSubmittingState(submitting) {
        isSubmitting = submitting;
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const submitLoader = document.getElementById('submitLoader');
        
        if (submitting) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            submitText.textContent = 'Cadastrando...';
            submitLoader.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            submitText.textContent = '📦 Cadastrar Envio';
            submitLoader.classList.add('hidden');
        }
    }
    
    clearForm() {
        const form = document.getElementById('shipmentForm');
        form.reset();
        this.fileManager.removeFile();
        this.validator.clearAllErrors();
        
        // Resetar contador de caracteres
        const notesCount = document.getElementById('notesCount');
        if (notesCount) {
            notesCount.textContent = '0';
        }
        
        showAlert('Formulário limpo com sucesso.', 'success', 2000);
    }
}

// ===========================================
// 8. GERENCIAMENTO DO SIDEBAR
// ===========================================

/**
 * Gerencia o sidebar responsivo
 */
class SidebarManager {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.setupToggle();
        this.setupResponsive();
    }
    
    setupToggle() {
        const toggleBtn = document.getElementById('sidebarToggle');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }
    
    setupResponsive() {
        // Fechar sidebar ao clicar fora em mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!this.sidebar.contains(e.target) && 
                    !document.getElementById('sidebarToggle').contains(e.target) &&
                    this.sidebar.classList.contains('open')) {
                    this.closeSidebar();
                }
            }
        });
        
        // Ajustar sidebar no resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                this.sidebar.classList.remove('open');
                this.removeOverlay();
            }
        });
    }
    
    toggleSidebar() {
        if (window.innerWidth <= 1024) {
            this.sidebar.classList.toggle('open');
            if (this.sidebar.classList.contains('open')) {
                this.createOverlay();
            } else {
                this.removeOverlay();
            }
        }
    }
    
    closeSidebar() {
        this.sidebar.classList.remove('open');
        this.removeOverlay();
    }
    
    createOverlay() {
        if (!document.querySelector('.sidebar-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.addEventListener('click', () => this.closeSidebar());
            document.body.appendChild(overlay);
        }
    }
    
    removeOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('loggedInUser');
            showAlert('Logout realizado com sucesso!', 'success', 2000);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }
}

// ===========================================
// 9. DETECÇÃO DE TEMA
// ===========================================

/**
 * Gerencia detecção automática de tema
 */
function initThemeDetection() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
}

// ===========================================
// 10. INICIALIZAÇÃO
// ===========================================

/**
 * Inicializa toda a aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 NexusTrack - Cadastro de Envios inicializando...');
    
    // Verificar autenticação
    checkAuthenticatedUser();
    
    // Inicializar componentes
    initThemeDetection();
    const sidebarManager = new SidebarManager();
    const shipmentManager = new ShipmentManager();
    
    // Configurar data máxima (hoje)
    const purchaseDateInput = document.getElementById('purchaseDate');
    if (purchaseDateInput) {
        const today = new Date().toISOString().split('T')[0];
        purchaseDateInput.setAttribute('max', today);
    }
    
    console.log('✅ Sistema inicializado com sucesso!');
    showAlert('Sistema carregado com sucesso!', 'success', 3000);
});

// ===========================================
// 11. COMANDOS DE CONSOLE PARA DEBUG
// ===========================================

// Disponibilizar funções globais para debug
window.nexusDebug = {
    getCurrentUser: () => currentUser,
    getShipments: () => shipments,
    clearAllShipments: () => {
        localStorage.removeItem('nexustrack_shipments');
        shipments = [];
        updateShipmentStats();
        console.log('🗑️ Todos os envios foram removidos');
    },
    generateTestShipment: () => {
        const testData = {
            trackingCode: `TEST-${Date.now()}`,
            recipientName: 'João da Silva',
            corporateRecipient: 'Empresa Teste LTDA',
            zipCode: '01234-567',
            purchaseDate: '2024-12-01',
            carrier: 'Transportadora Teste',
            cnpj: '12.345.678/0001-90',
            email: 'teste@exemplo.com',
            phone1: '(11) 99999-9999',
            phone2: '(11) 88888-8888',
            notes: 'Envio de teste gerado automaticamente'
        };
        
        console.log('🧪 Dados de teste gerados:', testData);
        return testData;
    }
};

console.log(`
🧪 ========================================
   COMANDOS DE DEBUG DISPONÍVEIS
========================================

• nexusDebug.getCurrentUser()
• nexusDebug.getShipments()
• nexusDebug.clearAllShipments()
• nexusDebug.generateTestShipment()

========================================
`);
/**
 * ===========================================
 * JAVASCRIPT PARA O MENU LATERAL COMPLETO - NEXUSTRACK
 * ===========================================
 * 
 * Sistema completo de navegação com:
 * - Navegação inteligente
 * - Popup de perfil interativo
 * - Permissões por role
 * - Responsividade total
 * - Integração com sistema de usuários
 */

'use strict';

/**
 * Classe principal do sidebar
 */
class NexusSidebar {
    constructor(toggleBtnId = 'sidebarToggle', currentPage = null) {
        // Elementos DOM
        this.sidebar = document.getElementById('sidebar');
        this.toggleBtn = document.getElementById(toggleBtnId);
        this.overlay = document.getElementById('sidebarOverlay');
        this.profileTrigger = document.getElementById('profileTrigger');
        this.profilePopup = document.getElementById('profilePopup');
        this.currentPage = currentPage;
        
        // Estado
        this.currentUser = null;
        this.isProfileOpen = false;
        
        // Inicializar
        this.init();
    }
    
    /**
     * Inicializa o sidebar
     */
    init() {
        if (!this.sidebar) {
            console.error('❌ Sidebar não encontrado');
            return;
        }
        
        // Carregar usuário atual
        this.loadCurrentUser();
        
        // Configurar eventos
        this.setupEvents();
        
        // Configurar responsividade
        this.setupResponsive();
        
        // Marcar página ativa
        this.setActivePage();
        
        // Configurar permissões
        this.setupPermissions();
        
        // Atualizar estatísticas
        this.updateUserStats();
        
        console.log('✅ NexusSidebar inicializado');
    }
    
    /**
     * Carrega dados do usuário atual
     */
    loadCurrentUser() {
        const loggedUser = localStorage.getItem('loggedInUser');
        
        if (loggedUser) {
            try {
                this.currentUser = JSON.parse(loggedUser);
                this.updateUserInterface();
            } catch (error) {
                console.error('❌ Erro ao carregar usuário:', error);
                this.redirectToLogin();
            }
        } else {
            this.redirectToLogin();
        }
    }
    
    /**
     * Atualiza interface com dados do usuário
     */
    updateUserInterface() {
        if (!this.currentUser) return;
        
        // Iniciais do usuário
        const initials = (this.currentUser.firstName.charAt(0) + this.currentUser.lastName.charAt(0)).toUpperCase();
        document.getElementById('userInitials').textContent = initials;
        
        // Nome do usuário
        const fullName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('userName').textContent = fullName;
        
        // Role do usuário
        const roleConfig = this.getRoleConfig(this.currentUser.role);
        document.getElementById('userRole').innerHTML = `<span>${roleConfig.icon} ${roleConfig.label}</span>`;
        
        // Popup de perfil
        document.getElementById('popupUserName').textContent = fullName;
        document.getElementById('popupUserEmail').textContent = this.currentUser.email;
        
        // Data de criação
        if (this.currentUser.createdAt) {
            const memberSince = new Date(this.currentUser.createdAt).getFullYear();
            document.getElementById('userMemberSince').textContent = memberSince;
        }
        
        // Último login
        if (this.currentUser.lastLogin) {
            const lastLogin = new Date(this.currentUser.lastLogin).toLocaleDateString('pt-BR');
            document.getElementById('userLastLogin').textContent = lastLogin;
        } else {
            document.getElementById('userLastLogin').textContent = 'Primeiro acesso';
        }
    }
    
    /**
     * Configuração de roles
     */
    getRoleConfig(role) {
        const configs = {
            'admin': { icon: '👑', label: 'Administrador' },
            'manager': { icon: '👔', label: 'Gerente' },
            'user': { icon: '👤', label: 'Usuário' }
        };
        return configs[role] || configs['user'];
    }
    
    /**
     * Configura eventos
     */
    setupEvents() {
        // Toggle sidebar
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }
        
        // Overlay para fechar sidebar
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        // Toggle perfil
        if (this.profileTrigger) {
            this.profileTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleProfile();
            });
        }
        
        // Fechar popup ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.profilePopup?.contains(e.target) && !this.profileTrigger?.contains(e.target)) {
                this.closeProfile();
            }
        });
        
        // ESC para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
                this.closeProfile();
            }
        });
    }
    
    /**
     * Configurar responsividade
     */
    setupResponsive() {
        // Verificar tamanho inicial
        this.checkScreenSize();
        
        // Listener para resize
        window.addEventListener('resize', () => this.checkScreenSize());
    }
    
    /**
     * Verifica tamanho da tela
     */
    checkScreenSize() {
        if (window.innerWidth <= 1024) {
            this.sidebar?.classList.add('hidden');
        } else {
            this.sidebar?.classList.remove('hidden');
            this.overlay?.classList.remove('active');
        }
    }
    
    /**
     * Abre sidebar
     */
    open() {
        this.sidebar?.classList.remove('hidden');
        this.sidebar?.classList.add('open');
        if (window.innerWidth <= 1024) {
            this.overlay?.classList.add('active');
        }
    }
    
    /**
     * Fecha sidebar
     */
    close() {
        this.sidebar?.classList.add('hidden');
        this.sidebar?.classList.remove('open');
        this.overlay?.classList.remove('active');
    }
    
    /**
     * Toggle sidebar
     */
    toggle() {
        if (this.sidebar?.classList.contains('hidden')) {
            this.open();
        } else {
            this.close();
        }
    }
    
    /**
     * Toggle popup de perfil
     */
    toggleProfile() {
        if (this.isProfileOpen) {
            this.closeProfile();
        } else {
            this.openProfile();
        }
    }
    
    /**
     * Abre popup de perfil
     */
    openProfile() {
        this.profilePopup?.classList.add('show');
        this.profileTrigger?.classList.add('open');
        this.isProfileOpen = true;
    }
    
    /**
     * Fecha popup de perfil
     */
    closeProfile() {
        this.profilePopup?.classList.remove('show');
        this.profileTrigger?.classList.remove('open');
        this.isProfileOpen = false;
    }
    
    /**
     * Define página ativa
     */
    setActivePage() {
        if (!this.currentPage) return;
        
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            if (item.dataset.page === this.currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    /**
     * Configura permissões baseado no role
     */
    setupPermissions() {
        if (!this.currentUser) return;
        
        const isAdmin = this.currentUser.role === 'admin';
        
        // Seção de administração
        const adminSection = document.getElementById('adminSection');
        if (adminSection) {
            adminSection.style.display = isAdmin ? 'block' : 'none';
        }
        
        // Menu de usuários
        const usersMenuItem = document.getElementById('usersMenuItem');
        if (usersMenuItem) {
            usersMenuItem.style.display = isAdmin ? 'flex' : 'none';
        }
    }
    
    /**
     * Atualiza estatísticas do usuário
     */
    updateUserStats() {
        if (!this.currentUser) return;
        
        // Contar envios do usuário
        const savedShipments = localStorage.getItem('nexustrack_shipments');
        let userShipmentsCount = 0;
        
        if (savedShipments) {
            try {
                const allShipments = JSON.parse(savedShipments);
                userShipmentsCount = allShipments.filter(s => s.userId === this.currentUser.id).length;
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            }
        }
        
        document.getElementById('userShipmentsCount').textContent = userShipmentsCount;
        
        // Badge de novos usuários (apenas para admin)
        if (this.currentUser.role === 'admin') {
            this.updateNewUsersBadge();
        }
    }
    
    /**
     * Atualiza badge de novos usuários
     */
    updateNewUsersBadge() {
        try {
            // Lógica para contar novos usuários (últimos 7 dias)
            const users = JSON.parse(localStorage.getItem('nexustrack_users') || '[]');
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            
            const newUsers = users.filter(user => {
                if (!user.createdAt) return false;
                return new Date(user.createdAt) > weekAgo;
            });
            
            const badge = document.getElementById('newUsersBadge');
            if (badge) {
                if (newUsers.length > 0) {
                    badge.textContent = newUsers.length;
                    badge.style.display = 'inline';
                } else {
                    badge.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Erro ao atualizar badge:', error);
        }
    }
    
    /**
     * Redireciona para login
     */
    redirectToLogin() {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ===========================================
// FUNÇÕES GLOBAIS DO PERFIL
// ===========================================

/**
 * Editar perfil
 */
function editProfile() {
    // Implementar modal de edição ou redirecionar
    console.log('🔧 Editar perfil - em desenvolvimento');
    alert('Funcionalidade de edição de perfil em desenvolvimento!');
}

/**
 * Ver perfil completo
 */
function viewProfile() {
    window.location.href = 'perfil.html';
}

/**
 * Alternar tema
 */
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    
    if (isDark) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
    
    // Feedback visual
    const message = isDark ? 'Tema claro ativado' : 'Tema escuro ativado';
    showNotification(message);
}

/**
 * Logout
 */
function handleLogout() {
    if (confirm('Tem certeza que deseja sair da sua conta?')) {
        // Limpar dados
        localStorage.removeItem('loggedInUser');
        
        // Feedback
        showNotification('Saindo da conta...', 'info');
        
        // Redirecionar
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

/**
 * Mostrar notificação
 */
function showNotification(message, type = 'success') {
    // Criar notificação temporária
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white text-sm transition-all duration-300 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.textContent = message;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===========================================
// DETECÇÃO DE TEMA INICIAL
// ===========================================

/**
 * Configura tema inicial
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
    
    // Listener para mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    });
}

// ===========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ===========================================

// Inicializar tema
initTheme();

// Exportar para uso global
window.NexusSidebar = NexusSidebar;

console.log(`
🚀 ========================================
   NEXUS SIDEBAR CARREGADO
========================================

Para usar:
const sidebar = new NexusSidebar('sidebarToggle', 'dashboard');

Funções globais:
• editProfile()
• viewProfile() 
• toggleTheme()
• handleLogout()

========================================
`);
/**
 * ===========================================
 * JAVASCRIPT PARA O MENU LATERAL - NEXUSTRACK
 * ===========================================
 * 
 * Este arquivo contém as funções necessárias para o funcionamento
 * do menu lateral em todas as páginas do sistema NexusTrack.
 * 
 * Inclua este arquivo JS em todas as páginas que utilizarem o menu.
 */

/**
 * Classe NexusSidebar para gerenciar o comportamento do menu lateral
 */
class NexusSidebar {
    /**
     * Inicializa o menu lateral
     * @param {string} toggleBtnId - ID do botão que controla a visibilidade do menu
     * @param {string} currentPage - Identificador da página atual
     */
    constructor(toggleBtnId = 'sidebarToggle', currentPage = null) {
        // Elementos DOM
        this.sidebar = document.getElementById('sidebar');
        this.toggleBtn = document.getElementById(toggleBtnId);
        this.currentPage = currentPage;
        
        // Criar overlay para telas menores
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        document.body.appendChild(this.overlay);
        
        // Inicializar o menu
        this.init();
    }
    
    /**
     * Inicializa os eventos e comportamentos do menu
     */
    init() {
        if (!this.sidebar || !this.toggleBtn) {
            console.error('Elementos do menu não encontrados. Verifique os IDs.');
            return;
        }
        
        // Configurar visibilidade inicial com base no tamanho da tela
        this.checkScreenSize();
        
        // Configurar evento de redimensionamento
        window.addEventListener('resize', () => this.checkScreenSize());
        
        // Configurar evento de clique no botão toggle
        this.toggleBtn.addEventListener('click', () => this.toggleSidebar());
        
        // Configurar evento de clique no overlay
        this.overlay.addEventListener('click', () => this.hideSidebar());
        
        // Marcar item atual do menu como ativo
        this.setActiveMenuItem();
        
        // Configurar evento de logout
        const logoutBtn = document.getElementById('logoutButton');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }
    
    /**
     * Verifica o tamanho da tela e ajusta o menu
     */
    checkScreenSize() {
        if (window.innerWidth < 768) {
            // Em telas menores, o menu começa oculto
            this.sidebar.classList.add('hidden');
        } else {
            // Em telas maiores, o menu começa visível
            this.sidebar.classList.remove('hidden');
            this.overlay.classList.remove('active');
        }
    }
    
    /**
     * Alterna a visibilidade do menu lateral
     */
    toggleSidebar() {
        this.sidebar.classList.toggle('hidden');
        
        if (window.innerWidth < 768) {
            this.overlay.classList.toggle('active');
        }
    }
    
    /**
     * Esconde o menu lateral
     */
    hideSidebar() {
        this.sidebar.classList.add('hidden');
        this.overlay.classList.remove('active');
    }
    
    /**
     * Define o item ativo no menu com base na página atual
     */
    setActiveMenuItem() {
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
     * Trata o evento de logout
     */
    handleLogout() {
        // Em uma implementação real, você faria uma chamada para encerrar a sessão
        // Por enquanto, apenas redirecionamos para a página de login
        window.location.href = 'login.html';
    }
}

/**
 * Exemplo de uso:
 * 
 * Inclua este arquivo na sua página e inicialize o menu:
 * 
 * document.addEventListener('DOMContentLoaded', function() {
 *     // Inicializa o menu informando a página atual
 *     const sidebar = new NexusSidebar('sidebarToggle', 'lista-envios');
 * });
 */
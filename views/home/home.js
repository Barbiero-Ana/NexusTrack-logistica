/**
 * ===========================================
 * JAVASCRIPT PARA O DASHBOARD
 * ===========================================
 * 
 * Este arquivo contém toda a lógica para:
 * 1. Detecção de tema (claro/escuro)
 * 2. Controle do menu lateral
 * 3. Expansão/contração dos cards de envio
 * 4. Filtros e pesquisa de envios
 */

// Detecção e configuração de tema (claro/escuro)
function configureTheme() {
    // Verifica se o usuário prefere o tema escuro
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }
    
    // Escuta por mudanças na preferência de tema do usuário
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
}

/**
 * Controla a exibição do menu lateral
 * Ajusta o comportamento para diferentes tamanhos de tela
 */
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    // Cria um overlay para telas menores
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Função para verificar o tamanho da tela e ajustar o sidebar
    function checkScreenSize() {
        if (window.innerWidth < 768) {
            // Em telas menores, o sidebar começa oculto
            sidebar.classList.add('hidden');
        } else {
            // Em telas maiores, o sidebar começa visível
            sidebar.classList.remove('hidden');
        }
    }
    
    // Verifica o tamanho inicial da tela
    checkScreenSize();
    
    // Monitorar mudanças no tamanho da tela
    window.addEventListener('resize', checkScreenSize);
    
    // Toggle do sidebar ao clicar no botão
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        
        if (window.innerWidth < 768) {
            overlay.classList.toggle('active');
        }
    });
    
    // Fechar o sidebar ao clicar no overlay
    overlay.addEventListener('click', () => {
        sidebar.classList.add('hidden');
        overlay.classList.remove('active');
    });
}

/**
 * Configura a expansão e contração dos cards de envio
 * Permite ver os detalhes completos de cada envio
 */
function setupShipmentCards() {
    const shipmentCards = document.querySelectorAll('.shipment-card');
    
    shipmentCards.forEach(card => {
        const header = card.querySelector('.shipment-header');
        const details = card.querySelectorAll('.shipment-details');
        
        header.addEventListener('click', () => {
            // Alterna a classe 'expanded' para expandir/contrair o card
            card.classList.toggle('expanded');
            
            // Alterna a visibilidade dos detalhes
            details.forEach(detail => {
                if (card.classList.contains('expanded')) {
                    detail.classList.remove('hidden');
                } else {
                    detail.classList.add('hidden');
                }
            });
        });
    });
}

/**
 * Configuração do sistema de busca e filtros
 * Permite pesquisar e filtrar os envios por diferentes critérios
 */
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const timeFilter = document.getElementById('timeFilter');
    const shipmentCards = document.querySelectorAll('.shipment-card');
    
    /**
     * Função auxiliar para verificar se um envio corresponde aos critérios de busca
     * @param {HTMLElement} card - O card de envio a ser verificado
     * @param {string} searchTerm - Termo de busca
     * @param {string} status - Filtro de status
     * @param {string} time - Filtro de período
     * @returns {boolean} - Se o envio corresponde aos critérios
     */
    function matchesFilter(card, searchTerm, status, time) {
        // Implementação simplificada para exemplo
        // Em uma implementação real, cada filtro seria mais detalhado
        
        // Busca por texto
        const cardText = card.textContent.toLowerCase();
        if (searchTerm && !cardText.includes(searchTerm.toLowerCase())) {
            return false;
        }
        
        // Filtro de status
        if (status) {
            const cardStatus = card.querySelector('.shipment-header span').textContent.trim().toLowerCase();
            if (!cardStatus.includes(status.toLowerCase())) {
                return false;
            }
        }
        
        // Filtro de tempo (simplificado)
        // Em uma implementação real, seria necessário comparar datas
        if (time) {
            // Exemplo: Se for "hoje", verificaria se a data no card é hoje
            // Aqui apenas simulamos o comportamento
            if (time === 'hoje' && !card.textContent.includes('21/04/2023')) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Aplica os filtros e mostra/esconde os cards conforme os critérios
     */
    function applyFilters() {
        const searchTerm = searchInput.value;
        const status = statusFilter.value;
        const time = timeFilter.value;
        
        shipmentCards.forEach(card => {
            if (matchesFilter(card, searchTerm, status, time)) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }
    
    // Eventos para aplicar filtros
    searchInput.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    timeFilter.addEventListener('change', applyFilters);
}

/**
 * Inicialização de todas as funcionalidades quando o documento estiver pronto
 */
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do tema
    configureTheme();
    
    // Configuração do sidebar
    setupSidebar();
    
    // Configuração dos cards de envio
    setupShipmentCards();
    
    // Configuração do sistema de busca
    setupSearch();
});
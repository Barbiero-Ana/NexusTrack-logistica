/**
 * ===========================================
 * NEXUSTRACK - DASHBOARD
 * ===========================================
 * 
 * Sistema completo de dashboard com:
 * - Listagem de envios por usuário/admin
 * - Estatísticas em tempo real
 * - Filtros e pesquisa
 * - Interface responsiva
 * - Integração com sistema de usuários
 */

'use strict';

// ===========================================
// 1. VARIÁVEIS GLOBAIS E CONFIGURAÇÃO
// ===========================================

let currentUser = null;
let allShipments = [];
let displayedShipments = [];
let isAdmin = false;

// ===========================================
// 2. GERENCIAMENTO DE USUÁRIO LOGADO
// ===========================================

/**
 * Verifica se há usuário logado e carrega dados
 */
function checkAuthenticatedUser() {
    const loggedUser = localStorage.getItem('loggedInUser');
    
    if (loggedUser) {
        try {
            currentUser = JSON.parse(loggedUser);
            isAdmin = currentUser.role === 'admin';
            updateUserInterface();
            loadShipments();
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
    const userRole = document.getElementById('userRole');
    const viewMode = document.getElementById('viewMode');
    
    if (userInitials) {
        userInitials.textContent = (currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)).toUpperCase();
    }
    
    if (userName) {
        userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
    
    if (userId) {
        userId.textContent = currentUser.id || '-';
    }
    
    if (userRole) {
        const roleText = {
            'admin': '👑 Admin',
            'manager': '👔 Gerente',
            'user': '👤 Usuário'
        };
        userRole.textContent = roleText[currentUser.role] || currentUser.role;
    }
    
    if (viewMode) {
        viewMode.textContent = isAdmin ? 'Todos os envios' : 'Meus envios';
    }
    
    // Atualizar mensagem do estado vazio
    const emptyStateMessage = document.getElementById('emptyStateMessage');
    if (emptyStateMessage) {
        emptyStateMessage.textContent = isAdmin 
            ? 'Nenhum envio foi cadastrado no sistema ainda.'
            : 'Você ainda não possui envios cadastrados.';
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
// 3. CARREGAMENTO DE DADOS
// ===========================================

/**
 * Carrega todos os envios baseado no usuário
 */
function loadShipments() {
    showLoading(true);
    
    setTimeout(() => {
        const savedShipments = localStorage.getItem('nexustrack_shipments');
        
        if (savedShipments) {
            try {
                const allSystemShipments = JSON.parse(savedShipments);
                
                // Se for admin, mostra todos; se for usuário comum, filtra pelos seus
                if (isAdmin) {
                    allShipments = allSystemShipments;
                } else {
                    allShipments = allSystemShipments.filter(shipment => shipment.userId === currentUser.id);
                }
                
                displayedShipments = [...allShipments];
                
                console.log(`📦 ${allShipments.length} envios carregados para ${isAdmin ? 'admin' : 'usuário ' + currentUser.id}`);
                
            } catch (error) {
                console.error('Erro ao carregar envios:', error);
                allShipments = [];
                displayedShipments = [];
                showAlert('Erro ao carregar envios.', 'error');
            }
        } else {
            allShipments = [];
            displayedShipments = [];
        }
        
        showLoading(false);
        renderShipments();
        updateStatistics();
        
    }, 800); // Simula carregamento
}

/**
 * Mostra/esconde loading
 */
function showLoading(show) {
    const loadingContainer = document.getElementById('loadingContainer');
    const shipmentsContainer = document.getElementById('shipmentsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (show) {
        loadingContainer.classList.remove('hidden');
        shipmentsContainer.classList.add('hidden');
        emptyState.classList.add('hidden');
    } else {
        loadingContainer.classList.add('hidden');
        shipmentsContainer.classList.remove('hidden');
    }
}

// ===========================================
// 4. RENDERIZAÇÃO DOS ENVIOS
// ===========================================

/**
 * Renderiza a lista de envios
 */
function renderShipments() {
    const container = document.getElementById('shipmentsContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (displayedShipments.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    container.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    // Ordenar por data de criação (mais recentes primeiro)
    const sortedShipments = displayedShipments.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    container.innerHTML = sortedShipments.map(shipment => createShipmentCard(shipment)).join('');
    
    // Adicionar event listeners para expansão dos cards
    setupCardExpansion();
}

/**
 * Cria o HTML de um card de envio
 */
function createShipmentCard(shipment) {
    const statusConfig = getStatusConfig(shipment.status);
    const createdDate = new Date(shipment.createdAt).toLocaleString('pt-BR');
    const purchaseDate = new Date(shipment.purchaseDate).toLocaleDateString('pt-BR');
    
    return `
        <div class="shipment-card" data-shipment-id="${shipment.id}">
            <!-- Cabeçalho do card -->
            <div class="shipment-header flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 rounded-full ${statusConfig.bgColor} flex items-center justify-center">
                        ${statusConfig.icon}
                    </div>
                    <div>
                        <h3 class="font-semibold">${shipment.trackingCode}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            ${isAdmin ? `Por: ${shipment.userInfo?.name || 'Usuário'} | ` : ''}Criado em ${createdDate}
                        </p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="status-badge status-${statusConfig.class}">
                        ${shipment.status}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 shipment-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <!-- Detalhes do envio -->
            <div class="shipment-details">
                <!-- Informações básicas -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">📦 Informações do Envio</h4>
                        <div class="space-y-2">
                            <div><span class="font-medium">Destinatário:</span> ${shipment.recipientName}</div>
                            ${shipment.corporateRecipient ? `<div><span class="font-medium">Empresa:</span> ${shipment.corporateRecipient}</div>` : ''}
                            <div><span class="font-medium">CEP:</span> ${shipment.zipCode}</div>
                            <div><span class="font-medium">Data da Compra:</span> ${purchaseDate}</div>
                        </div>
                    </div>
                    
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">🚚 Transportadora</h4>
                        <div class="space-y-2">
                            <div><span class="font-medium">Nome:</span> ${shipment.carrier}</div>
                            ${shipment.cnpj ? `<div><span class="font-medium">CNPJ:</span> ${shipment.cnpj}</div>` : ''}
                            <div><span class="font-medium">Email:</span> ${shipment.email}</div>
                            <div><span class="font-medium">Telefone:</span> ${shipment.phone1}</div>
                            ${shipment.phone2 ? `<div><span class="font-medium">Telefone 2:</span> ${shipment.phone2}</div>` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- Timeline de progresso -->
                <div class="mb-6">
                    <h4 class="font-medium mb-4">📍 Progresso do Envio</h4>
                    <div class="progress-timeline">
                        ${createProgressTimeline(shipment.status)}
                    </div>
                </div>
                
                <!-- Observações -->
                ${shipment.notes ? `
                    <div class="mb-6">
                        <h4 class="font-medium mb-2">💭 Observações</h4>
                        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <p class="text-sm">${shipment.notes}</p>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Arquivo anexado -->
                ${shipment.file ? `
                    <div class="mb-6">
                        <h4 class="font-medium mb-2">📋 Documento Anexado</h4>
                        <div class="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span class="text-sm">${shipment.file.name}</span>
                            <span class="text-xs text-gray-500">(${formatFileSize(shipment.file.size)})</span>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Ações -->
                <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button onclick="updateShipmentStatus(${shipment.id})" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                        📝 Atualizar Status
                    </button>
                    <button onclick="viewShipmentDetails(${shipment.id})" class="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm">
                        👁️ Ver Detalhes
                    </button>
                    ${isAdmin ? `
                        <button onclick="editShipment(${shipment.id})" class="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition-colors text-sm">
                            ✏️ Editar
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * Configuração de status
 */
function getStatusConfig(status) {
    const configs = {
        'Cadastrado': {
            class: 'cadastrado',
            bgColor: 'bg-blue-100 dark:bg-blue-900',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>`
        },
        'Em Processamento': {
            class: 'processamento',
            bgColor: 'bg-yellow-100 dark:bg-yellow-900',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>`
        },
        'Em Trânsito': {
            class: 'transito',
            bgColor: 'bg-blue-100 dark:bg-blue-900',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>`
        },
        'Entregue': {
            class: 'entregue',
            bgColor: 'bg-green-100 dark:bg-green-900',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>`
        },
        'Cancelado': {
            class: 'cancelado',
            bgColor: 'bg-red-100 dark:bg-red-900',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>`
        }
    };
    
    return configs[status] || configs['Cadastrado'];
}

/**
 * Cria timeline de progresso
 */
function createProgressTimeline(currentStatus) {
    const steps = [
        { status: 'Cadastrado', label: 'Pedido Cadastrado', icon: '📝' },
        { status: 'Em Processamento', label: 'Em Processamento', icon: '⚙️' },
        { status: 'Em Trânsito', label: 'Em Trânsito', icon: '🚚' },
        { status: 'Entregue', label: 'Entregue', icon: '✅' }
    ];
    
    if (currentStatus === 'Cancelado') {
        return `
            <div class="progress-step">
                <div class="progress-icon bg-red-500">
                    <span class="text-white">❌</span>
                </div>
                <div class="progress-content">
                    <h5 class="font-medium text-red-600">Envio Cancelado</h5>
                    <p class="text-sm text-gray-500">O envio foi cancelado</p>
                </div>
            </div>
        `;
    }
    
    const currentIndex = steps.findIndex(step => step.status === currentStatus);
    
    return steps.map((step, index) => {
        let statusClass = 'pending';
        if (index <= currentIndex) {
            statusClass = index === currentIndex ? 'current' : 'completed';
        }
        
        return `
            <div class="progress-step">
                <div class="progress-icon ${statusClass}">
                    <span class="text-white text-sm">${step.icon}</span>
                </div>
                <div class="progress-content">
                    <h5 class="font-medium">${step.label}</h5>
                    <p class="text-sm text-gray-500">${index <= currentIndex ? 'Concluído' : 'Pendente'}</p>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Formata tamanho de arquivo
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===========================================
// 5. ESTATÍSTICAS
// ===========================================

/**
 * Atualiza estatísticas
 */
function updateStatistics() {
    const stats = calculateStats(allShipments);
    
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statPending').textContent = stats.pending;
    document.getElementById('statInTransit').textContent = stats.inTransit;
    document.getElementById('statDelivered').textContent = stats.delivered;
    document.getElementById('totalShipments').textContent = stats.total;
}

/**
 * Calcula estatísticas
 */
function calculateStats(shipments) {
    return {
        total: shipments.length,
        pending: shipments.filter(s => s.status === 'Cadastrado' || s.status === 'Em Processamento').length,
        inTransit: shipments.filter(s => s.status === 'Em Trânsito').length,
        delivered: shipments.filter(s => s.status === 'Entregue').length,
        cancelled: shipments.filter(s => s.status === 'Cancelado').length
    };
}

// ===========================================
// 6. SISTEMA DE FILTROS E PESQUISA
// ===========================================

/**
 * Configura sistema de filtros
 */
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const timeFilter = document.getElementById('timeFilter');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Event listeners
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    statusFilter.addEventListener('change', applyFilters);
    timeFilter.addEventListener('change', applyFilters);
    refreshBtn.addEventListener('click', refreshData);
}

/**
 * Aplica filtros
 */
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const timeFilter = document.getElementById('timeFilter').value;
    
    displayedShipments = allShipments.filter(shipment => {
        // Filtro de pesquisa
        if (searchTerm) {
            const searchableText = `
                ${shipment.trackingCode}
                ${shipment.recipientName}
                ${shipment.corporateRecipient || ''}
                ${shipment.carrier}
                ${shipment.email}
            `.toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        // Filtro de status
        if (statusFilter && shipment.status !== statusFilter) {
            return false;
        }
        
        // Filtro de tempo
        if (timeFilter) {
            const shipmentDate = new Date(shipment.createdAt);
            const now = new Date();
            
            switch (timeFilter) {
                case 'hoje':
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    if (shipmentDate < today) return false;
                    break;
                case 'semana':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    if (shipmentDate < weekAgo) return false;
                    break;
                case 'mes':
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    if (shipmentDate < monthAgo) return false;
                    break;
            }
        }
        
        return true;
    });
    
    renderShipments();
    updateStatistics();
}

/**
 * Debounce function para otimizar pesquisa
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Atualiza dados
 */
function refreshData() {
    showAlert('Atualizando dados...', 'info', 2000);
    loadShipments();
}

// ===========================================
// 7. INTERAÇÕES DOS CARDS
// ===========================================

/**
 * Configura expansão dos cards
 */
function setupCardExpansion() {
    const cards = document.querySelectorAll('.shipment-card');
    
    cards.forEach(card => {
        const header = card.querySelector('.shipment-header');
        
        header.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
}

// ===========================================
// 8. AÇÕES DOS ENVIOS
// ===========================================

/**
 * Atualiza status do envio
 */
function updateShipmentStatus(shipmentId) {
    const shipment = allShipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const newStatus = prompt('Novo status:', shipment.status);
    if (newStatus && newStatus !== shipment.status) {
        shipment.status = newStatus;
        shipment.updatedAt = new Date().toISOString();
        
        // Atualizar no localStorage
        updateShipmentInStorage(shipment);
        
        showAlert('Status atualizado com sucesso!', 'success');
        renderShipments();
        updateStatistics();
    }
}

/**
 * Ver detalhes do envio
 */
function viewShipmentDetails(shipmentId) {
    const shipment = allShipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const details = `
        Código: ${shipment.trackingCode}
        Destinatário: ${shipment.recipientName}
        Status: ${shipment.status}
        Criado em: ${new Date(shipment.createdAt).toLocaleString('pt-BR')}
        
        Deseja ir para a tela de rastreamento?
    `;
    
    if (confirm(details)) {
        // Redirecionar para tela de rastreamento
        window.location.href = `rastreamento.html?codigo=${shipment.trackingCode}`;
    }
}

/**
 * Editar envio (apenas admin)
 */
function editShipment(shipmentId) {
    if (!isAdmin) {
        showAlert('Apenas administradores podem editar envios.', 'error');
        return;
    }
    
    const shipment = allShipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    if (confirm('Deseja editar este envio?')) {
        // Redirecionar para tela de edição ou abrir modal
        showAlert('Funcionalidade de edição em desenvolvimento.', 'info');
    }
}

/**
 * Atualiza envio no storage
 */
function updateShipmentInStorage(updatedShipment) {
    const savedShipments = localStorage.getItem('nexustrack_shipments');
    if (savedShipments) {
        try {
            const allSystemShipments = JSON.parse(savedShipments);
            const index = allSystemShipments.findIndex(s => s.id === updatedShipment.id);
            if (index !== -1) {
                allSystemShipments[index] = updatedShipment;
                localStorage.setItem('nexustrack_shipments', JSON.stringify(allSystemShipments));
            }
        } catch (error) {
            console.error('Erro ao atualizar envio:', error);
        }
    }
}

// ===========================================
// 9. SISTEMA DE ALERTAS
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
// 10. GERENCIAMENTO DO SIDEBAR
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
// 11. DETECÇÃO DE TEMA
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
// 12. INICIALIZAÇÃO
// ===========================================

/**
 * Inicializa toda a aplicação
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 NexusTrack Dashboard inicializando...');
    
    // Verificar autenticação
    checkAuthenticatedUser();
    
    // Inicializar componentes
    initThemeDetection();
    const sidebarManager = new SidebarManager();
    setupFilters();
    
    console.log('✅ Dashboard inicializado com sucesso!');
    showAlert('Dashboard carregado com sucesso!', 'success', 3000);
});

// ===========================================
// 13. COMANDOS DE CONSOLE PARA DEBUG
// ===========================================

// Disponibilizar funções globais para debug
window.dashboardDebug = {
    getCurrentUser: () => currentUser,
    getAllShipments: () => allShipments,
    getDisplayedShipments: () => displayedShipments,
    isAdmin: () => isAdmin,
    refreshData: refreshData,
    clearFilters: () => {
        document.getElementById('searchInput').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('timeFilter').value = '';
        applyFilters();
    }
};

console.log(`
🧪 ========================================
   COMANDOS DE DEBUG DASHBOARD
========================================

• dashboardDebug.getCurrentUser()
• dashboardDebug.getAllShipments()
• dashboardDebug.getDisplayedShipments()
• dashboardDebug.isAdmin()
• dashboardDebug.refreshData()
• dashboardDebug.clearFilters()

========================================
`);
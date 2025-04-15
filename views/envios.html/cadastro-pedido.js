/**
 * NexusTrack - Script para a página de Cadastro de Pedidos
 * Este arquivo contém as funcionalidades específicas da página de cadastro.
 */

// Detectar preferência de tema (claro/escuro)
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

// Função para carregar o sidebar
function loadSidebar() {
    // Carregamos o HTML do sidebar via fetch e o inserimos na página
    fetch('/components/sidebar/sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o sidebar: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            
            // Após carregar o sidebar, definimos a página ativa
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                if (item.dataset.page === 'cadastro-pedido') {
                    item.classList.add('active');
                }
            });
            
            // Inicializamos o sidebar após carregá-lo
            if (typeof NexusSidebar !== 'undefined') {
                const sidebar = new NexusSidebar('sidebarToggle', 'cadastro-pedido');
            } else {
                console.error('NexusSidebar não está definido. Verifique se sidebar.js foi carregado corretamente.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar o sidebar:', error);
        });
}


// Quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Carregamos o sidebar
    loadSidebar();
    
    // Manipular o upload de arquivo
    const fileInput = document.getElementById('pdfUpload');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');
    
    fileInput.addEventListener('change', function(event) {
        if (this.files && this.files[0]) {
            fileName.textContent = this.files[0].name;
            filePreview.classList.remove('hidden');
        }
    });
    
    removeFile.addEventListener('click', function() {
        fileInput.value = '';
        filePreview.classList.add('hidden');
    });
    
    // Manipular o envio do formulário
    const shipmentForm = document.getElementById('shipmentForm');
    const clearFormBtn = document.getElementById('clearForm');
    const saveSuccess = document.getElementById('saveSuccess');
    
    shipmentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Simulação de envio de dados
        // Em um ambiente real, você enviaria os dados para o servidor
        
        // Mostrar mensagem de sucesso
        saveSuccess.classList.remove('hidden');
        saveSuccess.classList.add('fade-in-out');
        
        // Resetar formulário
        shipmentForm.reset();
        filePreview.classList.add('hidden');
        
        // Ocultar mensagem de sucesso após a animação
        setTimeout(() => {
            saveSuccess.classList.add('hidden');
            saveSuccess.classList.remove('fade-in-out');
        }, 3000);
        
        // Rolar para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Limpar formulário
    clearFormBtn.addEventListener('click', function() {
        shipmentForm.reset();
        filePreview.classList.add('hidden');
    });
    
    // Máscara simples para CEP
    const zipCodeInput = document.getElementById('zipCode');
    zipCodeInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5) + '-' + value.substring(5, 8);
        }
        this.value = value;
    });
    
    // Máscara simples para telefone
    const phoneInputs = [document.getElementById('phone1'), document.getElementById('phone2')];
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = '(' + value;
                if (value.length > 3) {
                    value = value.substring(0, 3) + ') ' + value.substring(3);
                }
                if (value.length > 9) {
                    value = value.substring(0, 9) + '-' + value.substring(9, 14);
                }
            }
            this.value = value;
        });
    });
    
    // Máscara simples para CNPJ
    const cnpjInput = document.getElementById('cnpj');
    cnpjInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        this.value = value;
    });
});
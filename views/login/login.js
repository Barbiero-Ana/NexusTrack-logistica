/**
 * ===========================================
 * JAVASCRIPT PARA A TELA DE LOGIN/CADASTRO
 * ===========================================
 * 
 * Este arquivo contém toda a lógica para:
 * 1. Detecção de tema (claro/escuro)
 * 2. Alternância entre formulários
 * 3. Validação de campos
 * 4. Tratamento de erros
 * 5. Feedback ao usuário
 */

// Ajusta a altura mínima do formulário com base no conteúdo
function adjustFormHeight() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const formContainer = document.getElementById('formContainer');
    const perspective = document.querySelector('.perspective');
    
    if (registerForm && loginForm && formContainer && perspective) {
        const registerHeight = registerForm.scrollHeight;
        const loginHeight = loginForm.scrollHeight;
        const maxHeight = Math.max(registerHeight, loginHeight) + 40; // adiciona algum padding
        
        formContainer.style.minHeight = maxHeight + 'px';
        perspective.style.minHeight = maxHeight + 'px';
    }
}

// Chama a função quando a página é carregada e quando a janela é redimensionada
window.addEventListener('load', adjustFormHeight);
window.addEventListener('resize', adjustFormHeight);

// Detecção de tema (claro/escuro)
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

//----------------------------------------
// ALTERNÂNCIA ENTRE FORMULÁRIOS
//----------------------------------------

// Referências aos elementos DOM
const formContainer = document.getElementById('formContainer');
const toRegisterBtn = document.getElementById('toRegisterBtn');
const toLoginBtn = document.getElementById('toLoginBtn');
const leftToggleBtn = document.getElementById('leftToggleBtn');

/**
 * Atualiza o texto do botão de alternância lateral
 * baseado no formulário atual visível
 */
function updateToggleButtonText() {
    const isFlipped = formContainer.classList.contains('flipped');
    if (leftToggleBtn) {
        leftToggleBtn.textContent = isFlipped ? 'Alternar para Login' : 'Alternar para Cadastro';
    }
}

/**
 * Exibe o formulário de cadastro
 * Adiciona a classe 'flipped' para girar o card
 */
function showRegisterForm() {
    formContainer.classList.add('flipped');
    updateToggleButtonText();
}

/**
 * Exibe o formulário de login
 * Remove a classe 'flipped' para voltar o card à posição original
 */
function showLoginForm() {
    formContainer.classList.remove('flipped');
    updateToggleButtonText();
}

// Adiciona os event listeners aos botões
toRegisterBtn.addEventListener('click', showRegisterForm);
toLoginBtn.addEventListener('click', showLoginForm);
if (leftToggleBtn) {
    leftToggleBtn.addEventListener('click', () => {
        if (formContainer.classList.contains('flipped')) {
            showLoginForm();
        } else {
            showRegisterForm();
        }
    });
}

//----------------------------------------
// VALIDAÇÃO DE FORMULÁRIOS
//----------------------------------------

// Referências aos formulários
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

/**
 * Exibe mensagem de erro para um campo específico
 * @param {string} inputId - ID do campo de entrada
 * @param {string} message - Mensagem de erro a ser exibida
 * @return {boolean} - Sempre retorna false para uso em validações
 */
function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
    
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.classList.add('border-red-500');
    }
    
    return false;
}

/**
 * Limpa as mensagens de erro de um campo específico
 * @param {string} inputId - ID do campo de entrada
 */
function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}Error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }
    
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        inputElement.classList.remove('border-red-500');
    }
}

/**
 * Validação do formulário de login
 * Verifica:
 * - Se o email é válido
 * - Se a senha tem comprimento mínimo
 */
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Limpa erros anteriores
    clearError('loginEmail');
    clearError('loginPassword');
    
    // Validação de email
    if (!email) {
        isValid = showError('loginEmail', 'Email é obrigatório');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        isValid = showError('loginEmail', 'Email inválido');
    }
    
    // Validação de senha
    if (!password) {
        isValid = showError('loginPassword', 'Senha é obrigatória');
    } else if (password.length < 6) {
        isValid = showError('loginPassword', 'Senha deve ter pelo menos 6 caracteres');
    }
    
    if (isValid) {
        // Sucesso! Em um app real, você processaria o login aqui
        // Por exemplo, enviando os dados para uma API
        alert('Login bem-sucedido! Redirecionando...');
        loginForm.reset();
        
        // Aqui você redirecionaria para a página principal
        // window.location.href = 'dashboard.html';
    }
});

/**
 * Validação do formulário de cadastro
 * Verifica todos os campos obrigatórios e regras específicas
 * como confirmação de senha e aceitação dos termos
 */
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Limpa erros anteriores
    clearError('firstName');
    clearError('lastName');
    clearError('registerEmail');
    clearError('registerPassword');
    clearError('confirmPassword');
    
    // Validação do nome
    if (!firstName) {
        isValid = showError('firstName', 'Nome é obrigatório');
    }
    
    // Validação do sobrenome
    if (!lastName) {
        isValid = showError('lastName', 'Sobrenome é obrigatório');
    }
    
    // Validação de email
    if (!email) {
        isValid = showError('registerEmail', 'Email é obrigatório');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        isValid = showError('registerEmail', 'Email inválido');
    }
    
    // Validação de senha
    if (!password) {
        isValid = showError('registerPassword', 'Senha é obrigatória');
    } else if (password.length < 6) {
        isValid = showError('registerPassword', 'Senha deve ter pelo menos 6 caracteres');
    }
    
    // Validação de confirmação de senha
    if (!confirmPassword) {
        isValid = showError('confirmPassword', 'Confirme sua senha');
    } else if (confirmPassword !== password) {
        isValid = showError('confirmPassword', 'As senhas não coincidem');
    }
    
    // Validação dos termos
    if (!terms) {
        isValid = false;
        alert('Você deve concordar com os Termos e Política de Privacidade');
    }
    
    if (isValid) {
        // Sucesso! Em um app real, você processaria o cadastro aqui
        // Por exemplo, enviando os dados para uma API
        alert('Cadastro bem-sucedido! Redirecionando...');
        registerForm.reset();
        showLoginForm(); // Volta para o login após cadastro
    }
});

/**
 * Adiciona listeners para limpar os erros quando o usuário começa a digitar
 * Melhora a experiência do usuário ao fornecer feedback visual imediato
 */
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        if (this.id) {
            clearError(this.id);
        }
    });
});
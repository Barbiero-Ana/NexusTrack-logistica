'use strict';

const shipmentApiUrl = "http://localhost:5000/api";

class ShipmentManager {
    constructor() {
        this.validator = new FormValidator();
        this.fileManager = new FileManager();
        this.setupForm();
        this.setupEventListeners();
    }

    setupForm() {
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

        this.generateTrackingCode();
    }

    setupEventListeners() {
        const form = document.getElementById('shipmentForm');
        const clearBtn = document.getElementById('clearForm');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        clearBtn.addEventListener('click', () => {
            this.clearForm();
        });

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

        if (!formData.trackingCode.trim()) {
            isValid = this.validator.showError('trackingCode', 'Código de rastreamento é obrigatório');
        }

        if (!formData.recipientName.trim()) {
            isValid = this.validator.showError('recipientName', 'Nome do destinatário é obrigatório');
        }

        if (!formData.zipCode.trim() || !this.validator.validateCEP(formData.zipCode)) {
            isValid = this.validator.showError('zipCode', 'CEP inválido');
        }

        if (!formData.purchaseDate || !this.validator.validateDate(formData.purchaseDate)) {
            isValid = this.validator.showError('purchaseDate', 'Data inválida');
        }

        if (!formData.carrier.trim()) {
            isValid = this.validator.showError('carrier', 'Nome da transportadora é obrigatório');
        }

        if (formData.cnpj && !this.validator.validateCNPJ(formData.cnpj)) {
            isValid = this.validator.showError('cnpj', 'CNPJ inválido');
        }

        if (!formData.email.trim() || !this.validator.validateEmail(formData.email)) {
            isValid = this.validator.showError('email', 'Email inválido');
        }

        if (!formData.phone1.trim() || !this.validator.validatePhone(formData.phone1)) {
            isValid = this.validator.showError('phone1', 'Telefone inválido');
        }

        if (formData.phone2 && !this.validator.validatePhone(formData.phone2)) {
            isValid = this.validator.showError('phone2', 'Telefone inválido');
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
        const formData = this.collectFormData();

        if (!this.validateForm(formData)) {
            showAlert('Por favor, corrija os erros no formulário.', 'error');
            return;
        }

        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user) {
            showAlert('Usuário não logado.', 'error');
            return;
        }

        const envio = {
            usuario_id: user.id,
            tracking_code: formData.trackingCode,
            recipient_name: formData.recipientName,
            email: formData.email
        };

        try {
            const res = await fetch(`${shipmentApiUrl}/pedidos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(envio)
            });

            const data = await res.json();
            if (res.ok) {
                showAlert("Envio cadastrado com sucesso!", "success");
                this.clearForm();
                this.generateTrackingCode();
            } else {
                showAlert(data.erro || "Erro ao cadastrar envio", "error");
            }
        } catch (err) {
            console.error("Erro ao enviar pedido:", err);
            showAlert("Erro na comunicação com o servidor.", "error");
        }
    }

    clearForm() {
        const form = document.getElementById('shipmentForm');
        form.reset();
        this.fileManager.removeFile();
        this.validator.clearAllErrors();

        const notesCount = document.getElementById('notesCount');
        if (notesCount) notesCount.textContent = '0';

        showAlert('Formulário limpo com sucesso.', 'success', 2000);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ShipmentManager();
});

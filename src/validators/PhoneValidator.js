(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.PhoneValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'Telefone inválido.',
            successMessage: 'Campo válido.'
        },

        validate: function () {
            
        }
    });

}(jQuery, window.gc = window.gc || {}));

(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.CreditCardValidator = gc.validators.AbstractValidator.extend({

        options: {
            errorMessage: 'O cartão de crédito informado é invalido.',
            successMessage: 'Campo válido.'
        },

        validate: function () {
            
        }
    });

}(jQuery, window.gc = window.gc || {}));

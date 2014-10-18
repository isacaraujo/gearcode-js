(function ($, gc) {

    gc.form = gc.form || {};

    $.Events.ValidateChange = 'validate_change';

    gc.form.TextField = gc.display.DisplayObject.extend({

        options: {
            selector: '<input type="text">',
            required: false,
            validators: null,
            mask: null,
            prefix: '',
            sufix: '',
            useStatusPlacement: true,
            statusPlacement: null,
            hidePlacementOnSuccess: false,
            successMessage: 'Este campo é válido.',
            requiredMessage: 'Campo obrigatório'
        },

        validators: null,
        mask: null,
        hasAttachedEvent: false,
        errors: null,

        init: function (options) {
            this._super(options);
            // this.setupMask();
            this.setupValidators();
            this.setupStatusPlacement();
        },

        setupStatusPlacement: function () {
            if (!this.options.useStatusPlacement) return;
            if (!this.options.statusPlacement) {
                var $next = this.sel().next();
                if (!$next.length) {
                    $next = $('<label class="validate-status" />');
                }
                this.options.statusPlacement = $next.get(0);
            }
            $(this.options.statusPlacement).hide();
        },

        setupValidators: function (validators) {
            this.validators = [];
            this.parseAttributes();
            if (!this.get('validators')) this.set('validators', []);
            for (var i = 0; i < this.options.validators.length; i++) {
                this.addValidator(this.options.validators[i]);
            }
            if (!this.validators.length && this.options.required) this.bindListener();
        },

        parseAttributes: function () {
            //<input type="text" class="textfield" required validators="url,extension:extensions=jpg|png|gif" />
            var $selector = this.sel();
            var validators = $selector.attr('validators');
            if ($selector.attr('required')) this.options.required = true;
            if ($selector.attr('prefix')) this.options.prefix = $selector.attr('prefix');
            if ($selector.attr('sufix')) this.options.sufix = $selector.attr('sufix');
            if (validators) {
                validators = validators.split(',');
                for (var i = 0; i < validators.length; i++) {
                    var parts = validators[i].split(':');
                    var validator =  { name: parts.shift() };
                    for (var k = 0; k < parts.length; k++) {
                        var option = parts[k].split('=');
                        var optionName = option[0];
                        validator[ optionName ] = option[1];
                    }
                    this.addValidator(validator);
                }
            }
        },

        setupMask: function () {
            throw "Not implemented yet!";
            var mask = this.get('mask');
            if (!mask) return;
            this.mask = new gc.form.utils.TextFieldMask(mask, this);
        },

        addValidator: function (validator) {
            validator = gc.validators.ValidatorFactory.make(validator);
            this.validators.push(validator);
            this.bindListener();
        },

        bindListener: function () {
            if (this.hasAttachedEvent) return;
            this.on('blur', this.handleEvent, false, this);
            this.hasAttachedEvent = true;
        },

        handleEvent: function (evt) {
            var errors = [],
                len = this.validators.length,
                status = true,
                _value = this.val();

            if (!new RegExp('^' + $.regexp(this.options.prefix)).test(_value)) {
                console.log('prefix (1)', this.options.prefix);
                console.log('prefix');
                _value = this.options.prefix + _value;
            }
            if (!new RegExp($.regexp(this.options.sufix) + '$').test(_value)) {
                _value = this.options.sufix + _value;
            }
            if (this.val() !== _value) this.val(_value);

            // check if options is not required and empty
            // in these conditions, status is valid;
            if (!this.options.required && !_value.trim().length) {
                status = true;
            } else {
                if (this.options.required && !_value.trim().length) {
                    errors.push(this.options.requiredMessage);
                }
                for (var i = 0; i < len; i++) {
                    var temp = this.validators[i];
                    result = temp.validate(this.val());
                    if (!result) {
                        errors.push(temp.get('errorMessage'));
                    }
                }
                status = errors.length === 0;
            }
            this.validateChange(errors, status);
        },

        val: function () {
            if (arguments.length && typeof arguments[0] === 'string') {
                this.sel().val(arguments[0]);
                return;
            }
            return this.sel().val();
        },

        attachPlacement: function () {
            if (!this.options.statusPlacement.parentNode || 
                !this.options.statusPlacement.parentNode.parentNode) {
                this.sel().after(this.options.statusPlacement);
            }
        },

        validateChange: function (errors, result) {
            this.dispatch($.Events.ValidateChange, { 
                field: this,
                errors: errors,
                result: result
            });
            if (!this.options.useStatusPlacement) return;
            if (result && this.options.hidePlacementOnSuccess) {
                $(this.options.statusPlacement).hide();
                return;
            }
            var message, domClass;
            if (result) {
                domClass = 'valid';
                message = this.get('successMessage');
            } else {
                domClass = 'invalid';
                message = errors[0];
            }
            this.attachPlacement();
            $(this.options.statusPlacement)
                .addClass(domClass)
                .show()
                .text(message);
        }
    });

}(jQuery, window.gc = window.gc || {}));

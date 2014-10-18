(function ($, gc) {

    gc.validators = gc.validators || {};

    gc.validators.AbstractValidator = gc.core.EventDispatcher.extend({

        options: {
            name: null
        },

        observables: null,

        init: function (options) {
            this._super();
            this.setOptions(options);
            this.observables = [];
        },

        validate: function () {
            throw "The method Validate must be implemented by child class.";
        },

        observe: function (observable) {
            observable.on('blur', this.handleEvent, false, this);
            this.observables.push(observable);
        },

        handleEvent: function (evt) {
            var observable = this.getObservableByElement(evt.target);
            if (!observable) throw "Unknown observable.";
            var result = this.validate(observable.val());
            observable.validateChange && 
                observable.validateChange(this, result);
        },

        getObservableByElement: function (el) {
            for (var i = 0; i < this.observables.length; i++) {
                var obs = this.observables[i];
                if (obs.e() == el) return obs;
            }
            return null;
        }
    });

}(jQuery, window.gc = window.gc || {}));

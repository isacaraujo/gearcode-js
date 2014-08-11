(function ($, gc) {
    "use strict";
    
    
    /**
     * @main gc
     * @module gc
     **/
    gc.display = gc.display || {};
    
    
    /**
     * Interface visual botão, extende o comportamento de um botão nativo, 
     * com comportamentos e métodos intuitivos e uma interface amigável.
     * @class gc.display.Button
     * @extends gc.display.DisplayObject
     * @constructor
     * @param {Object} [options]* Zero or more optional configuration objects.
     **/
    gc.display.Button = gc.display.DisplayObject.extend({
        
        statics: {
            /**
             Garante que o evento de clique seja unico.
             @static
             @property handlerInUse
             @type Bollean
             @default false
             **/
            handlerInUse: false
        },
        
        
        /**
         Representa o timestamp do clique.
         @private
         @property _touchstartTime
         @type Number
         @default null
         **/
        _touchstartTime: null,
        
        
        init: function (options) {
            this._super(options);
            this.setupEvents();
        },
        
        
        /**
         Inicializa os eventos de um botão.
         @method setupEvents 
         **/
        setupEvents: function () {
            if (!$.isMobile) { return; }
            this.on($.Events.touchstart, this.onTouchstart, false, this);
        },
        
        
        /**
         Recebe o evento de interação do usuário.
         @method onTouchstart
         @private
         @param {MouseEvent} evt Evento do botão
         **/
        onTouchstart: function (evt) {
            if (gc.display.Button.handlerInUse) { return; }
            if (evt.preventDefault) { evt.preventDefault(); }
            gc.display.Button.handlerInUse = true;
            var self = this;
            function handleTouchend(evt) {
                $(document).off($.Events.touchend, handleTouchend);
                if (evt.originalEvent.target === self.e()) {
                    self.dispatch('click');
                }
                gc.display.Button.handlerInUse = false;
            }
            $(document).on($.Events.touchend, handleTouchend);
        }
    });
    
}(jQuery, window.gc = window.gc || {}));

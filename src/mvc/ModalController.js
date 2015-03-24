(function ($, gc) {
    "use strict";
    
    /** @namespace */
    gc.mvc = gc.mvc || {};
    
    /** @class */
    gc.mvc.ModalController = gc.mvc.BaseController.extend({
        
        options: {
            zIndex: 999999999,
            overlayColor: '#000000',
            dismissOnClickOverlay: true,
            contentTop: '24px',
            contentWidth: '66%',
            contentBg: 'white',
            hideOnEsc: true,
            showBtnClose: true,
            alwaysOnTop: true,
            fixedWrapper: null
        },
        
        $content: null,
        
        show: function () {
            this.loadTemplate();
        },
        
        setView: function (node) {
            var $lay = this.getOverlay();
            this.$content = $lay.children('.gc-modal-content');
            this.$content.append(node);
            this._super($lay.get(0));
        },
        
        onLoad: function () {
            this.setWrapperFixed();
            this.$view
                .hide()
                .appendTo($.document.e().body)
                .fadeIn('fast', this.callback(this.onFadeIn));
        },
        
        onFadeIn: function () {
            this.setupEvents();
            this.dispatch('show', { controller: this });
        },

        setupEvents: function () {
            this.options.dismissOnClickOverlay && 
                this.$view
                    .children('.gc-modal-overlay')
                    .on('click', this.callback(this.hide));
            this.options.hideOnEsc && 
                $.document.on('keydown', this.handleKeyDown, false, this);
            this.options.showBtnClose &&
                this.$view.find('.gc-modal-close')
                    .on('click', this.callback(this.handleBtnClose));
        },

        removeEvents: function () {
            $.document
                .off('keydown', this.handleKeyDown, false, this);
            this.$view
                .find('.gc-modal-close').off('click');
            this.$view
                .children('.gc-modal-overlay')
                .off('click');
        },

        handleKeyDown: function (evt) {
            evt.which == 27 && this.hide();
        },

        handleBtnClose: function (evt) {
            this.hide();
        },
        
        hide: function () {
            this.removeEvents();
            this.$view
                .fadeOut('fast', this.callback(this.onFadeOut));
        },
        
        onFadeOut: function () {
            this.$view.remove();
            this.$view = null;
            this.restoreWrapper();
            this.dispatch('hide', { controller: this });
        },
        
        getOverlay: function () {
            var $overlay = $('<div class="gc-modal">' + 
                '<div class="gc-modal-overlay" />' + 
                '<div class="gc-modal-content" />' + 
            '</div>');
            $overlay.css({
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                zIndex: this.options.zIndex
            });
            $overlay.children('.gc-modal-overlay').css({
                position: 'fixed',
                width: '100%',
                height: '100%',
                top:  0,
                left: 0,
                backgroundColor: this.options.overlayColor,
                opacity: 0.8
            });
            $overlay.children('.gc-modal-content').css({
                position:   'relative',
                width:      this.options.contentWidth,
                height:     'auto',
                margin:    '20px auto',
                display:    'table',
                backgroundColor: this.options.contentBg
            });

            if (this.options.showBtnClose) {
                $overlay.children('.gc-modal-content')
                    .append('<button class="gc-modal-close">&times;</button>');
            }

            return $overlay;
        },

        setWrapperFixed: function () {
            if (!this.options.fixedWrapper) return;
            var supportPageOffset = window.pageXOffset !== undefined;
            var isCSS1Compat      = ((document.compatMode || "") === "CSS1Compat");
            var top               = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
            $(this.options.fixedWrapper).css({
                top: -top,
                position: 'fixed'
            });
            $.window.e().scrollTo(0, 0);
        },

        restoreWrapper: function () {
            if (!this.options.fixedWrapper) return;
            var top = -parseFloat($(this.options.fixedWrapper).css('top'));
            $(this.options.fixedWrapper).removeAttr('style');
            $.window.e().scrollTo(0, top);
        }
    });
    
}(jQuery, window.gc = window.gc || {}));

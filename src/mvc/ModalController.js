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
            showBtnClose: true
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
            this.$view
                .hide()
                .appendTo($.document.e().body)
                .fadeIn('fast', this.callback(this.onFadeIn));
            this.onWindowResize();
        },
        
        onFadeIn: function () {
            this.options.dismissOnClickOverlay && 
                this.$view
                    .children('.gc-modal-overlay')
                    .on('click', this.callback(this.hide));
            $.window.on('resize', this.onWindowResize, false, this);
            this.onWindowResize();
            this.options.hideOnEsc && 
                $.document.on('keydown', this.handleKeyDown, false, this);
            this.options.showBtnClose &&
                this.$view.find('.gc-modal-close').on('click', this.callback(this.handleBtnClose));
            this.dispatch('show', { controller: this });
        },

        handleKeyDown: function (evt) {
            evt.which == 27 && this.hide();
        },

        handleBtnClose: function (evt) {
            this.hide();
        },
        
        onWindowResize: function (evt) {
            var w = this.$content.width();
            var bodyW = $($.document.e().body).width();
            this.$content.css('left', Math.max((bodyW - w) / 2, 0));
            this.updateHeight();
        },

        updateHeight: function () {
            this.$view.css('height', '100%');
            this.$view
                .css('height', $.document.sel().height());
        },
        
        hide: function () {
            $.window
                .off('resize', this.onWindowResize, false, this);
            $.document
                .off('keydown', this.handleKeyDown, false, this);
            this.$view
                .find('.gc-modal-close').off('click');
            this.$view
                .children('.gc-modal-overlay')
                .off('click');
            this.$view
                .fadeOut('fast', this.callback(this.onFadeOut));
        },
        
        onFadeOut: function () {
            this.$view.remove();
            this.$view = null;
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
                position: 'absolute',
                width: '100%',
                height: '100%',
                top:  0,
                left: 0,
                backgroundColor: this.options.overlayColor,
                opacity: 0.8
            });
            $overlay.children('.gc-modal-content').css({
                position:   'absolute',
                width:      this.options.contentWidth,
                height:     'auto',
                top:        this.options.contentTop,
                left:       '20%',
                backgroundColor: this.options.contentBg
            });

            if (this.options.showBtnClose) {
                $overlay.children('.gc-modal-content')
                    .append('<button class="gc-modal-close">&times;</button>');
            }

            return $overlay;
        }
    });
    
}(jQuery, window.gc = window.gc || {}));

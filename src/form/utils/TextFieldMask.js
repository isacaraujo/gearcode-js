/**
 * Ainda não está funcionando. Preciso dedicar algumas horas para este item
 */
(function ($, gc, form) {

    form.utils = form.utils || {};

    gc.form.utils.TextFieldMask = gc.display.DisplayObject.extend({

        mask: null,
        field: null,
        

        init: function (mask, field) {
            this.mask = mask;
            this.field = field;
            this.setupEvents();
        },

        setupEvents: function () {
            this.field.on('blur', this.handleBlur, false, this);
            this.field.on('keydown', this.handleKeydown, false, this);
            this.field.on('keypress', this.handleKeypress, false, this);
            this.field.on('paste', this.handlePaste, false, this);
        },

        handleBlur: function (evt) {
            this.checkVal();
            if (this.field.val() != focusText) this.field.sel().change();
        },

        handleKeydown: function (evt) {
            var k = e.which,
                pos,
                begin,
                end;
            oldVal = input.val();
            //backspace, delete, and escape get special treatment
            if (k === 8 || k === 46 || (iPhone && k === 127)) {
                pos = this.caret();

                if (pos.end - pos.begin === 0) {
                    pos.begin = k !== 46 ? seekPrev(pos.begin) : (end = seekNext(pos.begin - 1));
                    pos.end = k === 46 ? seekNext(pos.end) : pos.end;
                }
                clearBuffer(pos.begin, pos.end);
                shiftL(begin, end - 1);
                e.preventDefault();

            } else if (k === 13) { // enter
                this.handleBlur(e);
            } else if (k === 27) { // escape
                this.field.val(focusText);
                this.caret(0, checkVal());
                e.preventDefault();
            }
        },

        handleKeypress: function (evt) {
            if (input.prop("readonly")) {
                return;
            }

            var k = e.which,
                pos = input.caret(),
                p,
                c,
                next;

            if (e.ctrlKey || e.altKey || e.metaKey || k < 32) { //Ignore
                return;
            } else if (k && k !== 13) {
                if (pos.end - pos.begin !== 0) {
                    clearBuffer(pos.begin, pos.end);
                    shiftL(pos.begin, pos.end - 1);
                }

                p = seekNext(pos.begin - 1);
                if (p < len) {
                    c = String.fromCharCode(k);
                    if (tests[p].test(c)) {
                        shiftR(p);

                        buffer[p] = c;
                        writeBuffer();
                        next = seekNext(p);

                        if (android) {
                            //Path for CSP Violation on FireFox OS 1.1
                            var proxy = function() {
                                $.proxy($.fn.caret, input, next)();
                            };

                            setTimeout(proxy, 0);
                        } else {
                            input.caret(next);
                        }
                        if (pos.begin <= lastRequiredNonMaskPos) {
                            this.tryFireCompleted();
                        }
                    }
                }
                e.preventDefault();
            }
        },

        handlePaste: function (evt) {
            if (input.prop("readonly")) {
                return;
            }

            setTimeout(this.callback(function() {
                var pos = checkVal(true);
                this.caret(pos);
                this.tryFireCompleted();
            }), 0);
        },

        caret: function(begin, end) {
            var range;
            if (typeof begin == 'number') {
                end = (typeof end === 'number') ? end : begin;
                return this.each(function() {
                    if (this.setSelectionRange) {
                        this.setSelectionRange(begin, end);
                    } else if (this.createTextRange) {
                        range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                });
            } else {
                if (this[0].setSelectionRange) {
                    begin = this.field.selectionStart;
                    end = this.field.selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return {
                    begin: begin,
                    end: end
                };
            }
        },

        mask: function () {
            var input,
                defs,
                tests,
                partialPosition,
                firstNonMaskPos,
                lastRequiredNonMaskPos,
                len,
                oldVal;

            defs = $.mask.definitions;
            tests = [];
            partialPosition = len = mask.length;
            firstNonMaskPos = null;

            $.each(mask.split(""), function(i, c) {
                if (c == '?') {
                    len--;
                    partialPosition = i;
                } else if (defs[c]) {
                    tests.push(new RegExp(defs[c]));
                    if (firstNonMaskPos === null) {
                        firstNonMaskPos = tests.length - 1;
                    }
                    if (i < partialPosition) {
                        lastRequiredNonMaskPos = tests.length - 1;
                    }
                } else {
                    tests.push(null);
                }
            });

            var input = $(this),
                buffer = $.map(
                    mask.split(""),
                    function(c, i) {
                        if (c != '?') {
                            return defs[c] ? settings.placeholder : c;
                        }
                    }),
                defaultBuffer = buffer.join(''),
                focusText = input.val();
        },
            
        tryFireCompleted: function () {
            if (!settings.completed) {
                return;
            }

            for (var i = firstNonMaskPos; i <= lastRequiredNonMaskPos; i++) {
                if (tests[i] && buffer[i] === settings.placeholder) {
                    return;
                }
            }
            settings.completed.call(input);
        },

        seekNext: function (pos) {
            while (++pos < len && !tests[pos]);
            return pos;
        },

        seekPrev: function (pos) {
            while (--pos >= 0 && !tests[pos]);
            return pos;
        },

        shiftL: function (begin, end) {
            var i,
                j;

            if (begin < 0) {
                return;
            }

            for (i = begin, j = seekNext(end); i < len; i++) {
                if (tests[i]) {
                    if (j < len && tests[i].test(buffer[j])) {
                        buffer[i] = buffer[j];
                        buffer[j] = settings.placeholder;
                    } else {
                        break;
                    }

                    j = seekNext(j);
                }
            }
            writeBuffer();
            input.caret(Math.max(firstNonMaskPos, begin));
        },

        shiftR: function (pos) {
            var i,
                c,
                j,
                t;

            for (i = pos, c = settings.placeholder; i < len; i++) {
                if (tests[i]) {
                    j = seekNext(i);
                    t = buffer[i];
                    buffer[i] = c;
                    if (j < len && tests[j].test(t)) {
                        c = t;
                    } else {
                        break;
                    }
                }
            }
        },

        androidInputEvent: function (e) {
            var curVal = input.val();
            var pos = input.caret();
            if (curVal.length < oldVal.length) {
                // a deletion or backspace happened
                checkVal(true);
                while (pos.begin > 0 && !tests[pos.begin - 1])
                    pos.begin--;
                if (pos.begin === 0) {
                    while (pos.begin < firstNonMaskPos && !tests[pos.begin])
                        pos.begin++;
                }
                input.caret(pos.begin, pos.begin);
            } else {
                var pos2 = checkVal(true);
                while (pos.begin < len && !tests[pos.begin])
                    pos.begin++;

                input.caret(pos.begin, pos.begin);
            }

            tryFireCompleted();
        },

        clearBuffer: function (start, end) {
            var i;
            for (i = start; i < end && i < len; i++) {
                if (tests[i]) {
                    buffer[i] = settings.placeholder;
                }
            }
        },

        writeBuffer: function () {
            input.val(buffer.join(''));
        },

        checkVal: function (allow) {
            //try to place characters where they belong
            var test = this.field.value,
                lastMatch = -1,
                i,
                c,
                pos;

            for (i = 0, pos = 0; i < len; i++) {
                if (tests[i]) {
                    buffer[i] = '_';
                    while (pos++ < test.length) {
                        c = test.charAt(pos - 1);
                        if (tests[i].test(c)) {
                            buffer[i] = c;
                            lastMatch = i;
                            break;
                        }
                    }
                    if (pos > test.length) {
                        clearBuffer(i + 1, len);
                        break;
                    }
                } else {
                    if (buffer[i] === test.charAt(pos)) {
                        pos++;
                    }
                    if (i < partialPosition) {
                        lastMatch = i;
                    }
                }
            }
            if (allow) {
                writeBuffer();
            } else if (lastMatch + 1 < partialPosition) {
                if (settings.autoclear || buffer.join('') === defaultBuffer) {
                    // Invalid value. Remove it and replace it with the
                    // mask, which is the default behavior.
                    if (this.field.value) this.field.value = "";
                    this.clearBuffer(0, len);
                } else {
                    // Invalid value, but we opt to show the value to the
                    // user and allow them to correct their mistake.
                    this.writeBuffer();
                }
            } else {
                writeBuffer();
                input.val(this.field.value.substring(0, lastMatch + 1));
            }
            return (partialPosition ? i : firstNonMaskPos);
        }
    });

}(jQuery, window.gc = window.gc || {}, gc.form = gc.form || {}));

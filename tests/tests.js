(function () {
    test("[sync test]: getter/setter Object 'options'", function (assert) {
        
        // setup
        var o = new gc.core.Object({
            a: "a"
        });
        
        // test 1
        assert.equal(o.get("a"), "a", "option setted in 'constructor' passed.");
        
        // test 2
        o.set("a", "b");
        assert.equal(o.get("a"), "b", "option setted in 'setter' passed.");
        
        // test 3
        o.setOptions({
            "a": "c"
        });
        assert.equal(o.get("a"), "c", "option setted with 'setOptions' passed.");
        
        // test 4
        var a = ["a", "b", "c", "d"];
        for (var i = 0; i < 1000; i++) {
            var value = a[i % 4];
            o.set("a", value);
            assert.equal(o.get("a"), value, "option setted in a sync loop passed.");
        }
        var value = a[i % 4];
        o.set("a", value);
        assert.equal(o.get("a"), value, "option setted after sync loop passed.");
    });
    
    test("[async test]: getter/setter Object 'options'.", function() {
        // setup
        var o = new gc.core.Object({
            a: "a"
        });
        // test 5
        var a = ["a", "b", "c", "d"];
        var i = 0;
        
        stop();
        var timeoutId = setInterval(function () {
            //if (i > 0) stop();
            var value = a[i % 4];
            o.set("a", value);
            equal(o.get("a"), value, "option setted after async loop passed.");
            if (++i >= 1000) {
                clearInterval(timeoutId), timeoutId = null;
                start();
                return;
            }
        }, 10);
    });
    
    test("[async test]: getter/setter with 2 objects.", function() {
        // setup
        var o1 = new gc.core.Object({
            a: "a"
        });
        
        var o2 = new gc.core.Object({
            a: "a"
        });
        
        // test 6
        var a1 = ["a", "b", "c", "d"];
        var a2 = ["e", "f", "g", "h"];
        var i = 0;
        
        stop();
        var timeoutId = setInterval(function () {
            var v1 = a1[i % 4],
                v2 = a2[i % 4];
            
            o1.set("a", v1);
            equal(o1.get("a"), v1, "option setted in o1 passed.");
            
            o2.set("a", v2);
            equal(o2.get("a"), v2, "option setted in o2 passed.");
            
            if (++i >= 1000) {
                clearInterval(timeoutId), timeoutId = null;
                start();
                return;
            }
        }, 10);
    });
}());
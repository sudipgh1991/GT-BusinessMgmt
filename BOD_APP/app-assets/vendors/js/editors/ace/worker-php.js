"no use strict";
;(function(window) {
if (typeof window.window != "undefined" && window.document)
    return;
if (window.require && window.define)
    return;

if (!window.console) {
    window.console = function() {
        var msgs = Array.prototype.slice.call(arguments, 0);
        postMessage({type: "log", data: msgs});
    };
    window.console.error =
    window.console.warn = 
    window.console.log =
    window.console.trace = window.console;
}
window.window = window;
window.ace = window;

window.onerror = function(message, file, line, col, err) {
    postMessage({type: "error", data: {
        message: message,
        data: err.data,
        file: file,
        line: line, 
        col: col,
        stack: err.stack
    }});
};

window.normalizeModule = function(parentId, moduleName) {
    // normalize plugin requires
    if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return window.normalizeModule(parentId, chunks[0]) + "!" + window.normalizeModule(parentId, chunks[1]);
    }
    // normalize relative requires
    if (moduleName.charAt(0) == ".") {
        var base = parentId.split("/").slice(0, -1).join("/");
        moduleName = (base ? base + "/" : "") + moduleName;
        
        while (moduleName.indexOf(".") !== -1 && previous != moduleName) {
            var previous = moduleName;
            moduleName = moduleName.replace(/^\.\//, "").replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
    }
    
    return moduleName;
};

window.require = function require(parentId, id) {
    if (!id) {
        id = parentId;
        parentId = null;
    }
    if (!id.charAt)
        throw new Error("worker.js require() accepts only (parentId, id) as arguments");

    id = window.normalizeModule(parentId, id);

    var module = window.require.modules[id];
    if (module) {
        if (!module.initialized) {
            module.initialized = true;
            module.exports = module.factory().exports;
        }
        return module.exports;
    }
   
    if (!window.require.tlns)
        return console.log("unable to load " + id);
    
    var path = resolveModuleId(id, window.require.tlns);
    if (path.slice(-3) != ".js") path += ".js";
    
    window.require.id = id;
    window.require.modules[id] = {}; // prevent infinite loop on broken modules
    importScripts(path);
    return window.require(parentId, id);
};
function resolveModuleId(id, paths) {
    var testPath = id, tail = "";
    while (testPath) {
        var alias = paths[testPath];
        if (typeof alias == "string") {
            return alias + tail;
        } else if (alias) {
            return  alias.location.replace(/\/*$/, "/") + (tail || alias.main || alias.name);
        } else if (alias === false) {
            return "";
        }
        var i = testPath.lastIndexOf("/");
        if (i === -1) break;
        tail = testPath.substr(i) + tail;
        testPath = testPath.slice(0, i);
    }
    return id;
}
window.require.modules = {};
window.require.tlns = {};

window.define = function(id, deps, factory) {
    if (arguments.length == 2) {
        factory = deps;
        if (typeof id != "string") {
            deps = id;
            id = window.require.id;
        }
    } else if (arguments.length == 1) {
        factory = id;
        deps = [];
        id = window.require.id;
    }
    
    if (typeof factory != "function") {
        window.require.modules[id] = {
            exports: factory,
            initialized: true
        };
        return;
    }

    if (!deps.length)
        // If there is no dependencies, we inject "require", "exports" and
        // "module" as dependencies, to provide CommonJS compatibility.
        deps = ["require", "exports", "module"];

    var req = function(childId) {
        return window.require(id, childId);
    };

    window.require.modules[id] = {
        exports: {},
        factory: function() {
            var module = this;
            var returnExports = factory.apply(this, deps.map(function(dep) {
                switch (dep) {
                    // Because "require", "exports" and "module" aren't actual
                    // dependencies, we must handle them seperately.
                    case "require": return req;
                    case "exports": return module.exports;
                    case "module":  return module;
                    // But for all other dependencies, we can just go ahead and
                    // require them.
                    default:        return req(dep);
                }
            }));
            if (returnExports)
                module.exports = returnExports;
            return module;
        }
    };
};
window.define.amd = {};
require.tlns = {};
window.initBaseUrls  = function initBaseUrls(topLevelNamespaces) {
    for (var i in topLevelNamespaces)
        require.tlns[i] = topLevelNamespaces[i];
};

window.initSender = function initSender() {

    var EventEmitter = window.require("ace/lib/event_emitter").EventEmitter;
    var oop = window.require("ace/lib/oop");
    
    var Sender = function() {};
    
    (function() {
        
        oop.implement(this, EventEmitter);
                
        this.callback = function(data, callbackId) {
            postMessage({
                type: "call",
                id: callbackId,
                data: data
            });
        };
    
        this.emit = function(name, data) {
            postMessage({
                type: "event",
                name: name,
                data: data
            });
        };
        
    }).call(Sender.prototype);
    
    return new Sender();
};

var main = window.main = null;
var sender = window.sender = null;

window.onmessage = function(e) {
    var msg = e.data;
    if (msg.event && sender) {
        sender._signal(msg.event, msg.data);
    }
    else if (msg.command) {
        if (main[msg.command])
            main[msg.command].apply(main, msg.args);
        else if (window[msg.command])
            window[msg.command].apply(window, msg.args);
        else
            throw new Error("Unknown command:" + msg.command);
    }
    else if (msg.init) {
        window.initBaseUrls(msg.tlns);
        require("ace/lib/es5-shim");
        sender = window.sender = window.initSender();
        var clazz = require(msg.module)[msg.classname];
        main = window.main = new clazz(sender);
    }
};
})(this);

define("ace/lib/oop",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};

exports.mixin = function(obj, mixin) {
    for (var key in mixin) {
        obj[key] = mixin[key];
    }
    return obj;
};

exports.implement = function(proto, mixin) {
    exports.mixin(proto, mixin);
};

});

define("ace/range",["require","exports","module"], function(require, exports, module) {
"use strict";
var comparePoints = function(p1, p2) {
    return p1.row - p2.row || p1.column - p2.column;
};
var Range = function(startRow, startColumn, endRow, endColumn) {
    this.start = {
        row: startRow,
        column: startColumn
    };

    this.end = {
        row: endRow,
        column: endColumn
    };
};

(function() {
    this.isEqual = function(range) {
        return this.start.row === range.start.row &&
            this.end.row === range.end.row &&
            this.start.column === range.start.column &&
            this.end.column === range.end.column;
    };
    this.toString = function() {
        return ("Range: [" + this.start.row + "/" + this.start.column +
            "] -> [" + this.end.row + "/" + this.end.column + "]");
    };

    this.contains = function(row, column) {
        return this.compare(row, column) == 0;
    };
    this.compareRange = function(range) {
        var cmp,
            end = range.end,
            start = range.start;

        cmp = this.compare(end.row, end.column);
        if (cmp == 1) {
            cmp = this.compare(start.row, start.column);
            if (cmp == 1) {
                return 2;
            } else if (cmp == 0) {
                return 1;
            } else {
                return 0;
            }
        } else if (cmp == -1) {
            return -2;
        } else {
            cmp = this.compare(start.row, start.column);
            if (cmp == -1) {
                return -1;
            } else if (cmp == 1) {
                return 42;
            } else {
                return 0;
            }
        }
    };
    this.comparePoint = function(p) {
        return this.compare(p.row, p.column);
    };
    this.containsRange = function(range) {
        return this.comparePoint(range.start) == 0 && this.comparePoint(range.end) == 0;
    };
    this.intersects = function(range) {
        var cmp = this.compareRange(range);
        return (cmp == -1 || cmp == 0 || cmp == 1);
    };
    this.isEnd = function(row, column) {
        return this.end.row == row && this.end.column == column;
    };
    this.isStart = function(row, column) {
        return this.start.row == row && this.start.column == column;
    };
    this.setStart = function(row, column) {
        if (typeof row == "object") {
            this.start.column = row.column;
            this.start.row = row.row;
        } else {
            this.start.row = row;
            this.start.column = column;
        }
    };
    this.setEnd = function(row, column) {
        if (typeof row == "object") {
            this.end.column = row.column;
            this.end.row = row.row;
        } else {
            this.end.row = row;
            this.end.column = column;
        }
    };
    this.inside = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    this.insideStart = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isEnd(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    this.insideEnd = function(row, column) {
        if (this.compare(row, column) == 0) {
            if (this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    this.compare = function(row, column) {
        if (!this.isMultiLine()) {
            if (row === this.start.row) {
                return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
            }
        }

        if (row < this.start.row)
            return -1;

        if (row > this.end.row)
            return 1;

        if (this.start.row === row)
            return column >= this.start.column ? 0 : -1;

        if (this.end.row === row)
            return column <= this.end.column ? 0 : 1;

        return 0;
    };
    this.compareStart = function(row, column) {
        if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    };
    this.compareEnd = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else {
            return this.compare(row, column);
        }
    };
    this.compareInside = function(row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    };
    this.clipRows = function(firstRow, lastRow) {
        if (this.end.row > lastRow)
            var end = {row: lastRow + 1, column: 0};
        else if (this.end.row < firstRow)
            var end = {row: firstRow, column: 0};

        if (this.start.row > lastRow)
            var start = {row: lastRow + 1, column: 0};
        else if (this.start.row < firstRow)
            var start = {row: firstRow, column: 0};

        return Range.fromPoints(start || this.start, end || this.end);
    };
    this.extend = function(row, column) {
        var cmp = this.compare(row, column);

        if (cmp == 0)
            return this;
        else if (cmp == -1)
            var start = {row: row, column: column};
        else
            var end = {row: row, column: column};

        return Range.fromPoints(start || this.start, end || this.end);
    };

    this.isEmpty = function() {
        return (this.start.row === this.end.row && this.start.column === this.end.column);
    };
    this.isMultiLine = function() {
        return (this.start.row !== this.end.row);
    };
    this.clone = function() {
        return Range.fromPoints(this.start, this.end);
    };
    this.collapseRows = function() {
        if (this.end.column == 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0)
        else
            return new Range(this.start.row, 0, this.end.row, 0)
    };
    this.toScreenRange = function(session) {
        var screenPosStart = session.documentToScreenPosition(this.start);
        var screenPosEnd = session.documentToScreenPosition(this.end);

        return new Range(
            screenPosStart.row, screenPosStart.column,
            screenPosEnd.row, screenPosEnd.column
        );
    };
    this.moveBy = function(row, column) {
        this.start.row += row;
        this.start.column += column;
        this.end.row += row;
        this.end.column += column;
    };

}).call(Range.prototype);
Range.fromPoints = function(start, end) {
    return new Range(start.row, start.column, end.row, end.column);
};
Range.comparePoints = comparePoints;

Range.comparePoints = function(p1, p2) {
    return p1.row - p2.row || p1.column - p2.column;
};


exports.Range = Range;
});

define("ace/apply_delta",["require","exports","module"], function(require, exports, module) {
"use strict";

function throwDeltaError(delta, errorText){
    console.log("Invalid Delta:", delta);
    throw "Invalid Delta: " + errorText;
}

function positionInDocument(docLines, position) {
    return position.row    >= 0 && position.row    <  docLines.length &&
           position.column >= 0 && position.column <= docLines[position.row].length;
}

function validateDelta(docLines, delta) {
    if (delta.action != "insert" && delta.action != "remove")
        throwDeltaError(delta, "delta.action must be 'insert' or 'remove'");
    if (!(delta.lines instanceof Array))
        throwDeltaError(delta, "delta.lines must be an Array");
    if (!delta.start || !delta.end)
       throwDeltaError(delta, "delta.start/end must be an present");
    var start = delta.start;
    if (!positionInDocument(docLines, delta.start))
        throwDeltaError(delta, "delta.start must be contained in document");
    var end = delta.end;
    if (delta.action == "remove" && !positionInDocument(docLines, end))
        throwDeltaError(delta, "delta.end must contained in document for 'remove' actions");
    var numRangeRows = end.row - start.row;
    var numRangeLastLineChars = (end.column - (numRangeRows == 0 ? start.column : 0));
    if (numRangeRows != delta.lines.length - 1 || delta.lines[numRangeRows].length != numRangeLastLineChars)
        throwDeltaError(delta, "delta.range must match delta lines");
}

exports.applyDelta = function(docLines, delta, doNotValidate) {
    
    var row = delta.start.row;
    var startColumn = delta.start.column;
    var line = docLines[row] || "";
    switch (delta.action) {
        case "insert":
            var lines = delta.lines;
            if (lines.length === 1) {
                docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
            } else {
                var args = [row, 1].concat(delta.lines);
                docLines.splice.apply(docLines, args);
                docLines[row] = line.substring(0, startColumn) + docLines[row];
                docLines[row + delta.lines.length - 1] += line.substring(startColumn);
            }
            break;
        case "remove":
            var endColumn = delta.end.column;
            var endRow = delta.end.row;
            if (row === endRow) {
                docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
            } else {
                docLines.splice(
                    row, endRow - row + 1,
                    line.substring(0, startColumn) + docLines[endRow].substring(endColumn)
                );
            }
            break;
    }
}
});

define("ace/lib/event_emitter",["require","exports","module"], function(require, exports, module) {
"use strict";

var EventEmitter = {};
var stopPropagation = function() { this.propagationStopped = true; };
var preventDefault = function() { this.defaultPrevented = true; };

EventEmitter._emit =
EventEmitter._dispatchEvent = function(eventName, e) {
    this._eventRegistry || (this._eventRegistry = {});
    this._defaultHandlers || (this._defaultHandlers = {});

    var listeners = this._eventRegistry[eventName] || [];
    var defaultHandler = this._defaultHandlers[eventName];
    if (!listeners.length && !defaultHandler)
        return;

    if (typeof e != "object" || !e)
        e = {};

    if (!e.type)
        e.type = eventName;
    if (!e.stopPropagation)
        e.stopPropagation = stopPropagation;
    if (!e.preventDefault)
        e.preventDefault = preventDefault;

    listeners = listeners.slice();
    for (var i=0; i<listeners.length; i++) {
        listeners[i](e, this);
        if (e.propagationStopped)
            break;
    }
    
    if (defaultHandler && !e.defaultPrevented)
        return defaultHandler(e, this);
};


EventEmitter._signal = function(eventName, e) {
    var listeners = (this._eventRegistry || {})[eventName];
    if (!listeners)
        return;
    listeners = listeners.slice();
    for (var i=0; i<listeners.length; i++)
        listeners[i](e, this);
};

EventEmitter.once = function(eventName, callback) {
    var _self = this;
    callback && this.addEventListener(eventName, function newCallback() {
        _self.removeEventListener(eventName, newCallback);
        callback.apply(null, arguments);
    });
};


EventEmitter.setDefaultHandler = function(eventName, callback) {
    var handlers = this._defaultHandlers
    if (!handlers)
        handlers = this._defaultHandlers = {_disabled_: {}};
    
    if (handlers[eventName]) {
        var old = handlers[eventName];
        var disabled = handlers._disabled_[eventName];
        if (!disabled)
            handlers._disabled_[eventName] = disabled = [];
        disabled.push(old);
        var i = disabled.indexOf(callback);
        if (i != -1) 
            disabled.splice(i, 1);
    }
    handlers[eventName] = callback;
};
EventEmitter.removeDefaultHandler = function(eventName, callback) {
    var handlers = this._defaultHandlers
    if (!handlers)
        return;
    var disabled = handlers._disabled_[eventName];
    
    if (handlers[eventName] == callback) {
        var old = handlers[eventName];
        if (disabled)
            this.setDefaultHandler(eventName, disabled.pop());
    } else if (disabled) {
        var i = disabled.indexOf(callback);
        if (i != -1)
            disabled.splice(i, 1);
    }
};

EventEmitter.on =
EventEmitter.addEventListener = function(eventName, callback, capturing) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        listeners = this._eventRegistry[eventName] = [];

    if (listeners.indexOf(callback) == -1)
        listeners[capturing ? "unshift" : "push"](callback);
    return callback;
};

EventEmitter.off =
EventEmitter.removeListener =
EventEmitter.removeEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        return;

    var index = listeners.indexOf(callback);
    if (index !== -1)
        listeners.splice(index, 1);
};

EventEmitter.removeAllListeners = function(eventName) {
    if (this._eventRegistry) this._eventRegistry[eventName] = [];
};

exports.EventEmitter = EventEmitter;

});

define("ace/anchor",["require","exports","module","ace/lib/oop","ace/lib/event_emitter"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var EventEmitter = require("./lib/event_emitter").EventEmitter;

var Anchor = exports.Anchor = function(doc, row, column) {
    this.$onChange = this.onChange.bind(this);
    this.attach(doc);
    
    if (typeof column == "undefined")
        this.setPosition(row.row, row.column);
    else
        this.setPosition(row, column);
};

(function() {

    oop.implement(this, EventEmitter);
    this.getPosition = function() {
        return this.$clipPositionToDocument(this.row, this.column);
    };
    this.getDocument = function() {
        return this.document;
    };
    this.$insertRight = false;
    this.onChange = function(delta) {
        if (delta.start.row == delta.end.row && delta.start.row != this.row)
            return;

        if (delta.start.row > this.row)
            return;
            
        var point = $getTransformedPoint(delta, {row: this.row, column: this.column}, this.$insertRight);
        this.setPosition(point.row, point.column, true);
    };
    
    function $pointsInOrder(point1, point2, equalPointsInOrder) {
        var bColIsAfter = equalPointsInOrder ? point1.column <= point2.column : point1.column < point2.column;
        return (point1.row < point2.row) || (point1.row == point2.row && bColIsAfter);
    }
            
    function $getTransformedPoint(delta, point, moveIfEqual) {
        var deltaIsInsert = delta.action == "insert";
        var deltaRowShift = (deltaIsInsert ? 1 : -1) * (delta.end.row    - delta.start.row);
        var deltaColShift = (deltaIsInsert ? 1 : -1) * (delta.end.column - delta.start.column);
        var deltaStart = delta.start;
        var deltaEnd = deltaIsInsert ? deltaStart : delta.end; // Collapse insert range.
        if ($pointsInOrder(point, deltaStart, moveIfEqual)) {
            return {
                row: point.row,
                column: point.column
            };
        }
        if ($pointsInOrder(deltaEnd, point, !moveIfEqual)) {
            return {
                row: point.row + deltaRowShift,
                column: point.column + (point.row == deltaEnd.row ? deltaColShift : 0)
            };
        }
        
        return {
            row: deltaStart.row,
            column: deltaStart.column
        };
    }
    this.setPosition = function(row, column, noClip) {
        var pos;
        if (noClip) {
            pos = {
                row: row,
                column: column
            };
        } else {
            pos = this.$clipPositionToDocument(row, column);
        }

        if (this.row == pos.row && this.column == pos.column)
            return;

        var old = {
            row: this.row,
            column: this.column
        };

        this.row = pos.row;
        this.column = pos.column;
        this._signal("change", {
            old: old,
            value: pos
        });
    };
    this.detach = function() {
        this.document.removeEventListener("change", this.$onChange);
    };
    this.attach = function(doc) {
        this.document = doc || this.document;
        this.document.on("change", this.$onChange);
    };
    this.$clipPositionToDocument = function(row, column) {
        var pos = {};

        if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
        }
        else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        }
        else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
        }

        if (column < 0)
            pos.column = 0;

        return pos;
    };

}).call(Anchor.prototype);

});

define("ace/document",["require","exports","module","ace/lib/oop","ace/apply_delta","ace/lib/event_emitter","ace/range","ace/anchor"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var applyDelta = require("./apply_delta").applyDelta;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var Range = require("./range").Range;
var Anchor = require("./anchor").Anchor;

var Document = function(textOrLines) {
    this.$lines = [""];
    if (textOrLines.length === 0) {
        this.$lines = [""];
    } else if (Array.isArray(textOrLines)) {
        this.insertMergedLines({row: 0, column: 0}, textOrLines);
    } else {
        this.insert({row: 0, column:0}, textOrLines);
    }
};

(function() {

    oop.implement(this, EventEmitter);
    this.setValue = function(text) {
        var len = this.getLength() - 1;
        this.remove(new Range(0, 0, len, this.getLine(len).length));
        this.insert({row: 0, column: 0}, text);
    };
    this.getValue = function() {
        return this.getAllLines().join(this.getNewLineCharacter());
    };
    this.createAnchor = function(row, column) {
        return new Anchor(this, row, column);
    };
    if ("aaa".split(/a/).length === 0) {
        this.$split = function(text) {
            return text.replace(/\r\n|\r/g, "\n").split("\n");
        };
    } else {
        this.$split = function(text) {
            return text.split(/\r\n|\r|\n/);
        };
    }


    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r\n|\r|\n)/m);
        this.$autoNewLine = match ? match[1] : "\n";
        this._signal("changeNewLineMode");
    };
    this.getNewLineCharacter = function() {
        switch (this.$newLineMode) {
          case "windows":
            return "\r\n";
          case "unix":
            return "\n";
          default:
            return this.$autoNewLine || "\n";
        }
    };

    this.$autoNewLine = "";
    this.$newLineMode = "auto";
    this.setNewLineMode = function(newLineMode) {
        if (this.$newLineMode === newLineMode)
            return;

        this.$newLineMode = newLineMode;
        this._signal("changeNewLineMode");
    };
    this.getNewLineMode = function() {
        return this.$newLineMode;
    };
    this.isNewLine = function(text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };
    this.getLine = function(row) {
        return this.$lines[row] || "";
    };
    this.getLines = function(firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow + 1);
    };
    this.getAllLines = function() {
        return this.getLines(0, this.getLength());
    };
    this.getLength = function() {
        return this.$lines.length;
    };
    this.getTextRange = function(range) {
        return this.getLinesForRange(range).join(this.getNewLineCharacter());
    };
    this.getLinesForRange = function(range) {
        var lines;
        if (range.start.row === range.end.row) {
            lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
        } else {
            lines = this.getLines(range.start.row, range.end.row);
            lines[0] = (lines[0] || "").substring(range.start.column);
            var l = lines.length - 1;
            if (range.end.row - range.start.row == l)
                lines[l] = lines[l].substring(0, range.end.column);
        }
        return lines;
    };
    this.insertLines = function(row, lines) {
        console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead.");
        return this.insertFullLines(row, lines);
    };
    this.removeLines = function(firstRow, lastRow) {
        console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead.");
        return this.removeFullLines(firstRow, lastRow);
    };
    this.insertNewLine = function(position) {
        console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, [\'\', \'\']) instead.");
        return this.insertMergedLines(position, ["", ""]);
    };
    this.insert = function(position, text) {
        if (this.getLength() <= 1)
            this.$detectNewLine(text);
        
        return this.insertMergedLines(position, this.$split(text));
    };
    this.insertInLine = function(position, text) {
        var start = this.clippedPos(position.row, position.column);
        var end = this.pos(position.row, position.column + text.length);
        
        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: [text]
        }, true);
        
        return this.clonePos(end);
    };
    
    this.clippedPos = function(row, column) {
        var length = this.getLength();
        if (row === undefined) {
            row = length;
        } else if (row < 0) {
            row = 0;
        } else if (row >= length) {
            row = length - 1;
            column = undefined;
        }
        var line = this.getLine(row);
        if (column == undefined)
            column = line.length;
        column = Math.min(Math.max(column, 0), line.length);
        return {row: row, column: column};
    };
    
    this.clonePos = function(pos) {
        return {row: pos.row, column: pos.column};
    };
    
    this.pos = function(row, column) {
        return {row: row, column: column};
    };
    
    this.$clipPosition = function(position) {
        var length = this.getLength();
        if (position.row >= length) {
            position.row = Math.max(0, length - 1);
            position.column = this.getLine(length - 1).length;
        } else {
            position.row = Math.max(0, position.row);
            position.column = Math.min(Math.max(position.column, 0), this.getLine(position.row).length);
        }
        return position;
    };
    this.insertFullLines = function(row, lines) {
        row = Math.min(Math.max(row, 0), this.getLength());
        var column = 0;
        if (row < this.getLength()) {
            lines = lines.concat([""]);
            column = 0;
        } else {
            lines = [""].concat(lines);
            row--;
            column = this.$lines[row].length;
        }
        this.insertMergedLines({row: row, column: column}, lines);
    };    
    this.insertMergedLines = function(position, lines) {
        var start = this.clippedPos(position.row, position.column);
        var end = {
            row: start.row + lines.length - 1,
            column: (lines.length == 1 ? start.column : 0) + lines[lines.length - 1].length
        };
        
        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: lines
        });
        
        return this.clonePos(end);
    };
    this.remove = function(range) {
        var start = this.clippedPos(range.start.row, range.start.column);
        var end = this.clippedPos(range.end.row, range.end.column);
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({start: start, end: end})
        });
        return this.clonePos(start);
    };
    this.removeInLine = function(row, startColumn, endColumn) {
        var start = this.clippedPos(row, startColumn);
        var end = this.clippedPos(row, endColumn);
        
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({start: start, end: end})
        }, true);
        
        return this.clonePos(start);
    };
    this.removeFullLines = function(firstRow, lastRow) {
        firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
        lastRow  = Math.min(Math.max(0, lastRow ), this.getLength() - 1);
        var deleteFirstNewLine = lastRow == this.getLength() - 1 && firstRow > 0;
        var deleteLastNewLine  = lastRow  < this.getLength() - 1;
        var startRow = ( deleteFirstNewLine ? firstRow - 1                  : firstRow                    );
        var startCol = ( deleteFirstNewLine ? this.getLine(startRow).length : 0                           );
        var endRow   = ( deleteLastNewLine  ? lastRow + 1                   : lastRow                     );
        var endCol   = ( deleteLastNewLine  ? 0                             : this.getLine(endRow).length ); 
        var range = new Range(startRow, startCol, endRow, endCol);
        var deletedLines = this.$lines.slice(firstRow, lastRow + 1);
        
        this.applyDelta({
            start: range.start,
            end: range.end,
            action: "remove",
            lines: this.getLinesForRange(range)
        });
        return deletedLines;
    };
    this.removeNewLine = function(row) {
        if (row < this.getLength() - 1 && row >= 0) {
            this.applyDelta({
                start: this.pos(row, this.getLine(row).length),
                end: this.pos(row + 1, 0),
                action: "remove",
                lines: ["", ""]
            });
        }
    };
    this.replace = function(range, text) {
        if (!(range instanceof Range))
            range = Range.fromPoints(range.start, range.end);
        if (text.length === 0 && range.isEmpty())
            return range.start;
        if (text == this.getTextRange(range))
            return range.end;

        this.remove(range);
        var end;
        if (text) {
            end = this.insert(range.start, text);
        }
        else {
            end = range.start;
        }
        
        return end;
    };
    this.applyDeltas = function(deltas) {
        for (var i=0; i<deltas.length; i++) {
            this.applyDelta(deltas[i]);
        }
    };
    this.revertDeltas = function(deltas) {
        for (var i=deltas.length-1; i>=0; i--) {
            this.revertDelta(deltas[i]);
        }
    };
    this.applyDelta = function(delta, doNotValidate) {
        var isInsert = delta.action == "insert";
        if (isInsert ? delta.lines.length <= 1 && !delta.lines[0]
            : !Range.comparePoints(delta.start, delta.end)) {
            return;
        }
        
        if (isInsert && delta.lines.length > 20000)
            this.$splitAndapplyLargeDelta(delta, 20000);
        applyDelta(this.$lines, delta, doNotValidate);
        this._signal("change", delta);
    };
    
    this.$splitAndapplyLargeDelta = function(delta, MAX) {
        var lines = delta.lines;
        var l = lines.length;
        var row = delta.start.row; 
        var column = delta.start.column;
        var from = 0, to = 0;
        do {
            from = to;
            to += MAX - 1;
            var chunk = lines.slice(from, to);
            if (to > l) {
                delta.lines = chunk;
                delta.start.row = row + from;
                delta.start.column = column;
                break;
            }
            chunk.push("");
            this.applyDelta({
                start: this.pos(row + from, column),
                end: this.pos(row + to, column = 0),
                action: delta.action,
                lines: chunk
            }, true);
        } while(true);
    };
    this.revertDelta = function(delta) {
        this.applyDelta({
            start: this.clonePos(delta.start),
            end: this.clonePos(delta.end),
            action: (delta.action == "insert" ? "remove" : "insert"),
            lines: delta.lines.slice()
        });
    };
    this.indexToPosition = function(index, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        for (var i = startRow || 0, l = lines.length; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
                return {row: i, column: index + lines[i].length + newlineLength};
        }
        return {row: l-1, column: lines[l-1].length};
    };
    this.positionToIndex = function(pos, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        var index = 0;
        var row = Math.min(pos.row, lines.length);
        for (var i = startRow || 0; i < row; ++i)
            index += lines[i].length + newlineLength;

        return index + pos.column;
    };

}).call(Document.prototype);

exports.Document = Document;
});

define("ace/lib/lang",["require","exports","module"], function(require, exports, module) {
"use strict";

exports.last = function(a) {
    return a[a.length - 1];
};

exports.stringReverse = function(string) {
    return string.split("").reverse().join("");
};

exports.stringRepeat = function (string, count) {
    var result = '';
    while (count > 0) {
        if (count & 1)
            result += string;

        if (count >>= 1)
            string += string;
    }
    return result;
};

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

exports.stringTrimLeft = function (string) {
    return string.replace(trimBeginRegexp, '');
};

exports.stringTrimRight = function (string) {
    return string.replace(trimEndRegexp, '');
};

exports.copyObject = function(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
};

exports.copyArray = function(array){
    var copy = [];
    for (var i=0, l=array.length; i<l; i++) {
        if (array[i] && typeof array[i] == "object")
            copy[i] = this.copyObject( array[i] );
        else 
            copy[i] = array[i];
    }
    return copy;
};

exports.deepCopy = function deepCopy(obj) {
    if (typeof obj !== "object" || !obj)
        return obj;
    var copy;
    if (Array.isArray(obj)) {
        copy = [];
        for (var key = 0; key < obj.length; key++) {
            copy[key] = deepCopy(obj[key]);
        }
        return copy;
    }
    var cons = obj.constructor;
    if (cons === RegExp)
        return obj;
    
    copy = cons();
    for (var key in obj) {
        copy[key] = deepCopy(obj[key]);
    }
    return copy;
};

exports.arrayToMap = function(arr) {
    var map = {};
    for (var i=0; i<arr.length; i++) {
        map[arr[i]] = 1;
    }
    return map;

};

exports.createMap = function(props) {
    var map = Object.create(null);
    for (var i in props) {
        map[i] = props[i];
    }
    return map;
};
exports.arrayRemove = function(array, value) {
  for (var i = 0; i <= array.length; i++) {
    if (value === array[i]) {
      array.splice(i, 1);
    }
  }
};

exports.escapeRegExp = function(str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};

exports.escapeHTML = function(str) {
    return str.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
};

exports.getMatchOffsets = function(string, regExp) {
    var matches = [];

    string.replace(regExp, function(str) {
        matches.push({
            offset: arguments[arguments.length-2],
            length: str.length
        });
    });

    return matches;
};
exports.deferredCall = function(fcn) {
    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var deferred = function(timeout) {
        deferred.cancel();
        timer = setTimeout(callback, timeout || 0);
        return deferred;
    };

    deferred.schedule = deferred;

    deferred.call = function() {
        this.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function() {
        clearTimeout(timer);
        timer = null;
        return deferred;
    };
    
    deferred.isPending = function() {
        return timer;
    };

    return deferred;
};


exports.delayedCall = function(fcn, defaultTimeout) {
    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var _self = function(timeout) {
        if (timer == null)
            timer = setTimeout(callback, timeout || defaultTimeout);
    };

    _self.delay = function(timeout) {
        timer && clearTimeout(timer);
        timer = setTimeout(callback, timeout || defaultTimeout);
    };
    _self.schedule = _self;

    _self.call = function() {
        this.cancel();
        fcn();
    };

    _self.cancel = function() {
        timer && clearTimeout(timer);
        timer = null;
    };

    _self.isPending = function() {
        return timer;
    };

    return _self;
};
});

define("ace/worker/mirror",["require","exports","module","ace/range","ace/document","ace/lib/lang"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
var Document = require("../document").Document;
var lang = require("../lib/lang");
    
var Mirror = exports.Mirror = function(sender) {
    this.sender = sender;
    var doc = this.doc = new Document("");
    
    var deferredUpdate = this.deferredUpdate = lang.delayedCall(this.onUpdate.bind(this));
    
    var _self = this;
    sender.on("change", function(e) {
        var data = e.data;
        if (data[0].start) {
            doc.applyDeltas(data);
        } else {
            for (var i = 0; i < data.length; i += 2) {
                if (Array.isArray(data[i+1])) {
                    var d = {action: "insert", start: data[i], lines: data[i+1]};
                } else {
                    var d = {action: "remove", start: data[i], end: data[i+1]};
                }
                doc.applyDelta(d, true);
            }
        }
        if (_self.$timeout)
            return deferredUpdate.schedule(_self.$timeout);
        _self.onUpdate();
    });
};

(function() {
    
    this.$timeout = 500;
    
    this.setTimeout = function(timeout) {
        this.$timeout = timeout;
    };
    
    this.setValue = function(value) {
        this.doc.setValue(value);
        this.deferredUpdate.schedule(this.$timeout);
    };
    
    this.getValue = function(callbackId) {
        this.sender.callback(this.doc.getValue(), callbackId);
    };
    
    this.onUpdate = function() {
    };
    
    this.isPending = function() {
        return this.deferredUpdate.isPending();
    };
    
}).call(Mirror.prototype);

});

define("ace/mode/php/php",["require","exports","module"], function(require, exports, module) {

var PHP = {Constants:{}};




PHP.Constants.T_INCLUDE = 262;
PHP.Constants.T_INCLUDE_ONCE = 261;
PHP.Constants.T_EVAL = 260;
PHP.Constants.T_REQUIRE = 259;
PHP.Constants.T_REQUIRE_ONCE = 258;
PHP.Constants.T_LOGICAL_OR = 263;
PHP.Constants.T_LOGICAL_XOR = 264;
PHP.Constants.T_LOGICAL_AND = 265;
PHP.Constants.T_PRINT = 266;
PHP.Constants.T_PLUS_EQUAL = 277;
PHP.Constants.T_MINUS_EQUAL = 276;
PHP.Constants.T_MUL_EQUAL = 275;
PHP.Constants.T_DIV_EQUAL = 274;
PHP.Constants.T_CONCAT_EQUAL = 273;
PHP.Constants.T_MOD_EQUAL = 272;
PHP.Constants.T_AND_EQUAL = 271;
PHP.Constants.T_OR_EQUAL = 270;
PHP.Constants.T_XOR_EQUAL = 269;
PHP.Constants.T_SL_EQUAL = 268;
PHP.Constants.T_SR_EQUAL = 267;
PHP.Constants.T_BOOLEAN_OR = 278;
PHP.Constants.T_BOOLEAN_AND = 279;
PHP.Constants.T_IS_EQUAL = 283;
PHP.Constants.T_IS_NOT_EQUAL = 282;
PHP.Constants.T_IS_IDENTICAL = 281;
PHP.Constants.T_IS_NOT_IDENTICAL = 280;
PHP.Constants.T_IS_SMALLER_OR_EQUAL = 285;
PHP.Constants.T_IS_GREATER_OR_EQUAL = 284;
PHP.Constants.T_SL = 287;
PHP.Constants.T_SR = 286;
PHP.Constants.T_INSTANCEOF = 288;
PHP.Constants.T_INC = 297;
PHP.Constants.T_DEC = 296;
PHP.Constants.T_INT_CAST = 295;
PHP.Constants.T_DOUBLE_CAST = 294;
PHP.Constants.T_STRING_CAST = 293;
PHP.Constants.T_ARRAY_CAST = 292;
PHP.Constants.T_OBJECT_CAST = 291;
PHP.Constants.T_BOOL_CAST = 290;
PHP.Constants.T_UNSET_CAST = 289;
PHP.Constants.T_NEW = 299;
PHP.Constants.T_CLONE = 298;
PHP.Constants.T_EXIT = 300;
PHP.Constants.T_IF = 301;
PHP.Constants.T_ELSEIF = 302;
PHP.Constants.T_ELSE = 303;
PHP.Constants.T_ENDIF = 304;
PHP.Constants.T_LNUMBER = 305;
PHP.Constants.T_DNUMBER = 306;
PHP.Constants.T_STRING = 307;
PHP.Constants.T_STRING_VARNAME = 308;
PHP.Constants.T_VARIABLE = 309;
PHP.Constants.T_NUM_STRING = 310;
PHP.Constants.T_INLINE_HTML = 311;
PHP.Constants.T_CHARACTER = 312;
PHP.Constants.T_BAD_CHARACTER = 313;
PHP.Constants.T_ENCAPSED_AND_WHITESPACE = 314;
PHP.Constants.T_CONSTANT_ENCAPSED_STRING = 315;
PHP.Constants.T_ECHO = 316;
PHP.Constants.T_DO = 317;
PHP.Constants.T_WHILE = 318;
PHP.Constants.T_ENDWHILE = 319;
PHP.Constants.T_FOR = 320;
PHP.Constants.T_ENDFOR = 321;
PHP.Constants.T_FOREACH = 322;
PHP.Constants.T_ENDFOREACH = 323;
PHP.Constants.T_DECLARE = 324;
PHP.Constants.T_ENDDECLARE = 325;
PHP.Constants.T_AS = 326;
PHP.Constants.T_SWITCH = 327;
PHP.Constants.T_ENDSWITCH = 328;
PHP.Constants.T_CASE = 329;
PHP.Constants.T_DEFAULT = 330;
PHP.Constants.T_BREAK = 331;
PHP.Constants.T_CONTINUE = 332;
PHP.Constants.T_GOTO = 333;
PHP.Constants.T_FUNCTION = 334;
PHP.Constants.T_CONST = 335;
PHP.Constants.T_RETURN = 336;
PHP.Constants.T_TRY = 337;
PHP.Constants.T_CATCH = 338;
PHP.Constants.T_THROW = 339;
PHP.Constants.T_USE = 340;
PHP.Constants.T_GLOBAL = 341;
PHP.Constants.T_STATIC = 347;
PHP.Constants.T_ABSTRACT = 346;
PHP.Constants.T_FINAL = 345;
PHP.Constants.T_PRIVATE = 344;
PHP.Constants.T_PROTECTED = 343;
PHP.Constants.T_PUBLIC = 342;
PHP.Constants.T_VAR = 348;
PHP.Constants.T_UNSET = 349;
PHP.Constants.T_ISSET = 350;
PHP.Constants.T_EMPTY = 351;
PHP.Constants.T_HALT_COMPILER = 352;
PHP.Constants.T_CLASS = 353;
PHP.Constants.T_TRAIT = 382;
PHP.Constants.T_INTERFACE = 354;
PHP.Constants.T_EXTENDS = 355;
PHP.Constants.T_IMPLEMENTS = 356;
PHP.Constants.T_OBJECT_OPERATOR = 357;
PHP.Constants.T_DOUBLE_ARROW = 358;
PHP.Constants.T_LIST = 359;
PHP.Constants.T_ARRAY = 360;
PHP.Constants.T_CLASS_C = 361;
PHP.Constants.T_TRAIT_C = 381;
PHP.Constants.T_METHOD_C = 362;
PHP.Constants.T_FUNC_C = 363;
PHP.Constants.T_LINE = 364;
PHP.Constants.T_FILE = 365;
PHP.Constants.T_COMMENT = 366;
PHP.Constants.T_DOC_COMMENT = 367;
PHP.Constants.T_OPEN_TAG = 368;
PHP.Constants.T_OPEN_TAG_WITH_ECHO = 369;
PHP.Constants.T_CLOSE_TAG = 370;
PHP.Constants.T_WHITESPACE = 371;
PHP.Constants.T_START_HEREDOC = 372;
PHP.Constants.T_END_HEREDOC = 373;
PHP.Constants.T_DOLLAR_OPEN_CURLY_BRACES = 374;
PHP.Constants.T_CURLY_OPEN = 375;
PHP.Constants.T_PAAMAYIM_NEKUDOTAYIM = 376;
PHP.Constants.T_DOUBLE_COLON = 376;
PHP.Constants.T_NAMESPACE = 377;
PHP.Constants.T_NS_C = 378;
PHP.Constants.T_DIR = 379;
PHP.Constants.T_NS_SEPARATOR = 380;
PHP.Lexer = function( src, ini ) {


    var heredoc,
    lineBreaker = function( result ) {
        if (result.match(/\n/) !== null) {
            var quote = result.substring(0, 1);
            result = '[' + result.split(/\n/).join( quote + "," + quote ) + '].join("\\n")';

        }

        return result;
    },
    prev,

    openTag = (ini === undefined || (/^(on|true|1)$/i.test(ini.short_open_tag) ) ? /(\<\?php\s|\<\?|\<\%|\<script language\=('|")?php('|")?\>)/i : /(\<\?php\s|<\?=|\<script language\=('|")?php('|")?\>)/i),
        openTagStart = (ini === undefined || (/^(on|true|1)$/i.test(ini.short_open_tag)) ? /^(\<\?php\s|\<\?|\<\%|\<script language\=('|")?php('|")?\>)/i : /^(\<\?php\s|<\?=|\<script language\=('|")?php('|")?\>)/i),
            tokens = [
            {
                value: PHP.Constants.T_NAMESPACE,
                re: /^namespace(?=\s)/i
            },
            {
                value: PHP.Constants.T_USE,
                re: /^use(?=\s)/i
            },
            {
                value: PHP.Constants.T_ABSTRACT,
                re: /^abstract(?=\s)/i
            },
            {
                value: PHP.Constants.T_IMPLEMENTS,
                re: /^implements(?=\s)/i
            },
            {
                value: PHP.Constants.T_INTERFACE,
                re: /^interface(?=\s)/i
            },
            {
                value: PHP.Constants.T_CONST,
                re: /^const(?=\s)/i
            },
            {
                value: PHP.Constants.T_STATIC,
                re: /^static(?=\s)/i
            },
            {
                value: PHP.Constants.T_FINAL,
                re: /^final(?=\s)/i
            },
            {
                value: PHP.Constants.T_VAR,
                re: /^var(?=\s)/i
            },
            {
                value: PHP.Constants.T_GLOBAL,
                re: /^global(?=\s)/i
            },
            {
                value: PHP.Constants.T_CLONE,
                re: /^clone(?=\s)/i
            },
            {
                value: PHP.Constants.T_THROW,
                re: /^throw(?=\s)/i
            },
            {
                value: PHP.Constants.T_EXTENDS,
                re: /^extends(?=\s)/i
            },
            {
                value: PHP.Constants.T_AND_EQUAL,
                re: /^&=/
            },
            {
                value: PHP.Constants.T_AS,
                re: /^as(?=\s)/i
            },
            {
                value: PHP.Constants.T_ARRAY_CAST,
                re: /^\(array\)/i
            },
            {
                value: PHP.Constants.T_BOOL_CAST,
                re: /^\((bool|boolean)\)/i
            },
            {
                value: PHP.Constants.T_DOUBLE_CAST,
                re: /^\((real|float|double)\)/i
            },
            {
                value: PHP.Constants.T_INT_CAST,
                re: /^\((int|integer)\)/i
            },
            {
                value: PHP.Constants.T_OBJECT_CAST,
                re: /^\(object\)/i
            },
            {
                value: PHP.Constants.T_STRING_CAST,
                re: /^\(string\)/i
            },
            {
                value: PHP.Constants.T_UNSET_CAST,
                re: /^\(unset\)/i
            },
            {
                value: PHP.Constants.T_TRY,
                re: /^try(?=\s*{)/i
            },
            {
                value: PHP.Constants.T_CATCH,
                re: /^catch(?=\s*\()/i
            },
            {
                value: PHP.Constants.T_INSTANCEOF,
                re: /^instanceof(?=\s)/i
            },
            {
                value: PHP.Constants.T_LOGICAL_OR,
                re: /^or(?=\s)/i
            },
            {
                value: PHP.Constants.T_LOGICAL_AND,
                re: /^and(?=\s)/i
            },
            {
                value: PHP.Constants.T_LOGICAL_XOR,
                re: /^xor(?=\s)/i
            },
            {
                value: PHP.Constants.T_BOOLEAN_AND,
                re: /^&&/
            },
            {
                value: PHP.Constants.T_BOOLEAN_OR,
                re: /^\|\|/
            },
            {
                value: PHP.Constants.T_CONTINUE,
                re: /^continue(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_BREAK,
                re: /^break(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDDECLARE,
                re: /^enddeclare(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDFOR,
                re: /^endfor(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDFOREACH,
                re: /^endforeach(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDIF,
                re: /^endif(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDSWITCH,
                re: /^endswitch(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_ENDWHILE,
                re: /^endwhile(?=\s|;)/i
            },
            {
                value: PHP.Constants.T_CASE,
                re: /^case(?=\s)/i
            },
            {
                value: PHP.Constants.T_DEFAULT,
                re: /^default(?=\s|:)/i
            },
            {
                value: PHP.Constants.T_SWITCH,
                re: /^switch(?=[ (])/i
            },
            {
                value: PHP.Constants.T_EXIT,
                re: /^(exit|die)(?=[ \(;])/i
            },
            {
                value: PHP.Constants.T_CLOSE_TAG,
                re: /^(\?\>|\%\>|\<\/script\>)\s?\s?/i,
                func: function( result ) {
                    insidePHP = false;
                    return result;
                }
            },
            {
                value: PHP.Constants.T_DOUBLE_ARROW,
                re: /^\=\>/
            },
            {
                value: PHP.Constants.T_DOUBLE_COLON,
                re: /^\:\:/
            },
            {
                value: PHP.Constants.T_METHOD_C,
                re: /^__METHOD__/
            },
            {
                value: PHP.Constants.T_LINE,
                re: /^__LINE__/
            },
            {
                value: PHP.Constants.T_FILE,
                re: /^__FILE__/
            },
            {
                value: PHP.Constants.T_FUNC_C,
                re: /^__FUNCTION__/
            },
            {
                value: PHP.Constants.T_NS_C,
                re: /^__NAMESPACE__/
            },
            {
                value: PHP.Constants.T_TRAIT_C,
                re: /^__TRAIT__/
            },
            {
                value: PHP.Constants.T_DIR,
                re: /^__DIR__/
            },
            {
                value: PHP.Constants.T_CLASS_C,
                re: /^__CLASS__/
            },
            {
                value: PHP.Constants.T_INC,
                re: /^\+\+/
            },
            {
                value: PHP.Constants.T_DEC,
                re: /^\-\-/
            },
            {
                value: PHP.Constants.T_CONCAT_EQUAL,
                re: /^\.\=/
            },
            {
                value: PHP.Constants.T_DIV_EQUAL,
                re: /^\/\=/
            },
            {
                value: PHP.Constants.T_XOR_EQUAL,
                re: /^\^\=/
            },
            {
                value: PHP.Constants.T_MUL_EQUAL,
                re: /^\*\=/
            },
            {
                value: PHP.Constants.T_MOD_EQUAL,
                re: /^\%\=/
            },
            {
                value: PHP.Constants.T_SL_EQUAL,
                re: /^<<=/
            },
            {
                value: PHP.Constants.T_START_HEREDOC,
                re: /^<<<[A-Z_0-9]+\s/i,
                func: function( result ){
                    heredoc = result.substring(3, result.length - 1);
                    return result;
                }
            },
            {
                value: PHP.Constants.T_SL,
                re: /^<</
            },
            {
                value: PHP.Constants.T_IS_SMALLER_OR_EQUAL,
                re: /^<=/
            },
            {
                value: PHP.Constants.T_SR_EQUAL,
                re: /^>>=/
            },
            {
                value: PHP.Constants.T_SR,
                re: /^>>/
            },
            {
                value: PHP.Constants.T_IS_GREATER_OR_EQUAL,
                re: /^>=/
            },
            {
                value: PHP.Constants.T_OR_EQUAL,
                re: /^\|\=/
            },
            {
                value: PHP.Constants.T_PLUS_EQUAL,
                re: /^\+\=/
            },
            {
                value: PHP.Constants.T_MINUS_EQUAL,
                re: /^-\=/
            },
            {
                value: PHP.Constants.T_OBJECT_OPERATOR,
                re: /^\-\>/i
            },
            {
                value: PHP.Constants.T_CLASS,
                re: /^class(?=[\s\{])/i,
                afterWhitespace: true
            },
            {
                value: PHP.Constants.T_TRAIT,
                re: /^trait(?=[\s]+[A-Za-z])/i,
            },
            {
                value: PHP.Constants.T_PUBLIC,
                re: /^public(?=[\s])/i
            },
            {
                value: PHP.Constants.T_PRIVATE,
                re: /^private(?=[\s])/i
            },
            {
                value: PHP.Constants.T_PROTECTED,
                re: /^protected(?=[\s])/i
            },
            {
                value: PHP.Constants.T_ARRAY,
                re: /^array(?=\s*?\()/i
            },
            {
                value: PHP.Constants.T_EMPTY,
                re: /^empty(?=[ \(])/i
            },
            {
                value: PHP.Constants.T_ISSET,
                re: /^isset(?=[ \(])/i
            },
            {
                value: PHP.Constants.T_UNSET,
                re: /^unset(?=[ \(])/i
            },
            {
                value: PHP.Constants.T_RETURN,
                re: /^return(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_FUNCTION,
                re: /^function(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_ECHO,
                re: /^echo(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_LIST,
                re: /^list(?=\s*?\()/i
            },
            {
                value: PHP.Constants.T_PRINT,
                re: /^print(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_INCLUDE,
                re: /^include(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_INCLUDE_ONCE,
                re: /^include_once(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_REQUIRE,
                re: /^require(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_REQUIRE_ONCE,
                re: /^require_once(?=[ "'(;])/i
            },
            {
                value: PHP.Constants.T_NEW,
                re: /^new(?=[ ])/i
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\/\*([\S\s]*?)(?:\*\/|$)/
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\/\/.*(\s)?/
            },
            {
                value: PHP.Constants.T_COMMENT,
                re: /^\#.*(\s)?/
            },
            {
                value: PHP.Constants.T_ELSEIF,
                re: /^elseif(?=[\s(])/i
            },
            {
                value: PHP.Constants.T_GOTO,
                re: /^goto(?=[\s(])/i
            },
            {
                value: PHP.Constants.T_ELSE,
                re: /^else(?=[\s{:])/i
            },
            {
                value: PHP.Constants.T_IF,
                re: /^if(?=[\s(])/i
            },
            {
                value: PHP.Constants.T_DO,
                re: /^do(?=[ {])/i
            },
            {
                value: PHP.Constants.T_WHILE,
                re: /^while(?=[ (])/i
            },
            {
                value: PHP.Constants.T_FOREACH,
                re: /^foreach(?=[ (])/i
            },
            {
                value: PHP.Constants.T_ISSET,
                re: /^isset(?=[ (])/i
            },
            {
                value: PHP.Constants.T_IS_IDENTICAL,
                re: /^===/
            },
            {
                value: PHP.Constants.T_IS_EQUAL,
                re: /^==/
            },
            {
                value: PHP.Constants.T_IS_NOT_IDENTICAL,
                re: /^\!==/
            },
            {
                value: PHP.Constants.T_IS_NOT_EQUAL,
                re: /^(\!=|\<\>)/
            },
            {
                value: PHP.Constants.T_FOR,
                re: /^for(?=[ (])/i
            },

            {
                value: PHP.Constants.T_DNUMBER,
                re: /^[0-9]*\.[0-9]+([eE][-]?[0-9]*)?/

            },
            {
                value: PHP.Constants.T_LNUMBER,
                re: /^(0x[0-9A-F]+|[0-9]+)/i
            },
            {
                value: PHP.Constants.T_OPEN_TAG_WITH_ECHO,
                re: /^(\<\?=|\<\%=)/i
            },
            {
                value: PHP.Constants.T_OPEN_TAG,
                re: openTagStart
            },
            {
                value: PHP.Constants.T_VARIABLE,
                re: /^\$[a-zA-Z_\x7f-\uffff][a-zA-Z0-9_\x7f-\uffff]*/
            },
            {
                value: PHP.Constants.T_WHITESPACE,
                re: /^\s+/
            },
            {
                value: PHP.Constants.T_CONSTANT_ENCAPSED_STRING,
                re: /^("(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*')/,
                func: function( result, token ) {

                    var curlyOpen = 0,
                    len,
                    bracketOpen = 0;

                    if (result.substring( 0,1 ) === "'") {
                        return result;
                    }

                    var match = result.match( /(?:[^\\]|\\.)*[^\\]\$[a-zA-Z_\x7f-\uffff][a-zA-Z0-9_\x7f-\uffff]*/g );
                    if ( match !== null ) {

                        while( result.length > 0 ) {
                            len = result.length;
                            match = result.match( /^[\[\]\;\:\?\(\)\!\.\,\>\<\=\+\-\/\*\|\&\@\^\%\"\'\{\}]/ );

                            if ( match !== null ) {

                                results.push( match[ 0 ] );
                                result = result.substring( 1 );

                                if ( curlyOpen > 0 && match[ 0 ] === "}") {
                                    curlyOpen--;
                                }

                                if ( match[ 0 ] === "[" ) {
                                    bracketOpen++;
                                }

                                if ( match[ 0 ] === "]" ) {
                                    bracketOpen--;
                                }

                            }

                            match = result.match(/^\$[a-zA-Z_\x7f-\uffff][a-zA-Z0-9_\x7f-\uffff]*/);



                            if ( match !== null ) {

                                results.push([
                                    parseInt(PHP.Constants.T_VARIABLE, 10),
                                    match[ 0 ],
                                    line
                                    ]);

                                result = result.substring( match[ 0 ].length );

                                match = result.match(/^(\-\>)\s*([a-zA-Z_\x7f-\uffff][a-zA-Z0-9_\x7f-\uffff]*)\s*(\()/);

                                if ( match !== null ) {

                                    results.push([
                                        parseInt(PHP.Constants.T_OBJECT_OPERATOR, 10),
                                        match[ 1 ],
                                        line
                                        ]);
                                    results.push([
                                        parseInt(PHP.Constants.T_STRING, 10),
                                        match[ 2 ],
                                        line
                                        ]);
                                    if (match[3]) {
                                        results.push(match[3]);
                                    }
                                    result = result.substring( match[ 0 ].length );
                                }


                                if ( result.match( /^\[/g ) !== null ) {
                                    continue;
                                }
                            }

                            var re;
                            if ( curlyOpen > 0) {
                                re = /^([^\\\$"{}\]\(\)\->]|\\.)+/g;
                            } else {
                                re = /^([^\\\$"{]|\\.|{[^\$]|\$(?=[^a-zA-Z_\x7f-\uffff]))+/g;;
                            }

                            var type, match2;
                            while(( match = result.match( re )) !== null ) {
                                if (result.length === 1) {
                                    throw new Error(match);
                                }
                                
                                type = 0;

                                if( curlyOpen > 0 ){
                                    if( match2 = match[0].match(/^[\[\]\;\:\?\(\)\!\.\,\>\<\=\+\-\/\*\|\&\{\}\@\^\%\$\~]/) ){
                                        results.push(match2[0]);
                                    }else{                                    
                                        type = PHP.Constants.T_STRING;    
                                    }
                                }else{
                                    type = PHP.Constants.T_ENCAPSED_AND_WHITESPACE;
                                }
                                
                                if( type ){
                                    results.push([
                                        parseInt(type, 10),
                                        match[ 0 ].replace(/\n/g,"\\n").replace(/\r/g,""),
                                        line
                                        ]);
                                }

                                line += match[ 0 ].split('\n').length - 1;

                                result = result.substring( match[ 0 ].length );
                            }

                            if( curlyOpen > 0 && result.match(/^\->/) !== null ) {
                                results.push([
                                    parseInt(PHP.Constants.T_OBJECT_OPERATOR, 10),
                                    '->',
                                    line
                                    ]);
                                result = result.substring( 2 );
                            }

                            if( result.match(/^{\$/) !== null ) {
                                results.push([
                                    parseInt(PHP.Constants.T_CURLY_OPEN, 10),
                                    "{",
                                    line
                                    ]);
                                result = result.substring( 1 );
                                curlyOpen++;
                            }

                            if (len === result.length) {
                                if ((match =  result.match( /^(([^\\]|\\.)*?[^\\]\$[a-zA-Z_\x7f-\uffff][a-zA-Z0-9_\x7f-\uffff]*)/g )) !== null) {
                                    return;
                                }
                            }

                        }

                        return undefined;

                    } else {
                        result = result.replace(/\r/g,"");
                    }
                    return result;
                }
            },
            {
                value: PHP.Constants.T_NS_SEPARATOR,
                re: /^\\(?=[a-zA-Z_])/
            },
            {
                value: PHP.Constants.T_STRING,
                re: /^[a-zA-Z_\x7f-\uffff][a-zA-Z0-9_\x7f-\uffff]*/
            },
            {
                value: -1,
                re: /^[\[\]\;\:\?\(\)\!\.\,\>\<\=\+\-\/\*\|\&\{\}\@\^\%\"\'\$\~]/
            }];





            var results = [],
            line = 1,
            insidePHP = false,
            cancel = true;

            if ( src === null ) {
                return results;
            }

            if ( typeof src !== "string" ) {
                src = src.toString();
            }



            while (src.length > 0 && cancel === true) {

                if ( insidePHP === true ) {

                    if ( heredoc !== undefined ) {

                        var regexp = new RegExp('([\\S\\s]*?)(\\r\\n|\\n|\\r)(' + heredoc + ')(;|\\r\\n|\\n)',"i");



                        var result = src.match( regexp );
                        if ( result !== null ) {

                            results.push([
                                parseInt(PHP.Constants.T_ENCAPSED_AND_WHITESPACE, 10),
                                result[ 1 ].replace(/^\n/g,"").replace(/\\\$/g,"$") + "\n",
                                line
                                ]);
                            line += result[ 1 ].split('\n').length;
                            results.push([
                                parseInt(PHP.Constants.T_END_HEREDOC, 10),
                                result[ 3 ],
                                line
                                ]);

                            src = src.substring( result[1].length + result[2].length + result[3].length );
                            heredoc = undefined;
                        }

                        if (result === null) {
                            throw Error("sup");
                        }


                    } else {
                        cancel =  tokens.some(function( token ){
                            if ( token.afterWhitespace === true ) {
                                var last = results[ results.length - 1 ];
                                if ( !Array.isArray( last ) || (last[ 0 ] !== PHP.Constants.T_WHITESPACE && last[ 0 ] !== PHP.Constants.T_OPEN_TAG  && last[ 0 ] !== PHP.Constants.T_COMMENT)) {
                                    return false;
                                }
                            }
                            var result = src.match( token.re );

                            if ( result !== null ) {
                                if ( token.value !== -1) {
                                    var resultString = result[ 0 ];



                                    if (token.func !== undefined ) {
                                        resultString = token.func( resultString, token );
                                    }
                                    if (resultString !== undefined ) {

                                        results.push([
                                            parseInt(token.value, 10),
                                            resultString,
                                            line
                                            ]);
                                        line += resultString.split('\n').length - 1;
                                    }

                                } else {
                                    results.push( result[ 0 ] );
                                }

                                src = src.substring(result[ 0 ].length);

                                return true;
                            }
                            return false;


                        });
                    }

                } else {

                    var result = openTag.exec( src );


                    if ( result !== null ) {
                        if ( result.index > 0 ) {
                            var resultString = src.substring(0, result.index);
                            results.push ([
                                parseInt(PHP.Constants.T_INLINE_HTML, 10),
                                resultString,
                                line
                                ]);

                            line += resultString.split('\n').length - 1;

                            src = src.substring( result.index );
                        }

                        insidePHP = true;
                    } else {

                        results.push ([
                            parseInt(PHP.Constants.T_INLINE_HTML, 10),
                            src.replace(/^\n/, ""),
                            line
                            ]);
                        return results;
                    }

                }



            }



            return results;



        };


PHP.Parser = function ( preprocessedTokens, eval ) {

    var yybase = this.yybase,
    yydefault = this.yydefault,
    yycheck = this.yycheck,
    yyaction = this.yyaction,
    yylen = this.yylen,
    yygbase = this.yygbase,
    yygcheck = this.yygcheck,
    yyp = this.yyp,
    yygoto = this.yygoto,
    yylhs = this.yylhs,
    terminals = this.terminals,
    translate = this.translate,
    yygdefault = this.yygdefault;


    this.pos = -1;
    this.line = 1;

    this.tokenMap = this.createTokenMap( );

    this.dropTokens = {};
    this.dropTokens[ PHP.Constants.T_WHITESPACE ] = 1;
    this.dropTokens[ PHP.Constants.T_OPEN_TAG ] = 1;
    var tokens = [];
    preprocessedTokens.forEach( function( token, index ) {
        if ( typeof token === "object" && token[ 0 ] === PHP.Constants.T_OPEN_TAG_WITH_ECHO) {
            tokens.push([
                PHP.Constants.T_OPEN_TAG,
                token[ 1 ],
                token[ 2 ]
                ]);
            tokens.push([
                PHP.Constants.T_ECHO,
                token[ 1 ],
                token[ 2 ]
                ]);
        } else {
            tokens.push( token );
        }
    });
    this.tokens = tokens;
    var tokenId = this.TOKEN_NONE;
    this.startAttributes = {
        'startLine': 1
    };

    this.endAttributes = {};
    var attributeStack = [ this.startAttributes ];
    var state = 0;
    var stateStack = [ state ];
    this.yyastk = [];
    this.stackPos  = 0;

    var yyn;

    var origTokenId;


    for (;;) {

        if ( yybase[ state ] === 0 ) {
            yyn = yydefault[ state ];
        } else {
            if (tokenId === this.TOKEN_NONE ) {
                origTokenId = this.getNextToken( );
                tokenId = (origTokenId >= 0 && origTokenId < this.TOKEN_MAP_SIZE) ? translate[ origTokenId ] : this.TOKEN_INVALID;

                attributeStack[ this.stackPos ] = this.startAttributes;
            }

            if (((yyn = yybase[ state ] + tokenId) >= 0
                && yyn < this.YYLAST && yycheck[ yyn ] === tokenId
                || (state < this.YY2TBLSTATE
                    && (yyn = yybase[state + this.YYNLSTATES] + tokenId) >= 0
                    && yyn < this.YYLAST
                    && yycheck[ yyn ] === tokenId))
            && (yyn = yyaction[ yyn ]) !== this.YYDEFAULT ) {
                if (yyn > 0) {
                    ++this.stackPos;

                    stateStack[ this.stackPos ] = state = yyn;
                    this.yyastk[ this.stackPos ] = this.tokenValue;
                    attributeStack[ this.stackPos ] = this.startAttributes;
                    tokenId = this.TOKEN_NONE;

                    if (yyn < this.YYNLSTATES)
                        continue;
                    yyn -= this.YYNLSTATES;
                } else {
                    yyn = -yyn;
                }
            } else {
                yyn = yydefault[ state ];
            }
        }

        for (;;) {

            if ( yyn === 0 ) {
                return this.yyval;
            } else if (yyn !== this.YYUNEXPECTED ) {
                for (var attr in this.endAttributes) {
                    attributeStack[ this.stackPos - yylen[ yyn ] ][ attr ] = this.endAttributes[ attr ];
                }
                try {
                    this['yyn' + yyn](attributeStack[ this.stackPos - yylen[ yyn ] ]);
                } catch (e) {
                    throw e;
                }
                this.stackPos -= yylen[ yyn ];
                yyn = yylhs[ yyn ];
                if ((yyp = yygbase[ yyn ] + stateStack[ this.stackPos ]) >= 0
                    && yyp < this.YYGLAST
                    && yygcheck[ yyp ] === yyn) {
                    state = yygoto[ yyp ];
                } else {
                    state = yygdefault[ yyn ];
                }

                ++this.stackPos;

                stateStack[ this.stackPos ] = state;
                this.yyastk[ this.stackPos ] = this.yyval;
                attributeStack[ this.stackPos ] = this.startAttributes;
            } else {
                if (eval !== true) {

                    var expected = [];

                    for (var i = 0; i < this.TOKEN_MAP_SIZE; ++i) {
                        if ((yyn = yybase[ state ] + i) >= 0 && yyn < this.YYLAST && yycheck[ yyn ] == i
                         || state < this.YY2TBLSTATE
                            && (yyn = yybase[ state + this.YYNLSTATES] + i)
                            && yyn < this.YYLAST && yycheck[ yyn ] == i
                        ) {
                            if (yyaction[ yyn ] != this.YYUNEXPECTED) {
                                if (expected.length == 4) {
                                    expected = [];
                                    break;
                                }

                                expected.push( this.terminals[ i ] );
                            }
                        }
                    }

                    var expectedString = '';
                    if (expected.length) {
                        expectedString = ', expecting ' + expected.join(' or ');
                    }
                    throw new PHP.ParseError('syntax error, unexpected ' + terminals[ tokenId ] + expectedString, this.startAttributes['startLine']);
                } else {
                    return this.startAttributes['startLine'];
                }

            }

            if (state < this.YYNLSTATES)
                break;
            yyn = state - this.YYNLSTATES;
        }
    }
};

PHP.ParseError = function( msg, line ) {
    this.message = msg;
    this.line = line;
};

PHP.Parser.prototype.MODIFIER_PUBLIC    =  1;
PHP.Parser.prototype.MODIFIER_PROTECTED =  2;
PHP.Parser.prototype.MODIFIER_PRIVATE   =  4;
PHP.Parser.prototype.MODIFIER_STATIC    =  8;
PHP.Parser.prototype.MODIFIER_ABSTRACT  = 16;
PHP.Parser.prototype.MODIFIER_FINAL     = 32;

PHP.Parser.prototype.getNextToken = function( ) {

    this.startAttributes = {};
    this.endAttributes = {};

    var token,
    tmp;

    while (this.tokens[++this.pos] !== undefined) {
        token = this.tokens[this.pos];

        if (typeof token === "string") {
            this.startAttributes['startLine'] = this.line;
            this.endAttributes['endLine'] = this.line;
            if ('b"' === token) {
                this.tokenValue = 'b"';
                return '"'.charCodeAt(0);
            } else {
                this.tokenValue = token;
                return token.charCodeAt(0);
            }
        } else {



            this.line += ((tmp = token[ 1 ].match(/\n/g)) === null) ? 0 : tmp.length;

            if (PHP.Constants.T_COMMENT === token[0]) {

                if (!Array.isArray(this.startAttributes['comments'])) {
                    this.startAttributes['comments'] = [];
                }

                this.startAttributes['comments'].push( {
                    type: "comment",
                    comment: token[1],
                    line: token[2]
                });

            } else if (PHP.Constants.T_DOC_COMMENT === token[0]) {
                this.startAttributes['comments'].push( new PHPParser_Comment_Doc(token[1], token[2]) );
            } else if (this.dropTokens[token[0]] === undefined) {
                this.tokenValue = token[1];
                this.startAttributes['startLine'] = token[2];
                this.endAttributes['endLine'] = this.line;

                return this.tokenMap[token[0]];
            }
        }
    }

    this.startAttributes['startLine'] = this.line;
    return 0;
};

PHP.Parser.prototype.tokenName = function( token ) {
    var constants = ["T_INCLUDE","T_INCLUDE_ONCE","T_EVAL","T_REQUIRE","T_REQUIRE_ONCE","T_LOGICAL_OR","T_LOGICAL_XOR","T_LOGICAL_AND","T_PRINT","T_PLUS_EQUAL","T_MINUS_EQUAL","T_MUL_EQUAL","T_DIV_EQUAL","T_CONCAT_EQUAL","T_MOD_EQUAL","T_AND_EQUAL","T_OR_EQUAL","T_XOR_EQUAL","T_SL_EQUAL","T_SR_EQUAL","T_BOOLEAN_OR","T_BOOLEAN_AND","T_IS_EQUAL","T_IS_NOT_EQUAL","T_IS_IDENTICAL","T_IS_NOT_IDENTICAL","T_IS_SMALLER_OR_EQUAL","T_IS_GREATER_OR_EQUAL","T_SL","T_SR","T_INSTANCEOF","T_INC","T_DEC","T_INT_CAST","T_DOUBLE_CAST","T_STRING_CAST","T_ARRAY_CAST","T_OBJECT_CAST","T_BOOL_CAST","T_UNSET_CAST","T_NEW","T_CLONE","T_EXIT","T_IF","T_ELSEIF","T_ELSE","T_ENDIF","T_LNUMBER","T_DNUMBER","T_STRING","T_STRING_VARNAME","T_VARIABLE","T_NUM_STRING","T_INLINE_HTML","T_CHARACTER","T_BAD_CHARACTER","T_ENCAPSED_AND_WHITESPACE","T_CONSTANT_ENCAPSED_STRING","T_ECHO","T_DO","T_WHILE","T_ENDWHILE","T_FOR","T_ENDFOR","T_FOREACH","T_ENDFOREACH","T_DECLARE","T_ENDDECLARE","T_AS","T_SWITCH","T_ENDSWITCH","T_CASE","T_DEFAULT","T_BREAK","T_CONTINUE","T_GOTO","T_FUNCTION","T_CONST","T_RETURN","T_TRY","T_CATCH","T_THROW","T_USE","T_INSTEADOF","T_GLOBAL","T_STATIC","T_ABSTRACT","T_FINAL","T_PRIVATE","T_PROTECTED","T_PUBLIC","T_VAR","T_UNSET","T_ISSET","T_EMPTY","T_HALT_COMPILER","T_CLASS","T_TRAIT","T_INTERFACE","T_EXTENDS","T_IMPLEMENTS","T_OBJECT_OPERATOR","T_DOUBLE_ARROW","T_LIST","T_ARRAY","T_CALLABLE","T_CLASS_C","T_TRAIT_C","T_METHOD_C","T_FUNC_C","T_LINE","T_FILE","T_COMMENT","T_DOC_COMMENT","T_OPEN_TAG","T_OPEN_TAG_WITH_ECHO","T_CLOSE_TAG","T_WHITESPACE","T_START_HEREDOC","T_END_HEREDOC","T_DOLLAR_OPEN_CURLY_BRACES","T_CURLY_OPEN","T_PAAMAYIM_NEKUDOTAYIM","T_DOUBLE_COLON","T_NAMESPACE","T_NS_C","T_DIR","T_NS_SEPARATOR"];
    var current = "UNKNOWN";
    constants.some(function( constant ) {
        if (PHP.Constants[ constant ] === token) {
            current = constant;
            return true;
        } else {
            return false;
        }
    });

    return current;
};

PHP.Parser.prototype.createTokenMap = function() {
    var tokenMap = {},
    name,
    i;
    var T_DOUBLE_COLON = PHP.Constants.T_PAAMAYIM_NEKUDOTAYIM;
    for ( i = 256; i < 1000; ++i ) {
        if ( T_DOUBLE_COLON === i ) {
            tokenMap[ i ] = this.T_PAAMAYIM_NEKUDOTAYIM;
        } else if( PHP.Constants.T_OPEN_TAG_WITH_ECHO === i ) {
            tokenMap[ i ] = PHP.Constants.T_ECHO;
        } else if( PHP.Constants.T_CLOSE_TAG === i ) {
            tokenMap[ i ] = 59;
        } else if ( 'UNKNOWN' !== (name = this.tokenName( i ) ) ) { 
            tokenMap[ i ] =  this[name];
        }
    }
    return tokenMap;
};

var yynStandard = function () {
    this.yyval =  this.yyastk[ this.stackPos-(1-1) ];
};

PHP.Parser.prototype.MakeArray = function( arr ) {
    return Array.isArray( arr ) ? arr : [ arr ];
}


PHP.Parser.prototype.parseString = function( str ) {
    var bLength = 0;
    if ('b' === str[0]) {
        bLength = 1;
    }

    if ('\'' === str[ bLength ]) {
        str = str.replace(
            ['\\\\', '\\\''],
            [  '\\',   '\'']);
    } else {

        str = this.parseEscapeSequences( str, '"');

    }

    return str;

};

PHP.Parser.prototype.parseEscapeSequences = function( str, quote ) {



    if (undefined !== quote) {
        str = str.replace(new RegExp('\\' + quote, "g"), quote);
    }

    var replacements = {
        '\\': '\\',
        '$':  '$',
        'n': "\n",
        'r': "\r",
        't': "\t",
        'f': "\f",
        'v': "\v",
        'e': "\x1B"
    };

    return str.replace(
        /~\\\\([\\\\$nrtfve]|[xX][0-9a-fA-F]{1,2}|[0-7]{1,3})~/g,
        function ( matches ){
            var str = matches[1];

            if ( replacements[ str ] !== undefined ) {
                return replacements[ str ];
            } else if ('x' === str[ 0 ] || 'X' === str[ 0 ]) {
                return chr(hexdec(str));
            } else {
                return chr(octdec(str));
            }
        }
    );
};

PHP.Parser.prototype.TOKEN_NONE    = -1;
PHP.Parser.prototype.TOKEN_INVALID = 149;

PHP.Parser.prototype.TOKEN_MAP_SIZE = 384;

PHP.Parser.prototype.YYLAST       = 913;
PHP.Parser.prototype.YY2TBLSTATE  = 328;
PHP.Parser.prototype.YYGLAST      = 415;
PHP.Parser.prototype.YYNLSTATES   = 544;
PHP.Parser.prototype.YYUNEXPECTED = 32767;
PHP.Parser.prototype.YYDEFAULT    = -32766;
PHP.Parser.prototype.YYERRTOK = 256;
PHP.Parser.prototype.T_INCLUDE = 257;
PHP.Parser.prototype.T_INCLUDE_ONCE = 258;
PHP.Parser.prototype.T_EVAL = 259;
PHP.Parser.prototype.T_REQUIRE = 260;
PHP.Parser.prototype.T_REQUIRE_ONCE = 261;
PHP.Parser.prototype.T_LOGICAL_OR = 262;
PHP.Parser.prototype.T_LOGICAL_XOR = 263;
PHP.Parser.prototype.T_LOGICAL_AND = 264;
PHP.Parser.prototype.T_PRINT = 265;
PHP.Parser.prototype.T_PLUS_EQUAL = 266;
PHP.Parser.prototype.T_MINUS_EQUAL = 267;
PHP.Parser.prototype.T_MUL_EQUAL = 268;
PHP.Parser.prototype.T_DIV_EQUAL = 269;
PHP.Parser.prototype.T_CONCAT_EQUAL = 270;
PHP.Parser.prototype.T_MOD_EQUAL = 271;
PHP.Parser.prototype.T_AND_EQUAL = 272;
PHP.Parser.prototype.T_OR_EQUAL = 273;
PHP.Parser.prototype.T_XOR_EQUAL = 274;
PHP.Parser.prototype.T_SL_EQUAL = 275;
PHP.Parser.prototype.T_SR_EQUAL = 276;
PHP.Parser.prototype.T_BOOLEAN_OR = 277;
PHP.Parser.prototype.T_BOOLEAN_AND = 278;
PHP.Parser.prototype.T_IS_EQUAL = 279;
PHP.Parser.prototype.T_IS_NOT_EQUAL = 280;
PHP.Parser.prototype.T_IS_IDENTICAL = 281;
PHP.Parser.prototype.T_IS_NOT_IDENTICAL = 282;
PHP.Parser.prototype.T_IS_SMALLER_OR_EQUAL = 283;
PHP.Parser.prototype.T_IS_GREATER_OR_EQUAL = 284;
PHP.Parser.prototype.T_SL = 285;
PHP.Parser.prototype.T_SR = 286;
PHP.Parser.prototype.T_INSTANCEOF = 287;
PHP.Parser.prototype.T_INC = 288;
PHP.Parser.prototype.T_DEC = 289;
PHP.Parser.prototype.T_INT_CAST = 290;
PHP.Parser.prototype.T_DOUBLE_CAST = 291;
PHP.Parser.prototype.T_STRING_CAST = 292;
PHP.Parser.prototype.T_ARRAY_CAST = 293;
PHP.Parser.prototype.T_OBJECT_CAST = 294;
PHP.Parser.prototype.T_BOOL_CAST = 295;
PHP.Parser.prototype.T_UNSET_CAST = 296;
PHP.Parser.prototype.T_NEW = 297;
PHP.Parser.prototype.T_CLONE = 298;
PHP.Parser.prototype.T_EXIT = 299;
PHP.Parser.prototype.T_IF = 300;
PHP.Parser.prototype.T_ELSEIF = 301;
PHP.Parser.prototype.T_ELSE = 302;
PHP.Parser.prototype.T_ENDIF = 303;
PHP.Parser.prototype.T_LNUMBER = 304;
PHP.Parser.prototype.T_DNUMBER = 305;
PHP.Parser.prototype.T_STRING = 306;
PHP.Parser.prototype.T_STRING_VARNAME = 307;
PHP.Parser.prototype.T_VARIABLE = 308;
PHP.Parser.prototype.T_NUM_STRING = 309;
PHP.Parser.prototype.T_INLINE_HTML = 310;
PHP.Parser.prototype.T_CHARACTER = 311;
PHP.Parser.prototype.T_BAD_CHARACTER = 312;
PHP.Parser.prototype.T_ENCAPSED_AND_WHITESPACE = 313;
PHP.Parser.prototype.T_CONSTANT_ENCAPSED_STRING = 314;
PHP.Parser.prototype.T_ECHO = 315;
PHP.Parser.prototype.T_DO = 316;
PHP.Parser.prototype.T_WHILE = 317;
PHP.Parser.prototype.T_ENDWHILE = 318;
PHP.Parser.prototype.T_FOR = 319;
PHP.Parser.prototype.T_ENDFOR = 320;
PHP.Parser.prototype.T_FOREACH = 321;
PHP.Parser.prototype.T_ENDFOREACH = 322;
PHP.Parser.prototype.T_DECLARE = 323;
PHP.Parser.prototype.T_ENDDECLARE = 324;
PHP.Parser.prototype.T_AS = 325;
PHP.Parser.prototype.T_SWITCH = 326;
PHP.Parser.prototype.T_ENDSWITCH = 327;
PHP.Parser.prototype.T_CASE = 328;
PHP.Parser.prototype.T_DEFAULT = 329;
PHP.Parser.prototype.T_BREAK = 330;
PHP.Parser.prototype.T_CONTINUE = 331;
PHP.Parser.prototype.T_GOTO = 332;
PHP.Parser.prototype.T_FUNCTION = 333;
PHP.Parser.prototype.T_CONST = 334;
PHP.Parser.prototype.T_RETURN = 335;
PHP.Parser.prototype.T_TRY = 336;
PHP.Parser.prototype.T_CATCH = 337;
PHP.Parser.prototype.T_THROW = 338;
PHP.Parser.prototype.T_USE = 339;
PHP.Parser.prototype.T_INSTEADOF = 340;
PHP.Parser.prototype.T_GLOBAL = 341;
PHP.Parser.prototype.T_STATIC = 342;
PHP.Parser.prototype.T_ABSTRACT = 343;
PHP.Parser.prototype.T_FINAL = 344;
PHP.Parser.prototype.T_PRIVATE = 345;
PHP.Parser.prototype.T_PROTECTED = 346;
PHP.Parser.prototype.T_PUBLIC = 347;
PHP.Parser.prototype.T_VAR = 348;
PHP.Parser.prototype.T_UNSET = 349;
PHP.Parser.prototype.T_ISSET = 350;
PHP.Parser.prototype.T_EMPTY = 351;
PHP.Parser.prototype.T_HALT_COMPILER = 352;
PHP.Parser.prototype.T_CLASS = 353;
PHP.Parser.prototype.T_TRAIT = 354;
PHP.Parser.prototype.T_INTERFACE = 355;
PHP.Parser.prototype.T_EXTENDS = 356;
PHP.Parser.prototype.T_IMPLEMENTS = 357;
PHP.Parser.prototype.T_OBJECT_OPERATOR = 358;
PHP.Parser.prototype.T_DOUBLE_ARROW = 359;
PHP.Parser.prototype.T_LIST = 360;
PHP.Parser.prototype.T_ARRAY = 361;
PHP.Parser.prototype.T_CALLABLE = 362;
PHP.Parser.prototype.T_CLASS_C = 363;
PHP.Parser.prototype.T_TRAIT_C = 364;
PHP.Parser.prototype.T_METHOD_C = 365;
PHP.Parser.prototype.T_FUNC_C = 366;
PHP.Parser.prototype.T_LINE = 367;
PHP.Parser.prototype.T_FILE = 368;
PHP.Parser.prototype.T_COMMENT = 369;
PHP.Parser.prototype.T_DOC_COMMENT = 370;
PHP.Parser.prototype.T_OPEN_TAG = 371;
PHP.Parser.prototype.T_OPEN_TAG_WITH_ECHO = 372;
PHP.Parser.prototype.T_CLOSE_TAG = 373;
PHP.Parser.prototype.T_WHITESPACE = 374;
PHP.Parser.prototype.T_START_HEREDOC = 375;
PHP.Parser.prototype.T_END_HEREDOC = 376;
PHP.Parser.prototype.T_DOLLAR_OPEN_CURLY_BRACES = 377;
PHP.Parser.prototype.T_CURLY_OPEN = 378;
PHP.Parser.prototype.T_PAAMAYIM_NEKUDOTAYIM = 379;
PHP.Parser.prototype.T_NAMESPACE = 380;
PHP.Parser.prototype.T_NS_C = 381;
PHP.Parser.prototype.T_DIR = 382;
PHP.Parser.prototype.T_NS_SEPARATOR = 383;
PHP.Parser.prototype.terminals = [
    "$EOF",
    "error",
    "T_INCLUDE",
    "T_INCLUDE_ONCE",
    "T_EVAL",
    "T_REQUIRE",
    "T_REQUIRE_ONCE",
    "','",
    "T_LOGICAL_OR",
    "T_LOGICAL_XOR",
    "T_LOGICAL_AND",
    "T_PRINT",
    "'='",
    "T_PLUS_EQUAL",
    "T_MINUS_EQUAL",
    "T_MUL_EQUAL",
    "T_DIV_EQUAL",
    "T_CONCAT_EQUAL",
    "T_MOD_EQUAL",
    "T_AND_EQUAL",
    "T_OR_EQUAL",
    "T_XOR_EQUAL",
    "T_SL_EQUAL",
    "T_SR_EQUAL",
    "'?'",
    "':'",
    "T_BOOLEAN_OR",
    "T_BOOLEAN_AND",
    "'|'",
    "'^'",
    "'&'",
    "T_IS_EQUAL",
    "T_IS_NOT_EQUAL",
    "T_IS_IDENTICAL",
    "T_IS_NOT_IDENTICAL",
    "'<'",
    "T_IS_SMALLER_OR_EQUAL",
    "'>'",
    "T_IS_GREATER_OR_EQUAL",
    "T_SL",
    "T_SR",
    "'+'",
    "'-'",
    "'.'",
    "'*'",
    "'/'",
    "'%'",
    "'!'",
    "T_INSTANCEOF",
    "'~'",
    "T_INC",
    "T_DEC",
    "T_INT_CAST",
    "T_DOUBLE_CAST",
    "T_STRING_CAST",
    "T_ARRAY_CAST",
    "T_OBJECT_CAST",
    "T_BOOL_CAST",
    "T_UNSET_CAST",
    "'@'",
    "'['",
    "T_NEW",
    "T_CLONE",
    "T_EXIT",
    "T_IF",
    "T_ELSEIF",
    "T_ELSE",
    "T_ENDIF",
    "T_LNUMBER",
    "T_DNUMBER",
    "T_STRING",
    "T_STRING_VARNAME",
    "T_VARIABLE",
    "T_NUM_STRING",
    "T_INLINE_HTML",
    "T_ENCAPSED_AND_WHITESPACE",
    "T_CONSTANT_ENCAPSED_STRING",
    "T_ECHO",
    "T_DO",
    "T_WHILE",
    "T_ENDWHILE",
    "T_FOR",
    "T_ENDFOR",
    "T_FOREACH",
    "T_ENDFOREACH",
    "T_DECLARE",
    "T_ENDDECLARE",
    "T_AS",
    "T_SWITCH",
    "T_ENDSWITCH",
    "T_CASE",
    "T_DEFAULT",
    "T_BREAK",
    "T_CONTINUE",
    "T_GOTO",
    "T_FUNCTION",
    "T_CONST",
    "T_RETURN",
    "T_TRY",
    "T_CATCH",
    "T_THROW",
    "T_USE",
    "T_INSTEADOF",
    "T_GLOBAL",
    "T_STATIC",
    "T_ABSTRACT",
    "T_FINAL",
    "T_PRIVATE",
    "T_PROTECTED",
    "T_PUBLIC",
    "T_VAR",
    "T_UNSET",
    "T_ISSET",
    "T_EMPTY",
    "T_HALT_COMPILER",
    "T_CLASS",
    "T_TRAIT",
    "T_INTERFACE",
    "T_EXTENDS",
    "T_IMPLEMENTS",
    "T_OBJECT_OPERATOR",
    "T_DOUBLE_ARROW",
    "T_LIST",
    "T_ARRAY",
    "T_CALLABLE",
    "T_CLASS_C",
    "T_TRAIT_C",
    "T_METHOD_C",
    "T_FUNC_C",
    "T_LINE",
    "T_FILE",
    "T_START_HEREDOC",
    "T_END_HEREDOC",
    "T_DOLLAR_OPEN_CURLY_BRACES",
    "T_CURLY_OPEN",
    "T_PAAMAYIM_NEKUDOTAYIM",
    "T_NAMESPACE",
    "T_NS_C",
    "T_DIR",
    "T_NS_SEPARATOR",
    "';'",
    "'{'",
    "'}'",
    "'('",
    "')'",
    "'$'",
    "']'",
    "'`'",
    "'\"'"
    , "???"
];
PHP.Parser.prototype.translate = [
        0,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,   47,  148,  149,  145,   46,   30,  149,
      143,  144,   44,   41,    7,   42,   43,   45,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,   25,  140,
       35,   12,   37,   24,   59,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,   60,  149,  146,   29,  149,  147,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  141,   28,  142,   49,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,  149,  149,  149,  149,
      149,  149,  149,  149,  149,  149,    1,    2,    3,    4,
        5,    6,    8,    9,   10,   11,   13,   14,   15,   16,
       17,   18,   19,   20,   21,   22,   23,   26,   27,   31,
       32,   33,   34,   36,   38,   39,   40,   48,   50,   51,
       52,   53,   54,   55,   56,   57,   58,   61,   62,   63,
       64,   65,   66,   67,   68,   69,   70,   71,   72,   73,
       74,  149,  149,   75,   76,   77,   78,   79,   80,   81,
       82,   83,   84,   85,   86,   87,   88,   89,   90,   91,
       92,   93,   94,   95,   96,   97,   98,   99,  100,  101,
      102,  103,  104,  105,  106,  107,  108,  109,  110,  111,
      112,  113,  114,  115,  116,  117,  118,  119,  120,  121,
      122,  123,  124,  125,  126,  127,  128,  129,  130,  149,
      149,  149,  149,  149,  149,  131,  132,  133,  134,  135,
      136,  137,  138,  139
];

PHP.Parser.prototype.yyaction = [
       61,   62,  363,   63,   64,-32766,-32766,-32766,  509,   65,
      708,  709,  710,  707,  706,  705,-32766,-32766,-32766,-32766,
    -32766,-32766,  132,-32766,-32766,-32766,-32766,-32766,-32767,-32767,
    -32767,-32767,-32766,  335,-32766,-32766,-32766,-32766,-32766,   66,
       67,  351,  663,  664,   40,   68,  548,   69,  232,  233,
       70,   71,   72,   73,   74,   75,   76,   77,   30,  246,
       78,  336,  364, -112,    0,  469,  833,  834,  365,  641,
      890,  436,  590,   41,  835,   53,   27,  366,  294,  367,
      687,  368,  921,  369,  923,  922,  370,-32766,-32766,-32766,
       42,   43,  371,  339,  126,   44,  372,  337,   79,  297,
      349,  292,  293,-32766,  918,-32766,-32766,  373,  374,  375,
      376,  377,  391,  199,  361,  338,  573,  613,  378,  379,
      380,  381,  845,  839,  840,  841,  842,  836,  837,  253,
    -32766,   87,   88,   89,  391,  843,  838,  338,  597,  519,
      128,   80,  129,  273,  332,  257,  261,   47,  673,   90,
       91,   92,   93,   94,   95,   96,   97,   98,   99,  100,
      101,  102,  103,  104,  105,  106,  107,  108,  109,  110,
      799,  247,  884,  108,  109,  110,  226,  247,   21,-32766,
      310,-32766,-32766,-32766,  642,  548,-32766,-32766,-32766,-32766,
       56,  353,-32766,-32766,-32766,   55,-32766,-32766,-32766,-32766,
    -32766,   58,-32766,-32766,-32766,-32766,-32766,-32766,-32766,-32766,
    -32766,  557,-32766,-32766,  518,-32766,  548,  890,-32766,  390,
    -32766,  228,  252,-32766,-32766,-32766,-32766,-32766,  275,-32766,
      234,-32766,  587,  588,-32766,-32766,-32766,-32766,-32766,-32766,
    -32766,   46,  236,-32766,-32766,  281,-32766,  682,  348,-32766,
      390,-32766,  346,  333,  521,-32766,-32766,-32766,  271,  911,
      262,  237,  446,  911,-32766,  894,   59,  700,  358,  135,
      548,  123,  538,   35,-32766,  333,  122,-32766,-32766,-32766,
      271,-32766,  124,-32766,  692,-32766,-32766,-32766,-32766,  700,
      273,   22,-32766,-32766,-32766,-32766,  239,-32766,-32766,  612,
    -32766,  548,  134,-32766,  390,-32766,  462,  354,-32766,-32766,
    -32766,-32766,-32766,  227,-32766,  238,-32766,  845,  542,-32766,
      856,  611,  200,-32766,-32766,-32766,  259,  280,-32766,-32766,
      201,-32766,  855,  129,-32766,  390,  130,  202,  333,  206,
    -32766,-32766,-32766,  271,-32766,-32766,-32766,  125,  601,-32766,
      136,  299,  700,  489,   28,  548,  105,  106,  107,-32766,
      498,  499,-32766,-32766,-32766,  207,-32766,  133,-32766,  525,
    -32766,-32766,-32766,-32766,  663,  664,  527,-32766,-32766,-32766,
    -32766,  528,-32766,-32766,  610,-32766,  548,  427,-32766,  390,
    -32766,  532,  539,-32766,-32766,-32766,-32766,-32766,  240,-32766,
      247,-32766,  697,  543,-32766,  554,  523,  608,-32766,-32766,
    -32766,  686,  535,-32766,-32766,   54,-32766,   57,   60,-32766,
      390,  246, -155,  278,  345,-32766,-32766,-32766,  506,  347,
     -152,  471,  402,  403,-32766,  405,  404,  272,  493,  416,
      548,  318,  417,  505,-32766,  517,  548,-32766,-32766,-32766,
      549,-32766,  562,-32766,  916,-32766,-32766,-32766,-32766,  564,
      826,  848,-32766,-32766,-32766,-32766,  694,-32766,-32766,  485,
    -32766,  548,  487,-32766,  390,-32766,  504,  802,-32766,-32766,
    -32766,-32766,-32766,  279,-32766,  911,-32766,  502,  492,-32766,
      413,  483,  269,-32766,-32766,-32766,  243,  337,-32766,-32766,
      418,-32766,  454,  229,-32766,  390,  274,  373,  374,  344,
    -32766,-32766,-32766,  360,  614,-32766,  573,  613,  378,  379,
     -274,  548,  615, -332,  844,-32766,  258,   51,-32766,-32766,
    -32766,  270,-32766,  346,-32766,   52,-32766,  260,    0,-32766,
     -333,-32766,-32766,-32766,-32766,-32766,-32766,  205,-32766,-32766,
       49,-32766,  548,  424,-32766,  390,-32766, -266,  264,-32766,
    -32766,-32766,-32766,-32766,  409,-32766,  343,-32766,  265,  312,
    -32766,  470,  513, -275,-32766,-32766,-32766,  920,  337,-32766,
    -32766,  530,-32766,  531,  600,-32766,  390,  592,  373,  374,
      578,  581,-32766,-32766,  644,  629,-32766,  573,  613,  378,
      379,  635,  548,  636,  576,  627,-32766,  625,  693,-32766,
    -32766,-32766,  691,-32766,  591,-32766,  582,-32766,  203,  204,
    -32766,  584,  583,-32766,-32766,-32766,-32766,  586,  599,-32766,
    -32766,  589,-32766,  690,  558,-32766,  390,  197,  683,  919,
       86,  520,  522,-32766,  524,  833,  834,  529,  533,-32766,
      534,  537,  541,  835,   48,  111,  112,  113,  114,  115,
      116,  117,  118,  119,  120,  121,  127,   31,  633,  337,
      330,  634,  585,-32766,   32,  291,  337,  330,  478,  373,
      374,  917,  291,  891,  889,  875,  373,  374,  553,  613,
      378,  379,  737,  739,  887,  553,  613,  378,  379,  824,
      451,  675,  839,  840,  841,  842,  836,  837,  320,  895,
      277,  885,   23,   33,  843,  838,  556,  277,  337,  330,
    -32766,   34,-32766,  555,  291,   36,   37,   38,  373,  374,
       39,   45,   50,   81,   82,   83,   84,  553,  613,  378,
      379,-32767,-32767,-32767,-32767,  103,  104,  105,  106,  107,
      337,   85,  131,  137,  337,  138,  198,  224,  225,  277,
      373,  374, -332,  230,  373,  374,   24,  337,  231,  573,
      613,  378,  379,  573,  613,  378,  379,  373,  374,  235,
      248,  249,  250,  337,  251,    0,  573,  613,  378,  379,
      276,  329,  331,  373,  374,-32766,  337,  574,  490,  792,
      337,  609,  573,  613,  378,  379,  373,  374,   25,  300,
      373,  374,  319,  337,  795,  573,  613,  378,  379,  573,
      613,  378,  379,  373,  374,  516,  355,  359,  445,  482,
      796,  507,  573,  613,  378,  379,  508,  548,  337,  890,
      775,  791,  337,  604,  803,  808,  806,  698,  373,  374,
      888,  807,  373,  374,-32766,-32766,-32766,  573,  613,  378,
      379,  573,  613,  378,  379,  873,  832,  804,  872,  851,
    -32766,  809,-32766,-32766,-32766,-32766,  805,   20,   26,   29,
      298,  480,  515,  770,  778,  827,  457,    0,  900,  455,
      774,    0,    0,    0,  874,  870,  886,  823,  915,  852,
      869,  488,    0,  391,  793,    0,  338,    0,    0,    0,
      340,    0,  273
];

PHP.Parser.prototype.yycheck = [
        2,    3,    4,    5,    6,    8,    9,   10,   70,   11,
      104,  105,  106,  107,  108,  109,    8,    9,   10,    8,
        9,   24,   60,   26,   27,   28,   29,   30,   31,   32,
       33,   34,   24,    7,   26,   27,   28,   29,   30,   41,
       42,    7,  123,  124,    7,   47,   70,   49,   50,   51,
       52,   53,   54,   55,   56,   57,   58,   59,   60,   61,
       62,   63,   64,  144,    0,   75,   68,   69,   70,   25,
       72,   70,   74,    7,   76,   77,   78,   79,    7,   81,
      142,   83,   70,   85,   72,   73,   88,    8,    9,   10,
       92,   93,   94,   95,    7,   97,   98,   95,  100,    7,
        7,  103,  104,   24,  142,   26,   27,  105,  106,  111,
      112,  113,  136,    7,    7,  139,  114,  115,  116,  117,
      122,  123,  132,  125,  126,  127,  128,  129,  130,  131,
        8,    8,    9,   10,  136,  137,  138,  139,  140,  141,
       25,  143,  141,  145,  142,  147,  148,   24,   72,   26,
       27,   28,   29,   30,   31,   32,   33,   34,   35,   36,
       37,   38,   39,   40,   41,   42,   43,   44,   45,   46,
      144,   48,   72,   44,   45,   46,   30,   48,  144,   64,
       72,    8,    9,   10,  140,   70,    8,    9,   10,   74,
       60,   25,   77,   78,   79,   60,   81,   24,   83,   26,
       85,   60,   24,   88,   26,   27,   28,   92,   93,   94,
       64,  140,   97,   98,   70,  100,   70,   72,  103,  104,
       74,  145,    7,   77,   78,   79,  111,   81,    7,   83,
       30,   85,  140,  140,   88,    8,    9,   10,   92,   93,
       94,  133,  134,   97,   98,  145,  100,  140,    7,  103,
      104,   24,  139,   96,  141,  140,  141,  111,  101,   75,
       75,   30,   70,   75,   64,   70,   60,  110,  121,   12,
       70,  141,   25,  143,   74,   96,  141,   77,   78,   79,
      101,   81,  141,   83,  140,   85,  140,  141,   88,  110,
      145,  144,   92,   93,   94,   64,    7,   97,   98,  142,
      100,   70,  141,  103,  104,   74,  145,  141,   77,   78,
       79,  111,   81,    7,   83,   30,   85,  132,   25,   88,
      132,  142,   12,   92,   93,   94,  120,   60,   97,   98,
       12,  100,  148,  141,  103,  104,  141,   12,   96,   12,
      140,  141,  111,  101,    8,    9,   10,  141,   25,   64,
       90,   91,  110,   65,   66,   70,   41,   42,   43,   74,
       65,   66,   77,   78,   79,   12,   81,   25,   83,   25,
       85,  140,  141,   88,  123,  124,   25,   92,   93,   94,
       64,   25,   97,   98,  142,  100,   70,  120,  103,  104,
       74,   25,   25,   77,   78,   79,  111,   81,   30,   83,
       48,   85,  140,  141,   88,  140,  141,   30,   92,   93,
       94,  140,  141,   97,   98,   60,  100,   60,   60,  103,
      104,   61,   72,   75,   70,  140,  141,  111,   67,   70,
       87,   99,   70,   70,   64,   70,   72,  102,   89,   70,
       70,   71,   70,   70,   74,   70,   70,   77,   78,   79,
       70,   81,   70,   83,   70,   85,  140,  141,   88,   70,
      144,   70,   92,   93,   94,   64,   70,   97,   98,   72,
      100,   70,   72,  103,  104,   74,   72,   72,   77,   78,
       79,  111,   81,   75,   83,   75,   85,   89,   86,   88,
       79,  101,  118,   92,   93,   94,   87,   95,   97,   98,
       87,  100,   87,   87,  103,  104,  118,  105,  106,   95,
      140,  141,  111,   95,  115,   64,  114,  115,  116,  117,
      135,   70,  115,  120,  132,   74,  120,  140,   77,   78,
       79,  119,   81,  139,   83,  140,   85,  120,   -1,   88,
      120,  140,  141,   92,   93,   94,   64,  121,   97,   98,
      121,  100,   70,  122,  103,  104,   74,  135,  135,   77,
       78,   79,  111,   81,  139,   83,  139,   85,  135,  135,
       88,  135,  135,  135,   92,   93,   94,  142,   95,   97,
       98,  140,  100,  140,  140,  103,  104,  140,  105,  106,
      140,  140,  141,  111,  140,  140,   64,  114,  115,  116,
      117,  140,   70,  140,  140,  140,   74,  140,  140,   77,
       78,   79,  140,   81,  140,   83,  140,   85,   41,   42,
       88,  140,  140,  141,   92,   93,   94,  140,  140,   97,
       98,  140,  100,  140,  140,  103,  104,   60,  140,  142,
      141,  141,  141,  111,  141,   68,   69,  141,  141,   72,
      141,  141,  141,   76,   12,   13,   14,   15,   16,   17,
       18,   19,   20,   21,   22,   23,  141,  143,  142,   95,
       96,  142,  140,  141,  143,  101,   95,   96,  142,  105,
      106,  142,  101,  142,  142,  142,  105,  106,  114,  115,
      116,  117,   50,   51,  142,  114,  115,  116,  117,  142,
      123,  142,  125,  126,  127,  128,  129,  130,  131,  142,
      136,  142,  144,  143,  137,  138,  142,  136,   95,   96,
      143,  143,  145,  142,  101,  143,  143,  143,  105,  106,
      143,  143,  143,  143,  143,  143,  143,  114,  115,  116,
      117,   35,   36,   37,   38,   39,   40,   41,   42,   43,
       95,  143,  143,  143,   95,  143,  143,  143,  143,  136,
      105,  106,  120,  143,  105,  106,  144,   95,  143,  114,
      115,  116,  117,  114,  115,  116,  117,  105,  106,  143,
      143,  143,  143,   95,  143,   -1,  114,  115,  116,  117,
      143,  143,  143,  105,  106,  143,   95,  142,   80,  146,
       95,  142,  114,  115,  116,  117,  105,  106,  144,  144,
      105,  106,  144,   95,  142,  114,  115,  116,  117,  114,
      115,  116,  117,  105,  106,   82,  144,  144,  144,  144,
      142,   84,  114,  115,  116,  117,  144,   70,   95,   72,
      144,  144,   95,  142,  144,  146,  144,  142,  105,  106,
      146,  144,  105,  106,    8,    9,   10,  114,  115,  116,
      117,  114,  115,  116,  117,  144,  144,  144,  144,  144,
       24,  104,   26,   27,   28,   29,  144,  144,  144,  144,
      144,  144,  144,  144,  144,  144,  144,   -1,  144,  144,
      144,   -1,   -1,   -1,  146,  146,  146,  146,  146,  146,
      146,  146,   -1,  136,  147,   -1,  139,   -1,   -1,   -1,
      143,   -1,  145
];

PHP.Parser.prototype.yybase = [
        0,  574,  581,  623,  655,    2,  718,  402,  747,  659,
      672,  688,  743,  701,  705,  483,  483,  483,  483,  483,
      351,  356,  366,  366,  367,  366,  344,   -2,   -2,   -2,
      200,  200,  231,  231,  231,  231,  231,  231,  231,  231,
      200,  231,  451,  482,  532,  316,  370,  115,  146,  285,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,  401,
      401,  401,  401,  401,  401,  401,  401,  401,  401,   44,
      474,  429,  476,  481,  487,  488,  739,  740,  741,  734,
      733,  416,  736,  539,  541,  342,  542,  543,  552,  557,
      559,  536,  567,  737,  755,  569,  735,  738,  123,  123,
      123,  123,  123,  123,  123,  123,  123,  122,   11,  336,
      336,  336,  336,  336,  336,  336,  336,  336,  336,  336,
      336,  336,  336,  336,  227,  227,  173,  577,  577,  577,
      577,  577,  577,  577,  577,  577,  577,  577,   79,  178,
      846,    8,   -3,   -3,   -3,   -3,  642,  706,  706,  706,
      706,  157,  179,  242,  431,  431,  360,  431,  525,  368,
      767,  767,  767,  767,  767,  767,  767,  767,  767,  767,
      767,  767,  350,  375,  315,  315,  652,  652,  -81,  -81,
      -81,  -81,  251,  185,  188,  184,  -62,  348,  195,  195,
      195,  408,  392,  410,    1,  192,  129,  129,  129,  -24,
      -24,  -24,  -24,  499,  -24,  -24,  -24,  113,  108,  108,
       12,  161,  349,  526,  271,  398,  529,  438,  130,  206,
      265,  427,   76,  414,  427,  288,  295,   76,  166,   44,
      262,  422,  141,  491,  372,  494,  413,   71,   92,   93,
      267,  135,  100,   34,  415,  745,  746,  742,  -38,  420,
      -10,  135,  147,  744,  498,  107,   26,  493,  144,  377,
      363,  369,  332,  363,  400,  377,  588,  377,  376,  377,
      360,   37,  582,  376,  377,  374,  376,  388,  363,  364,
      412,  369,  377,  441,  443,  390,  106,  332,  377,  390,
      377,  400,   64,  590,  591,  323,  592,  589,  593,  649,
      608,  362,  500,  399,  407,  620,  625,  636,  365,  354,
      614,  524,  425,  359,  355,  423,  570,  578,  357,  406,
      414,  394,  352,  403,  531,  433,  403,  653,  434,  385,
      417,  411,  444,  310,  318,  501,  425,  668,  757,  380,
      637,  684,  403,  609,  387,   87,  325,  638,  382,  403,
      639,  403,  696,  503,  615,  403,  697,  384,  435,  425,
      352,  352,  352,  700,   66,  699,  583,  702,  707,  704,
      748,  721,  749,  584,  750,  358,  583,  722,  751,  682,
      215,  613,  422,  436,  389,  447,  221,  257,  752,  403,
      403,  506,  499,  403,  395,  685,  397,  426,  753,  392,
      391,  647,  683,  403,  418,  754,  221,  723,  587,  724,
      450,  568,  507,  648,  509,  327,  725,  353,  497,  610,
      454,  622,  455,  461,  404,  510,  373,  732,  612,  247,
      361,  664,  463,  405,  692,  641,  464,  465,  511,  343,
      437,  335,  409,  396,  665,  293,  467,  468,  472,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,    0,    0,    0,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,   -2,
       -2,   -2,   -2,  123,  123,  123,  123,  123,  123,  123,
      123,  123,  123,  123,  123,  123,  123,  123,  123,  123,
      123,  123,  123,  123,  123,  123,  123,  123,  123,  123,
      123,  123,    0,    0,    0,    0,    0,    0,    0,    0,
        0,  123,  123,  123,  123,  123,  123,  123,  123,  123,
      123,  123,  123,  123,  123,  123,  123,  123,  123,  123,
      123,  767,  767,  767,  767,  767,  767,  767,  767,  767,
      767,  767,  123,  123,  123,  123,  123,  123,  123,  123,
        0,  129,  129,  129,  129,  -94,  -94,  -94,  767,  767,
      767,  767,  767,  767,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,  -94,  -94,  129,  129,
      767,  767,  -24,  -24,  -24,  -24,  -24,  108,  108,  108,
      -24,  108,  145,  145,  145,  108,  108,  108,  100,  100,
        0,    0,    0,    0,    0,    0,    0,  145,    0,    0,
        0,  376,    0,    0,    0,  145,  260,  260,  221,  260,
      260,  135,    0,    0,  425,  376,    0,  364,  376,    0,
        0,    0,    0,    0,    0,  531,    0,   87,  637,  241,
      425,    0,    0,    0,    0,    0,    0,    0,  425,  289,
      289,  306,    0,  358,    0,    0,    0,  306,  241,    0,
        0,  221
];

PHP.Parser.prototype.yydefault = [
        3,32767,32767,    1,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,  104,   96,  110,   95,  106,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
      358,  358,  122,  122,  122,  122,  122,  122,  122,  122,
      316,32767,32767,32767,32767,32767,32767,32767,32767,32767,
      173,  173,  173,32767,  348,  348,  348,  348,  348,  348,
      348,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,  363,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,  232,  233,
      235,  236,  172,  125,  349,  362,  171,  199,  201,  250,
      200,  177,  182,  183,  184,  185,  186,  187,  188,  189,
      190,  191,  192,  176,  229,  228,  197,  313,  313,  316,
    32767,32767,32767,32767,32767,32767,32767,32767,  198,  202,
      204,  203,  219,  220,  217,  218,  175,  221,  222,  223,
      224,  157,  157,  157,  357,  357,32767,  357,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,  158,32767,  211,  212,  276,  276,  117,  117,
      117,  117,  117,32767,32767,32767,32767,  284,32767,32767,
    32767,32767,32767,  286,32767,32767,  206,  207,  205,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,  285,32767,
    32767,32767,32767,32767,32767,32767,32767,  334,  321,  272,
    32767,32767,32767,  265,32767,  107,  109,32767,32767,32767,
    32767,  302,  339,32767,32767,32767,   17,32767,32767,32767,
      370,  334,32767,32767,   19,32767,32767,32767,32767,  227,
    32767,  338,  332,32767,32767,32767,32767,32767,32767,   63,
    32767,32767,32767,32767,32767,   63,  281,   63,32767,   63,
    32767,  315,  287,32767,   63,   74,32767,   72,32767,32767,
       76,32767,   63,   93,   93,  254,  315,   54,   63,  254,
       63,32767,32767,32767,32767,    4,32767,32767,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,32767,  267,32767,  323,32767,  337,  336,  324,32767,
      265,32767,  215,  194,  266,32767,  196,32767,32767,  270,
      273,32767,32767,32767,  134,32767,  268,  180,32767,32767,
    32767,32767,  365,32767,32767,  174,32767,32767,32767,  130,
    32767,   61,  332,32767,32767,  355,32767,32767,  332,  269,
      208,  209,  210,32767,  121,32767,  310,32767,32767,32767,
    32767,32767,32767,  327,32767,  333,32767,32767,32767,32767,
      111,32767,  302,32767,32767,32767,   75,32767,32767,  178,
      126,32767,32767,  364,32767,32767,32767,  320,32767,32767,
    32767,32767,32767,   62,32767,32767,   77,32767,32767,32767,
    32767,  332,32767,32767,32767,  115,32767,  169,32767,32767,
    32767,32767,32767,32767,32767,32767,32767,32767,32767,32767,
    32767,  332,32767,32767,32767,32767,32767,32767,32767,    4,
    32767,  151,32767,32767,32767,32767,32767,32767,32767,   25,
       25,    3,  137,    3,  137,   25,  101,   25,   25,  137,
       93,   93,   25,   25,   25,  144,   25,   25,   25,   25,
       25,   25,   25,   25
];

PHP.Parser.prototype.yygoto = [
      141,  141,  173,  173,  173,  173,  173,  173,  173,  173,
      141,  173,  142,  143,  144,  148,  153,  155,  181,  175,
      172,  172,  172,  172,  174,  174,  174,  174,  174,  174,
      174,  168,  169,  170,  171,  179,  757,  758,  392,  760,
      781,  782,  783,  784,  785,  786,  787,  789,  725,  145,
      146,  147,  149,  150,  151,  152,  154,  177,  178,  180,
      196,  208,  209,  210,  211,  212,  213,  214,  215,  217,
      218,  219,  220,  244,  245,  266,  267,  268,  430,  431,
      432,  182,  183,  184,  185,  186,  187,  188,  189,  190,
      191,  192,  156,  157,  158,  159,  176,  160,  194,  161,
      162,  163,  164,  195,  165,  193,  139,  166,  167,  452,
      452,  452,  452,  452,  452,  452,  452,  452,  452,  452,
      453,  453,  453,  453,  453,  453,  453,  453,  453,  453,
      453,  551,  551,  551,  464,  491,  394,  394,  394,  394,
      394,  394,  394,  394,  394,  394,  394,  394,  394,  394,
      394,  394,  394,  394,  407,  552,  552,  552,  810,  810,
      662,  662,  662,  662,  662,  594,  283,  595,  510,  399,
      399,  567,  679,  632,  849,  850,  863,  660,  714,  426,
      222,  622,  622,  622,  622,  223,  617,  623,  494,  395,
      395,  395,  395,  395,  395,  395,  395,  395,  395,  395,
      395,  395,  395,  395,  395,  395,  395,  465,  472,  514,
      904,  398,  398,  425,  425,  459,  425,  419,  322,  421,
      421,  393,  396,  412,  422,  428,  460,  463,  473,  481,
      501,    5,  476,  284,  327,    1,   15,    2,    6,    7,
      550,  550,  550,    8,    9,   10,  668,   16,   11,   17,
       12,   18,   13,   19,   14,  704,  328,  881,  881,  643,
      628,  626,  626,  624,  626,  526,  401,  652,  647,  847,
      847,  847,  847,  847,  847,  847,  847,  847,  847,  847,
      437,  438,  441,  447,  477,  479,  497,  290,  910,  910,
      400,  400,  486,  880,  880,  263,  913,  910,  303,  255,
      723,  306,  822,  821,  306,  896,  896,  896,  861,  304,
      323,  410,  913,  913,  897,  316,  420,  769,  658,  559,
      879,  671,  536,  324,  466,  565,  311,  311,  311,  801,
      241,  676,  496,  439,  440,  442,  444,  448,  475,  631,
      858,  311,  285,  286,  603,  495,  712,    0,  406,  321,
        0,    0,    0,  314,    0,    0,  429,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,  411
];

PHP.Parser.prototype.yygcheck = [
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   35,
       35,   35,   35,   35,   35,   35,   35,   35,   35,   35,
       86,   86,   86,   86,   86,   86,   86,   86,   86,   86,
       86,    6,    6,    6,   21,   21,   35,   35,   35,   35,
       35,   35,   35,   35,   35,   35,   35,   35,   35,   35,
       35,   35,   35,   35,   71,    7,    7,    7,   35,   35,
       35,   35,   35,   35,   35,   29,   44,   29,   35,   86,
       86,   12,   12,   12,   12,   12,   12,   12,   12,   75,
       40,   35,   35,   35,   35,   40,   35,   35,   35,   82,
       82,   82,   82,   82,   82,   82,   82,   82,   82,   82,
       82,   82,   82,   82,   82,   82,   82,   36,   36,   36,
      104,   82,   82,   28,   28,   28,   28,   28,   28,   28,
       28,   28,   28,   28,   28,   28,   28,   28,   28,   28,
       28,   13,   42,   42,   42,    2,   13,    2,   13,   13,
        5,    5,    5,   13,   13,   13,   54,   13,   13,   13,
       13,   13,   13,   13,   13,   67,   67,   83,   83,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,   93,
       93,   93,   93,   93,   93,   93,   93,   93,   93,   93,
       52,   52,   52,   52,   52,   52,   52,    4,  105,  105,
       89,   89,   94,   84,   84,   92,  105,  105,   26,   92,
       71,    4,   91,   91,    4,   84,   84,   84,   97,   30,
       70,   30,  105,  105,  102,   27,   30,   72,   50,   10,
       84,   55,   46,    9,   30,   11,   90,   90,   90,   80,
       30,   56,   30,   85,   85,   85,   85,   85,   85,   43,
       96,   90,   44,   44,   34,   77,   69,   -1,    4,   90,
       -1,   -1,   -1,    4,   -1,   -1,    4,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,   -1,
       -1,   -1,   -1,   -1,   71
];

PHP.Parser.prototype.yygbase = [
        0,    0, -286,    0,   10,  239,  130,  154,    0,  -10,
       25,  -23,  -29, -289,    0,  -30,    0,    0,    0,    0,
        0,   83,    0,    0,    0,    0,  245,   84,  -11,  142,
      -28,    0,    0,    0,  -13,  -88,  -42,    0,    0,    0,
     -344,    0,  -38,  -12, -188,    0,   23,    0,    0,    0,
       66,    0,  247,    0,  205,   24,  -18,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,   13,    0,  -15,
       85,   74,   70,    0,    0,  148,    0,  -14,    0,    0,
       -6,    0,  -35,   11,   47,  278,  -77,    0,    0,   44,
       68,   43,   38,   72,   94,    0,  -16,  109,    0,    0,
        0,    0,   87,    0,  170,   34,    0
];

PHP.Parser.prototype.yygdefault = [
    -32768,  362,    3,  546,  382,  570,  571,  572,  307,  305,
      560,  566,  467,    4,  568,  140,  295,  575,  296,  500,
      577,  414,  579,  580,  308,  309,  415,  315,  216,  593,
      503,  313,  596,  357,  602,  301,  449,  383,  350,  461,
      221,  423,  456,  630,  282,  638,  540,  646,  649,  450,
      657,  352,  433,  434,  667,  672,  677,  680,  334,  325,
      474,  684,  685,  256,  689,  511,  512,  703,  242,  711,
      317,  724,  342,  788,  790,  397,  408,  484,  797,  326,
      800,  384,  385,  386,  387,  435,  818,  815,  289,  866,
      287,  443,  254,  853,  468,  356,  903,  862,  288,  388,
      389,  302,  898,  341,  905,  912,  458
];

PHP.Parser.prototype.yylhs = [
        0,    1,    2,    2,    4,    4,    3,    3,    3,    3,
        3,    3,    3,    3,    3,    8,    8,   10,   10,   10,
       10,    9,    9,   11,   13,   13,   14,   14,   14,   14,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,    5,    5,
        5,    5,    5,    5,    5,    5,    5,    5,   33,   33,
       34,   27,   27,   30,   30,    6,    7,    7,    7,   37,
       37,   37,   38,   38,   41,   41,   39,   39,   42,   42,
       22,   22,   29,   29,   32,   32,   31,   31,   43,   23,
       23,   23,   23,   44,   44,   45,   45,   46,   46,   20,
       20,   16,   16,   47,   18,   18,   48,   17,   17,   19,
       19,   36,   36,   49,   49,   50,   50,   51,   51,   51,
       51,   52,   52,   53,   53,   54,   54,   24,   24,   55,
       55,   55,   25,   25,   56,   56,   40,   40,   57,   57,
       57,   57,   62,   62,   63,   63,   64,   64,   64,   64,
       65,   66,   66,   61,   61,   58,   58,   60,   60,   68,
       68,   67,   67,   67,   67,   67,   67,   59,   59,   69,
       69,   26,   26,   21,   21,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   15,   15,   15,   15,   15,   15,   15,
       15,   15,   15,   71,   77,   77,   79,   79,   80,   81,
       81,   81,   81,   81,   81,   86,   86,   35,   35,   35,
       72,   72,   87,   87,   82,   82,   88,   88,   88,   88,
       88,   73,   73,   73,   76,   76,   76,   78,   78,   93,
       93,   93,   93,   93,   93,   93,   93,   93,   93,   93,
       93,   93,   93,   12,   12,   12,   12,   12,   12,   74,
       74,   74,   74,   94,   94,   96,   96,   95,   95,   97,
       97,   28,   28,   28,   28,   99,   99,   98,   98,   98,
       98,   98,  100,  100,   84,   84,   89,   89,   83,   83,
      101,  101,  101,  101,   90,   90,   90,   90,   85,   85,
       91,   91,   91,   70,   70,  102,  102,  102,   75,   75,
      103,  103,  104,  104,  104,  104,   92,   92,   92,   92,
      105,  105,  105,  105,  105,  105,  105,  106,  106,  106
];

PHP.Parser.prototype.yylen = [
        1,    1,    2,    0,    1,    3,    1,    1,    1,    1,
        3,    5,    4,    3,    3,    3,    1,    1,    3,    2,
        4,    3,    1,    3,    2,    0,    1,    1,    1,    1,
        3,    7,   10,    5,    7,    9,    5,    2,    3,    2,
        3,    2,    3,    3,    3,    3,    1,    2,    5,    7,
        8,   10,    5,    1,    5,    3,    3,    2,    1,    2,
        8,    1,    3,    0,    1,    9,    7,    6,    5,    1,
        2,    2,    0,    2,    0,    2,    0,    2,    1,    3,
        1,    4,    1,    4,    1,    4,    1,    3,    3,    3,
        4,    4,    5,    0,    2,    4,    3,    1,    1,    1,
        4,    0,    2,    5,    0,    2,    6,    0,    2,    0,
        3,    1,    0,    1,    3,    3,    5,    0,    1,    1,
        1,    1,    0,    1,    3,    1,    2,    3,    1,    1,
        2,    4,    3,    1,    1,    3,    2,    0,    3,    3,
        8,    3,    1,    3,    0,    2,    4,    5,    4,    4,
        3,    1,    1,    1,    3,    1,    1,    0,    1,    1,
        2,    1,    1,    1,    1,    1,    1,    1,    3,    1,
        3,    3,    1,    0,    1,    1,    6,    3,    4,    4,
        1,    2,    3,    3,    3,    3,    3,    3,    3,    3,
        3,    3,    3,    2,    2,    2,    2,    3,    3,    3,
        3,    3,    3,    3,    3,    3,    3,    3,    3,    3,
        3,    3,    3,    2,    2,    2,    2,    3,    3,    3,
        3,    3,    3,    3,    3,    3,    3,    3,    5,    4,
        4,    4,    2,    2,    4,    2,    2,    2,    2,    2,
        2,    2,    2,    2,    2,    2,    1,    4,    3,    3,
        2,    9,   10,    3,    0,    4,    1,    3,    2,    4,
        6,    8,    4,    4,    4,    1,    1,    1,    2,    3,
        1,    1,    1,    1,    1,    1,    0,    3,    3,    4,
        4,    0,    2,    3,    0,    1,    1,    0,    3,    1,
        1,    1,    1,    1,    1,    1,    1,    1,    1,    1,
        3,    2,    1,    1,    3,    2,    2,    4,    3,    1,
        3,    3,    3,    0,    2,    0,    1,    3,    1,    3,
        1,    1,    1,    1,    1,    6,    4,    3,    6,    4,
        4,    4,    1,    3,    1,    2,    1,    1,    4,    1,
        3,    6,    4,    4,    4,    4,    1,    4,    0,    1,
        1,    3,    1,    3,    1,    1,    4,    0,    0,    2,
        3,    1,    3,    1,    4,    2,    2,    2,    1,    2,
        1,    4,    3,    3,    3,    6,    3,    1,    1,    1
];







PHP.Parser.prototype.yyn0 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn1 = function ( attributes ) {
     this.yyval = this.Stmt_Namespace_postprocess(this.yyastk[ this.stackPos-(1-1) ]); 
};

PHP.Parser.prototype.yyn2 = function ( attributes ) {
     if (Array.isArray(this.yyastk[ this.stackPos-(2-2) ])) { this.yyval = this.yyastk[ this.stackPos-(2-1) ].concat( this.yyastk[ this.stackPos-(2-2) ]); } else { this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; }; 
};

PHP.Parser.prototype.yyn3 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn4 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn5 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn6 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn7 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn8 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn9 = function ( attributes ) {
     this.yyval = this.Node_Stmt_HaltCompiler(attributes); 
};

PHP.Parser.prototype.yyn10 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Namespace(this.Node_Name(this.yyastk[ this.stackPos-(3-2) ], attributes), null, attributes); 
};

PHP.Parser.prototype.yyn11 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Namespace(this.Node_Name(this.yyastk[ this.stackPos-(5-2) ], attributes), this.yyastk[ this.stackPos-(5-4) ], attributes); 
};

PHP.Parser.prototype.yyn12 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Namespace(null, this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn13 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Use(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn14 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Const(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn15 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn16 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn17 = function ( attributes ) {
     this.yyval = this.Node_Stmt_UseUse(this.Node_Name(this.yyastk[ this.stackPos-(1-1) ], attributes), null, attributes); 
};

PHP.Parser.prototype.yyn18 = function ( attributes ) {
     this.yyval = this.Node_Stmt_UseUse(this.Node_Name(this.yyastk[ this.stackPos-(3-1) ], attributes), this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn19 = function ( attributes ) {
     this.yyval = this.Node_Stmt_UseUse(this.Node_Name(this.yyastk[ this.stackPos-(2-2) ], attributes), null, attributes); 
};

PHP.Parser.prototype.yyn20 = function ( attributes ) {
     this.yyval = this.Node_Stmt_UseUse(this.Node_Name(this.yyastk[ this.stackPos-(4-2) ], attributes), this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn21 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn22 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn23 = function ( attributes ) {
     this.yyval = this.Node_Const(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn24 = function ( attributes ) {
     if (Array.isArray(this.yyastk[ this.stackPos-(2-2) ])) { this.yyval = this.yyastk[ this.stackPos-(2-1) ].concat( this.yyastk[ this.stackPos-(2-2) ]); } else { this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; }; 
};

PHP.Parser.prototype.yyn25 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn26 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn27 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn28 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn29 = function ( attributes ) {
     throw new Error('__halt_compiler() can only be used from the outermost scope'); 
};

PHP.Parser.prototype.yyn30 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn31 = function ( attributes ) {
     this.yyval = this.Node_Stmt_If(this.yyastk[ this.stackPos-(7-3) ], {'stmts':  Array.isArray(this.yyastk[ this.stackPos-(7-5) ]) ? this.yyastk[ this.stackPos-(7-5) ] : [this.yyastk[ this.stackPos-(7-5) ]], 'elseifs':  this.yyastk[ this.stackPos-(7-6) ], 'Else':  this.yyastk[ this.stackPos-(7-7) ]}, attributes); 
};

PHP.Parser.prototype.yyn32 = function ( attributes ) {
     this.yyval = this.Node_Stmt_If(this.yyastk[ this.stackPos-(10-3) ], {'stmts':  this.yyastk[ this.stackPos-(10-6) ], 'elseifs':  this.yyastk[ this.stackPos-(10-7) ], 'else':  this.yyastk[ this.stackPos-(10-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn33 = function ( attributes ) {
     this.yyval = this.Node_Stmt_While(this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn34 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Do(this.yyastk[ this.stackPos-(7-5) ], Array.isArray(this.yyastk[ this.stackPos-(7-2) ]) ? this.yyastk[ this.stackPos-(7-2) ] : [this.yyastk[ this.stackPos-(7-2) ]], attributes); 
};

PHP.Parser.prototype.yyn35 = function ( attributes ) {
     this.yyval = this.Node_Stmt_For({'init':  this.yyastk[ this.stackPos-(9-3) ], 'cond':  this.yyastk[ this.stackPos-(9-5) ], 'loop':  this.yyastk[ this.stackPos-(9-7) ], 'stmts':  this.yyastk[ this.stackPos-(9-9) ]}, attributes); 
};

PHP.Parser.prototype.yyn36 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Switch(this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn37 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Break(null, attributes); 
};

PHP.Parser.prototype.yyn38 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Break(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn39 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Continue(null, attributes); 
};

PHP.Parser.prototype.yyn40 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Continue(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn41 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Return(null, attributes); 
};

PHP.Parser.prototype.yyn42 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Return(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn43 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Global(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn44 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Static(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn45 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Echo(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn46 = function ( attributes ) {
     this.yyval = this.Node_Stmt_InlineHTML(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn47 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn48 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Unset(this.yyastk[ this.stackPos-(5-3) ], attributes); 
};

PHP.Parser.prototype.yyn49 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Foreach(this.yyastk[ this.stackPos-(7-3) ], this.yyastk[ this.stackPos-(7-5) ], {'keyVar':  null, 'byRef':  false, 'stmts':  this.yyastk[ this.stackPos-(7-7) ]}, attributes); 
};

PHP.Parser.prototype.yyn50 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Foreach(this.yyastk[ this.stackPos-(8-3) ], this.yyastk[ this.stackPos-(8-6) ], {'keyVar':  null, 'byRef':  true, 'stmts':  this.yyastk[ this.stackPos-(8-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn51 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Foreach(this.yyastk[ this.stackPos-(10-3) ], this.yyastk[ this.stackPos-(10-8) ], {'keyVar':  this.yyastk[ this.stackPos-(10-5) ], 'byRef':  this.yyastk[ this.stackPos-(10-7) ], 'stmts':  this.yyastk[ this.stackPos-(10-10) ]}, attributes); 
};

PHP.Parser.prototype.yyn52 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Declare(this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn53 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn54 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TryCatch(this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn55 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Throw(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn56 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Goto(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn57 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Label(this.yyastk[ this.stackPos-(2-1) ], attributes); 
};

PHP.Parser.prototype.yyn58 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn59 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn60 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Catch(this.yyastk[ this.stackPos-(8-3) ], this.yyastk[ this.stackPos-(8-4) ].substring( 1 ), this.yyastk[ this.stackPos-(8-7) ], attributes); 
};

PHP.Parser.prototype.yyn61 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn62 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn63 = function ( attributes ) {
     this.yyval = false; 
};

PHP.Parser.prototype.yyn64 = function ( attributes ) {
     this.yyval = true; 
};

PHP.Parser.prototype.yyn65 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Function(this.yyastk[ this.stackPos-(9-3) ], {'byRef':  this.yyastk[ this.stackPos-(9-2) ], 'params':  this.yyastk[ this.stackPos-(9-5) ], 'stmts':  this.yyastk[ this.stackPos-(9-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn66 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Class(this.yyastk[ this.stackPos-(7-2) ], {'type':  this.yyastk[ this.stackPos-(7-1) ], 'Extends':  this.yyastk[ this.stackPos-(7-3) ], 'Implements':  this.yyastk[ this.stackPos-(7-4) ], 'stmts':  this.yyastk[ this.stackPos-(7-6) ]}, attributes); 
};

PHP.Parser.prototype.yyn67 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Interface(this.yyastk[ this.stackPos-(6-2) ], {'Extends':  this.yyastk[ this.stackPos-(6-3) ], 'stmts':  this.yyastk[ this.stackPos-(6-5) ]}, attributes); 
};

PHP.Parser.prototype.yyn68 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Trait(this.yyastk[ this.stackPos-(5-2) ], this.yyastk[ this.stackPos-(5-4) ], attributes); 
};

PHP.Parser.prototype.yyn69 = function ( attributes ) {
     this.yyval = 0; 
};

PHP.Parser.prototype.yyn70 = function ( attributes ) {
     this.yyval = this.MODIFIER_ABSTRACT; 
};

PHP.Parser.prototype.yyn71 = function ( attributes ) {
     this.yyval = this.MODIFIER_FINAL; 
};

PHP.Parser.prototype.yyn72 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn73 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-2) ]; 
};

PHP.Parser.prototype.yyn74 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn75 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-2) ]; 
};

PHP.Parser.prototype.yyn76 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn77 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-2) ]; 
};

PHP.Parser.prototype.yyn78 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn79 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn80 = function ( attributes ) {
     this.yyval = Array.isArray(this.yyastk[ this.stackPos-(1-1) ]) ? this.yyastk[ this.stackPos-(1-1) ] : [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn81 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn82 = function ( attributes ) {
     this.yyval = Array.isArray(this.yyastk[ this.stackPos-(1-1) ]) ? this.yyastk[ this.stackPos-(1-1) ] : [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn83 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn84 = function ( attributes ) {
     this.yyval = Array.isArray(this.yyastk[ this.stackPos-(1-1) ]) ? this.yyastk[ this.stackPos-(1-1) ] : [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn85 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn86 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn87 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn88 = function ( attributes ) {
     this.yyval = this.Node_Stmt_DeclareDeclare(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn89 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn90 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-3) ]; 
};

PHP.Parser.prototype.yyn91 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn92 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(5-3) ]; 
};

PHP.Parser.prototype.yyn93 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn94 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn95 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Case(this.yyastk[ this.stackPos-(4-2) ], this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn96 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Case(null, this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn97 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn98 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn99 = function ( attributes ) {
     this.yyval = Array.isArray(this.yyastk[ this.stackPos-(1-1) ]) ? this.yyastk[ this.stackPos-(1-1) ] : [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn100 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-2) ]; 
};

PHP.Parser.prototype.yyn101 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn102 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn103 = function ( attributes ) {
     this.yyval = this.Node_Stmt_ElseIf(this.yyastk[ this.stackPos-(5-3) ], Array.isArray(this.yyastk[ this.stackPos-(5-5) ]) ? this.yyastk[ this.stackPos-(5-5) ] : [this.yyastk[ this.stackPos-(5-5) ]], attributes); 
};

PHP.Parser.prototype.yyn104 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn105 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn106 = function ( attributes ) {
     this.yyval = this.Node_Stmt_ElseIf(this.yyastk[ this.stackPos-(6-3) ], this.yyastk[ this.stackPos-(6-6) ], attributes); 
};

PHP.Parser.prototype.yyn107 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn108 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Else(Array.isArray(this.yyastk[ this.stackPos-(2-2) ]) ? this.yyastk[ this.stackPos-(2-2) ] : [this.yyastk[ this.stackPos-(2-2) ]], attributes); 
};

PHP.Parser.prototype.yyn109 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn110 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Else(this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn111 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn112 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn113 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn114 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn115 = function ( attributes ) {
     this.yyval = this.Node_Param(this.yyastk[ this.stackPos-(3-3) ].substring( 1 ), null, this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn116 = function ( attributes ) {
     this.yyval = this.Node_Param(this.yyastk[ this.stackPos-(5-3) ].substring( 1 ), this.yyastk[ this.stackPos-(5-5) ], this.yyastk[ this.stackPos-(5-1) ], this.yyastk[ this.stackPos-(5-2) ], attributes); 
};

PHP.Parser.prototype.yyn117 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn118 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn119 = function ( attributes ) {
     this.yyval = 'array'; 
};

PHP.Parser.prototype.yyn120 = function ( attributes ) {
     this.yyval = 'callable'; 
};

PHP.Parser.prototype.yyn121 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn122 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn123 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn124 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn125 = function ( attributes ) {
     this.yyval = this.Node_Arg(this.yyastk[ this.stackPos-(1-1) ], false, attributes); 
};

PHP.Parser.prototype.yyn126 = function ( attributes ) {
     this.yyval = this.Node_Arg(this.yyastk[ this.stackPos-(2-2) ], true, attributes); 
};

PHP.Parser.prototype.yyn127 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn128 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn129 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), attributes); 
};

PHP.Parser.prototype.yyn130 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn131 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn132 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn133 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn134 = function ( attributes ) {
     this.yyval = this.Node_Stmt_StaticVar(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), null, attributes); 
};

PHP.Parser.prototype.yyn135 = function ( attributes ) {
     this.yyval = this.Node_Stmt_StaticVar(this.yyastk[ this.stackPos-(3-1) ].substring( 1 ), this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn136 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn137 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn138 = function ( attributes ) {
     this.yyval = this.Node_Stmt_Property(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn139 = function ( attributes ) {
     this.yyval = this.Node_Stmt_ClassConst(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn140 = function ( attributes ) {
     this.yyval = this.Node_Stmt_ClassMethod(this.yyastk[ this.stackPos-(8-4) ], {'type':  this.yyastk[ this.stackPos-(8-1) ], 'byRef':  this.yyastk[ this.stackPos-(8-3) ], 'params':  this.yyastk[ this.stackPos-(8-6) ], 'stmts':  this.yyastk[ this.stackPos-(8-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn141 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUse(this.yyastk[ this.stackPos-(3-2) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn142 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn143 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn144 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn145 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn146 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUseAdaptation_Precedence(this.yyastk[ this.stackPos-(4-1) ][0], this.yyastk[ this.stackPos-(4-1) ][1], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn147 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUseAdaptation_Alias(this.yyastk[ this.stackPos-(5-1) ][0], this.yyastk[ this.stackPos-(5-1) ][1], this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-4) ], attributes); 
};

PHP.Parser.prototype.yyn148 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUseAdaptation_Alias(this.yyastk[ this.stackPos-(4-1) ][0], this.yyastk[ this.stackPos-(4-1) ][1], this.yyastk[ this.stackPos-(4-3) ], null, attributes); 
};

PHP.Parser.prototype.yyn149 = function ( attributes ) {
     this.yyval = this.Node_Stmt_TraitUseAdaptation_Alias(this.yyastk[ this.stackPos-(4-1) ][0], this.yyastk[ this.stackPos-(4-1) ][1], null, this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn150 = function ( attributes ) {
     this.yyval = array(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ]); 
};

PHP.Parser.prototype.yyn151 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn152 = function ( attributes ) {
     this.yyval = array(null, this.yyastk[ this.stackPos-(1-1) ]); 
};

PHP.Parser.prototype.yyn153 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn154 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn155 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn156 = function ( attributes ) {
     this.yyval = this.MODIFIER_PUBLIC; 
};

PHP.Parser.prototype.yyn157 = function ( attributes ) {
     this.yyval = this.MODIFIER_PUBLIC; 
};

PHP.Parser.prototype.yyn158 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn159 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn160 = function ( attributes ) {
     this.Stmt_Class_verifyModifier(this.yyastk[ this.stackPos-(2-1) ], this.yyastk[ this.stackPos-(2-2) ]); this.yyval = this.yyastk[ this.stackPos-(2-1) ] | this.yyastk[ this.stackPos-(2-2) ]; 
};

PHP.Parser.prototype.yyn161 = function ( attributes ) {
     this.yyval = this.MODIFIER_PUBLIC; 
};

PHP.Parser.prototype.yyn162 = function ( attributes ) {
     this.yyval = this.MODIFIER_PROTECTED; 
};

PHP.Parser.prototype.yyn163 = function ( attributes ) {
     this.yyval = this.MODIFIER_PRIVATE; 
};

PHP.Parser.prototype.yyn164 = function ( attributes ) {
     this.yyval = this.MODIFIER_STATIC; 
};

PHP.Parser.prototype.yyn165 = function ( attributes ) {
     this.yyval = this.MODIFIER_ABSTRACT; 
};

PHP.Parser.prototype.yyn166 = function ( attributes ) {
     this.yyval = this.MODIFIER_FINAL; 
};

PHP.Parser.prototype.yyn167 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn168 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn169 = function ( attributes ) {
     this.yyval = this.Node_Stmt_PropertyProperty(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), null, attributes); 
};

PHP.Parser.prototype.yyn170 = function ( attributes ) {
     this.yyval = this.Node_Stmt_PropertyProperty(this.yyastk[ this.stackPos-(3-1) ].substring( 1 ), this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn171 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn172 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn173 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn174 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn175 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn176 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignList(this.yyastk[ this.stackPos-(6-3) ], this.yyastk[ this.stackPos-(6-6) ], attributes); 
};

PHP.Parser.prototype.yyn177 = function ( attributes ) {
     this.yyval = this.Node_Expr_Assign(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn178 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignRef(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn179 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignRef(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn180 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn181 = function ( attributes ) {
     this.yyval = this.Node_Expr_Clone(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn182 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignPlus(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn183 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignMinus(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn184 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignMul(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn185 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignDiv(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn186 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignConcat(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn187 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignMod(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn188 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignBitwiseAnd(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn189 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignBitwiseOr(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn190 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignBitwiseXor(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn191 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignShiftLeft(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn192 = function ( attributes ) {
     this.yyval = this.Node_Expr_AssignShiftRight(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn193 = function ( attributes ) {
     this.yyval = this.Node_Expr_PostInc(this.yyastk[ this.stackPos-(2-1) ], attributes); 
};

PHP.Parser.prototype.yyn194 = function ( attributes ) {
     this.yyval = this.Node_Expr_PreInc(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn195 = function ( attributes ) {
     this.yyval = this.Node_Expr_PostDec(this.yyastk[ this.stackPos-(2-1) ], attributes); 
};

PHP.Parser.prototype.yyn196 = function ( attributes ) {
     this.yyval = this.Node_Expr_PreDec(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn197 = function ( attributes ) {
     this.yyval = this.Node_Expr_BooleanOr(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn198 = function ( attributes ) {
     this.yyval = this.Node_Expr_BooleanAnd(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn199 = function ( attributes ) {
     this.yyval = this.Node_Expr_LogicalOr(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn200 = function ( attributes ) {
     this.yyval = this.Node_Expr_LogicalAnd(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn201 = function ( attributes ) {
     this.yyval = this.Node_Expr_LogicalXor(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn202 = function ( attributes ) {
     this.yyval = this.Node_Expr_BitwiseOr(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn203 = function ( attributes ) {
     this.yyval = this.Node_Expr_BitwiseAnd(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn204 = function ( attributes ) {
     this.yyval = this.Node_Expr_BitwiseXor(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn205 = function ( attributes ) {
     this.yyval = this.Node_Expr_Concat(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn206 = function ( attributes ) {
     this.yyval = this.Node_Expr_Plus(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn207 = function ( attributes ) {
     this.yyval = this.Node_Expr_Minus(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn208 = function ( attributes ) {
     this.yyval = this.Node_Expr_Mul(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn209 = function ( attributes ) {
     this.yyval = this.Node_Expr_Div(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn210 = function ( attributes ) {
     this.yyval = this.Node_Expr_Mod(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn211 = function ( attributes ) {
     this.yyval = this.Node_Expr_ShiftLeft(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn212 = function ( attributes ) {
     this.yyval = this.Node_Expr_ShiftRight(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn213 = function ( attributes ) {
     this.yyval = this.Node_Expr_UnaryPlus(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn214 = function ( attributes ) {
     this.yyval = this.Node_Expr_UnaryMinus(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn215 = function ( attributes ) {
     this.yyval = this.Node_Expr_BooleanNot(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn216 = function ( attributes ) {
     this.yyval = this.Node_Expr_BitwiseNot(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn217 = function ( attributes ) {
     this.yyval = this.Node_Expr_Identical(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn218 = function ( attributes ) {
     this.yyval = this.Node_Expr_NotIdentical(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn219 = function ( attributes ) {
     this.yyval = this.Node_Expr_Equal(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn220 = function ( attributes ) {
     this.yyval = this.Node_Expr_NotEqual(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn221 = function ( attributes ) {
     this.yyval = this.Node_Expr_Smaller(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn222 = function ( attributes ) {
     this.yyval = this.Node_Expr_SmallerOrEqual(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn223 = function ( attributes ) {
     this.yyval = this.Node_Expr_Greater(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn224 = function ( attributes ) {
     this.yyval = this.Node_Expr_GreaterOrEqual(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn225 = function ( attributes ) {
     this.yyval = this.Node_Expr_Instanceof(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn226 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn227 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn228 = function ( attributes ) {
     this.yyval = this.Node_Expr_Ternary(this.yyastk[ this.stackPos-(5-1) ], this.yyastk[ this.stackPos-(5-3) ], this.yyastk[ this.stackPos-(5-5) ], attributes); 
};

PHP.Parser.prototype.yyn229 = function ( attributes ) {
     this.yyval = this.Node_Expr_Ternary(this.yyastk[ this.stackPos-(4-1) ], null, this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn230 = function ( attributes ) {
     this.yyval = this.Node_Expr_Isset(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn231 = function ( attributes ) {
     this.yyval = this.Node_Expr_Empty(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn232 = function ( attributes ) {
     this.yyval = this.Node_Expr_Include(this.yyastk[ this.stackPos-(2-2) ], "Node_Expr_Include", attributes); 
};

PHP.Parser.prototype.yyn233 = function ( attributes ) {
     this.yyval = this.Node_Expr_Include(this.yyastk[ this.stackPos-(2-2) ], "Node_Expr_IncludeOnce", attributes); 
};

PHP.Parser.prototype.yyn234 = function ( attributes ) {
     this.yyval = this.Node_Expr_Eval(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn235 = function ( attributes ) {
     this.yyval = this.Node_Expr_Include(this.yyastk[ this.stackPos-(2-2) ], "Node_Expr_Require", attributes); 
};

PHP.Parser.prototype.yyn236 = function ( attributes ) {
     this.yyval = this.Node_Expr_Include(this.yyastk[ this.stackPos-(2-2) ], "Node_Expr_RequireOnce", attributes); 
};

PHP.Parser.prototype.yyn237 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Int(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn238 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Double(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn239 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_String(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn240 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Array(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn241 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Object(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn242 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Bool(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn243 = function ( attributes ) {
     this.yyval = this.Node_Expr_Cast_Unset(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn244 = function ( attributes ) {
     this.yyval = this.Node_Expr_Exit(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn245 = function ( attributes ) {
     this.yyval = this.Node_Expr_ErrorSuppress(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn246 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn247 = function ( attributes ) {
     this.yyval = this.Node_Expr_Array(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn248 = function ( attributes ) {
     this.yyval = this.Node_Expr_Array(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn249 = function ( attributes ) {
     this.yyval = this.Node_Expr_ShellExec(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn250 = function ( attributes ) {
     this.yyval = this.Node_Expr_Print(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn251 = function ( attributes ) {
     this.yyval = this.Node_Expr_Closure({'static':  false, 'byRef':  this.yyastk[ this.stackPos-(9-2) ], 'params':  this.yyastk[ this.stackPos-(9-4) ], 'uses':  this.yyastk[ this.stackPos-(9-6) ], 'stmts':  this.yyastk[ this.stackPos-(9-8) ]}, attributes); 
};

PHP.Parser.prototype.yyn252 = function ( attributes ) {
     this.yyval = this.Node_Expr_Closure({'static':  true, 'byRef':  this.yyastk[ this.stackPos-(10-3) ], 'params':  this.yyastk[ this.stackPos-(10-5) ], 'uses':  this.yyastk[ this.stackPos-(10-7) ], 'stmts':  this.yyastk[ this.stackPos-(10-9) ]}, attributes); 
};

PHP.Parser.prototype.yyn253 = function ( attributes ) {
     this.yyval = this.Node_Expr_New(this.yyastk[ this.stackPos-(3-2) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn254 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn255 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-3) ]; 
};

PHP.Parser.prototype.yyn256 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn257 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn258 = function ( attributes ) {
     this.yyval = this.Node_Expr_ClosureUse(this.yyastk[ this.stackPos-(2-2) ].substring( 1 ), this.yyastk[ this.stackPos-(2-1) ], attributes); 
};

PHP.Parser.prototype.yyn259 = function ( attributes ) {
     this.yyval = this.Node_Expr_FuncCall(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn260 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticCall(this.yyastk[ this.stackPos-(6-1) ], this.yyastk[ this.stackPos-(6-3) ], this.yyastk[ this.stackPos-(6-5) ], attributes); 
};

PHP.Parser.prototype.yyn261 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticCall(this.yyastk[ this.stackPos-(8-1) ], this.yyastk[ this.stackPos-(8-4) ], this.yyastk[ this.stackPos-(8-7) ], attributes); 
};

PHP.Parser.prototype.yyn262 = function ( attributes ) {
    
            if (this.yyastk[ this.stackPos-(4-1) ].type === "Node_Expr_StaticPropertyFetch") {
                this.yyval = this.Node_Expr_StaticCall(this.yyastk[ this.stackPos-(4-1) ].Class, this.Node_Expr_Variable(this.yyastk[ this.stackPos-(4-1) ].name, attributes), this.yyastk[ this.stackPos-(4-3) ], attributes);
            } else if (this.yyastk[ this.stackPos-(4-1) ].type === "Node_Expr_ArrayDimFetch") {
                var tmp = this.yyastk[ this.stackPos-(4-1) ];
                while (tmp.variable.type === "Node_Expr_ArrayDimFetch") {
                    tmp = tmp.variable;
                }

                this.yyval = this.Node_Expr_StaticCall(tmp.variable.Class, this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes);
                tmp.variable = this.Node_Expr_Variable(tmp.variable.name, attributes);
            } else {
                throw new Exception;
            }
          
};

PHP.Parser.prototype.yyn263 = function ( attributes ) {
     this.yyval = this.Node_Expr_FuncCall(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn264 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn265 = function ( attributes ) {
     this.yyval = this.Node_Name('static', attributes); 
};

PHP.Parser.prototype.yyn266 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn267 = function ( attributes ) {
     this.yyval = this.Node_Name(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn268 = function ( attributes ) {
     this.yyval = this.Node_Name_FullyQualified(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn269 = function ( attributes ) {
     this.yyval = this.Node_Name_Relative(this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn270 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn271 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn272 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn273 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn274 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn275 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn276 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn277 = function ( attributes ) {
     this.yyval = this.Node_Expr_PropertyFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn278 = function ( attributes ) {
     this.yyval = this.Node_Expr_PropertyFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn279 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn280 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn281 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn282 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn283 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn284 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn285 = function ( attributes ) {
     this.yyval = [this.Scalar_String_parseEscapeSequences(this.yyastk[ this.stackPos-(1-1) ], '`')]; 
};

PHP.Parser.prototype.yyn286 = function ( attributes ) {
     ; this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn287 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn288 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn289 = function ( attributes ) {
     this.yyval = this.Node_Scalar_LNumber(this.Scalar_LNumber_parse(this.yyastk[ this.stackPos-(1-1) ]), attributes); 
};

PHP.Parser.prototype.yyn290 = function ( attributes ) {
     this.yyval = this.Node_Scalar_DNumber(this.Scalar_DNumber_parse(this.yyastk[ this.stackPos-(1-1) ]), attributes); 
};

PHP.Parser.prototype.yyn291 = function ( attributes ) {
     this.yyval = this.Scalar_String_create(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn292 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_LineConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn293 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_FileConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn294 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_DirConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn295 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_ClassConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn296 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_TraitConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn297 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_MethodConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn298 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_FuncConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn299 = function ( attributes ) {
     this.yyval = {type: "Node_Scalar_NSConst", attributes: attributes}; 
};

PHP.Parser.prototype.yyn300 = function ( attributes ) {
     this.yyval = this.Node_Scalar_String(this.Scalar_String_parseDocString(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-2) ]), attributes); 
};

PHP.Parser.prototype.yyn301 = function ( attributes ) {
     this.yyval = this.Node_Scalar_String('', attributes); 
};

PHP.Parser.prototype.yyn302 = function ( attributes ) {
     this.yyval = this.Node_Expr_ConstFetch(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn303 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn304 = function ( attributes ) {
     this.yyval = this.Node_Expr_ClassConstFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn305 = function ( attributes ) {
     this.yyval = this.Node_Expr_UnaryPlus(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn306 = function ( attributes ) {
     this.yyval = this.Node_Expr_UnaryMinus(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn307 = function ( attributes ) {
     this.yyval = this.Node_Expr_Array(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn308 = function ( attributes ) {
     this.yyval = this.Node_Expr_Array(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn309 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn310 = function ( attributes ) {
     this.yyval = this.Node_Expr_ClassConstFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn311 = function ( attributes ) {
     ; this.yyval = this.Node_Scalar_Encapsed(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn312 = function ( attributes ) {
     ; this.yyval = this.Node_Scalar_Encapsed(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn313 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn314 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn315 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn316 = function () {
    this.yyval = this.yyastk[ this.stackPos ];
};

PHP.Parser.prototype.yyn317 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn318 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn319 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(3-3) ], this.yyastk[ this.stackPos-(3-1) ], false, attributes); 
};

PHP.Parser.prototype.yyn320 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(1-1) ], null, false, attributes); 
};

PHP.Parser.prototype.yyn321 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn322 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn323 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn324 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn325 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(6-2) ], this.yyastk[ this.stackPos-(6-5) ], attributes); 
};

PHP.Parser.prototype.yyn326 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn327 = function ( attributes ) {
     this.yyval = this.Node_Expr_PropertyFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn328 = function ( attributes ) {
     this.yyval = this.Node_Expr_MethodCall(this.yyastk[ this.stackPos-(6-1) ], this.yyastk[ this.stackPos-(6-3) ], this.yyastk[ this.stackPos-(6-5) ], attributes); 
};

PHP.Parser.prototype.yyn329 = function ( attributes ) {
     this.yyval = this.Node_Expr_FuncCall(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn330 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn331 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn332 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn333 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn334 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn335 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(2-2) ], attributes); 
};

PHP.Parser.prototype.yyn336 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn337 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn338 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticPropertyFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-4) ], attributes); 
};

PHP.Parser.prototype.yyn339 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn340 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticPropertyFetch(this.yyastk[ this.stackPos-(3-1) ], this.yyastk[ this.stackPos-(3-3) ].substring( 1 ), attributes); 
};

PHP.Parser.prototype.yyn341 = function ( attributes ) {
     this.yyval = this.Node_Expr_StaticPropertyFetch(this.yyastk[ this.stackPos-(6-1) ], this.yyastk[ this.stackPos-(6-5) ], attributes); 
};

PHP.Parser.prototype.yyn342 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn343 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn344 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn345 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.yyastk[ this.stackPos-(4-1) ], this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn346 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), attributes); 
};

PHP.Parser.prototype.yyn347 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn348 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn349 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn350 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn351 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn352 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn353 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn354 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn355 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(1-1) ]; 
};

PHP.Parser.prototype.yyn356 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(4-3) ]; 
};

PHP.Parser.prototype.yyn357 = function ( attributes ) {
     this.yyval = null; 
};

PHP.Parser.prototype.yyn358 = function ( attributes ) {
     this.yyval = []; 
};

PHP.Parser.prototype.yyn359 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn360 = function ( attributes ) {
     this.yyastk[ this.stackPos-(3-1) ].push( this.yyastk[ this.stackPos-(3-3) ] ); this.yyval = this.yyastk[ this.stackPos-(3-1) ]; 
};

PHP.Parser.prototype.yyn361 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn362 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(3-3) ], this.yyastk[ this.stackPos-(3-1) ], false, attributes); 
};

PHP.Parser.prototype.yyn363 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(1-1) ], null, false, attributes); 
};

PHP.Parser.prototype.yyn364 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(4-4) ], this.yyastk[ this.stackPos-(4-1) ], true, attributes); 
};

PHP.Parser.prototype.yyn365 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayItem(this.yyastk[ this.stackPos-(2-2) ], null, true, attributes); 
};

PHP.Parser.prototype.yyn366 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn367 = function ( attributes ) {
     this.yyastk[ this.stackPos-(2-1) ].push( this.yyastk[ this.stackPos-(2-2) ] ); this.yyval = this.yyastk[ this.stackPos-(2-1) ]; 
};

PHP.Parser.prototype.yyn368 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(1-1) ]]; 
};

PHP.Parser.prototype.yyn369 = function ( attributes ) {
     this.yyval = [this.yyastk[ this.stackPos-(2-1) ], this.yyastk[ this.stackPos-(2-2) ]]; 
};

PHP.Parser.prototype.yyn370 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), attributes); 
};

PHP.Parser.prototype.yyn371 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.Node_Expr_Variable(this.yyastk[ this.stackPos-(4-1) ].substring( 1 ), attributes), this.yyastk[ this.stackPos-(4-3) ], attributes); 
};

PHP.Parser.prototype.yyn372 = function ( attributes ) {
     this.yyval = this.Node_Expr_PropertyFetch(this.Node_Expr_Variable(this.yyastk[ this.stackPos-(3-1) ].substring( 1 ), attributes), this.yyastk[ this.stackPos-(3-3) ], attributes); 
};

PHP.Parser.prototype.yyn373 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn374 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(3-2) ], attributes); 
};

PHP.Parser.prototype.yyn375 = function ( attributes ) {
     this.yyval = this.Node_Expr_ArrayDimFetch(this.Node_Expr_Variable(this.yyastk[ this.stackPos-(6-2) ], attributes), this.yyastk[ this.stackPos-(6-4) ], attributes); 
};

PHP.Parser.prototype.yyn376 = function ( attributes ) {
     this.yyval = this.yyastk[ this.stackPos-(3-2) ]; 
};

PHP.Parser.prototype.yyn377 = function ( attributes ) {
     this.yyval = this.Node_Scalar_String(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn378 = function ( attributes ) {
     this.yyval = this.Node_Scalar_String(this.yyastk[ this.stackPos-(1-1) ], attributes); 
};

PHP.Parser.prototype.yyn379 = function ( attributes ) {
     this.yyval = this.Node_Expr_Variable(this.yyastk[ this.stackPos-(1-1) ].substring( 1 ), attributes); 
};


PHP.Parser.prototype.Stmt_Namespace_postprocess = function( a ) {
  return a;  
};


PHP.Parser.prototype.Node_Stmt_Echo = function() {
    return {
        type: "Node_Stmt_Echo",
        exprs: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_If = function() {
    return {
        type: "Node_Stmt_If",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ].stmts,
        elseifs: arguments[ 1 ].elseifs,
        Else: arguments[ 1 ].Else || null,
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_For = function() {
    
    return {
        type: "Node_Stmt_For",
        init: arguments[ 0 ].init,
        cond: arguments[ 0 ].cond,
        loop: arguments[ 0 ].loop,
        stmts: arguments[ 0 ].stmts,
        attributes: arguments[ 1 ]
    };   

};

PHP.Parser.prototype.Node_Stmt_Function = function() {
    return {
        type: "Node_Stmt_Function",
        name: arguments[ 0 ],
        byRef: arguments[ 1 ].byRef,
        params: arguments[ 1 ].params,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Stmt_Class_verifyModifier = function() {
  

};

PHP.Parser.prototype.Node_Stmt_Namespace = function() {
    return {
        type: "Node_Stmt_Namespace",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_Use = function() {
    return {
        type: "Node_Stmt_Use",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_UseUse = function() {
    return {
        type: "Node_Stmt_UseUse",
        name: arguments[ 0 ],
        as: arguments[1],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_TraitUseAdaptation_Precedence = function() {
    return {
        type: "Node_Stmt_TraitUseAdaptation_Precedence",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_TraitUseAdaptation_Alias = function() {
    return {
        type: "Node_Stmt_TraitUseAdaptation_Alias",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_Trait = function() {
    return {
        type: "Node_Stmt_Trait",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_TraitUse = function() {
    return {
        type: "Node_Stmt_TraitUse",
        name: arguments[ 0 ],
        attributes: arguments[ 2 ]
    };  
};

PHP.Parser.prototype.Node_Stmt_Class = function() {
    return {
        type: "Node_Stmt_Class",
        name: arguments[ 0 ],
        Type: arguments[ 1 ].type,
        Extends: arguments[ 1 ].Extends,
        Implements: arguments[ 1 ].Implements,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_ClassMethod = function() {
    return {
        type: "Node_Stmt_ClassMethod",
        name: arguments[ 0 ],
        Type: arguments[ 1 ].type,
        byRef: arguments[ 1 ].byRef,
        params: arguments[ 1 ].params,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_ClassConst = function() {
    return {
        type: "Node_Stmt_ClassConst",
        consts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Interface = function() {
    return {
        type: "Node_Stmt_Interface",
        name: arguments[ 0 ],
        Extends: arguments[ 1 ].Extends,
        stmts: arguments[ 1 ].stmts,
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Throw = function() {
    return {
        type: "Node_Stmt_Throw",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Catch = function() {
    return {
        type: "Node_Stmt_Catch",
        Type: arguments[ 0 ],
        variable: arguments[ 1 ],
        stmts: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_TryCatch = function() {
    return {
        type: "Node_Stmt_TryCatch",
        stmts: arguments[ 0 ],
        catches: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_Foreach = function() {
    return {
        type: "Node_Stmt_Foreach",
        expr: arguments[ 0 ],
        valueVar: arguments[ 1 ],
        keyVar: arguments[ 2 ].keyVar,
        byRef: arguments[ 2 ].byRef,
        stmts: arguments[ 2 ].stmts,
        attributes: arguments[ 3 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_While = function() {
    return {
        type: "Node_Stmt_While",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Do = function() {
    return {
        type: "Node_Stmt_Do",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Break = function() {
    return {
        type: "Node_Stmt_Break",
        num: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Continue = function() {
    return {
        type: "Node_Stmt_Continue",
        num: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Return = function() {
    return {
        type: "Node_Stmt_Return",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Case = function() {
    return {
        type: "Node_Stmt_Case",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Switch = function() {
    return {
        type: "Node_Stmt_Switch",
        cond: arguments[ 0 ],
        cases: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Else = function() {
   
    return {
        type: "Node_Stmt_Else",
        stmts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_ElseIf = function() {
    return {
        type: "Node_Stmt_ElseIf",
        cond: arguments[ 0 ],
        stmts: arguments[ 1 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_InlineHTML = function() {
    return {
        type: "Node_Stmt_InlineHTML",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_StaticVar = function() {
    return {
        type: "Node_Stmt_StaticVar",
        name: arguments[ 0 ],
        def: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_Static = function() {
    return {
        type: "Node_Stmt_Static",
        vars: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Global = function() {
    return {
        type: "Node_Stmt_Global",
        vars: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_PropertyProperty = function() {
    return {
        type: "Node_Stmt_PropertyProperty",
        name: arguments[ 0 ],
        def: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};


PHP.Parser.prototype.Node_Stmt_Property = function() {
    return {
        type: "Node_Stmt_Property",
        Type: arguments[ 0 ],
        props: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  

};

PHP.Parser.prototype.Node_Stmt_Unset = function() {
    return {
        type: "Node_Stmt_Unset",
        variables: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};


PHP.Parser.prototype.Node_Expr_Variable = function( a ) {
    return {
        type: "Node_Expr_Variable",
        name: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };
};

PHP.Parser.prototype.Node_Expr_FuncCall = function() {

    return {
        type: "Node_Expr_FuncCall",
        func: arguments[ 0 ],
        args: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_MethodCall = function() {

    return {
        type: "Node_Expr_MethodCall",
        variable: arguments[ 0 ],
        name: arguments[ 1 ],
        args: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};

PHP.Parser.prototype.Node_Expr_StaticCall = function() {

    return {
        type: "Node_Expr_StaticCall",
        Class: arguments[ 0 ],
        func: arguments[ 1 ],
        args: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};


PHP.Parser.prototype.Node_Expr_Ternary = function() {

    return {
        type: "Node_Expr_Ternary",
        cond: arguments[ 0 ],
        If: arguments[ 1 ],
        Else: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignList = function() {

    return {
        type: "Node_Expr_AssignList",
        assignList: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Assign = function() {

    return {
        type: "Node_Expr_Assign",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignConcat = function() {

    return {
        type: "Node_Expr_AssignConcat",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignMinus = function() {

    return {
        type: "Node_Expr_AssignMinus",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignPlus = function() {

    return {
        type: "Node_Expr_AssignPlus",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignDiv = function() {

    return {
        type: "Node_Expr_AssignDiv",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignRef = function() {

    return {
        type: "Node_Expr_AssignRef",
        variable: arguments[ 0 ],
        refVar: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignMul = function() {

    return {
        type: "Node_Expr_AssignMul",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_AssignMod = function() {

    return {
        type: "Node_Expr_AssignMod",
        variable: arguments[ 0 ],
        expr: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Plus = function() {

    return {
        type: "Node_Expr_Plus",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Minus = function() {

    return {
        type: "Node_Expr_Minus",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Mul = function() {

    return {
        type: "Node_Expr_Mul",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Div = function() {

    return {
        type: "Node_Expr_Div",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Mod = function() {

    return {
        type: "Node_Expr_Mod",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Greater = function() {

    return {
        type: "Node_Expr_Greater",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Equal = function() {

    return {
        type: "Node_Expr_Equal",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_NotEqual = function() {

    return {
        type: "Node_Expr_NotEqual",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Identical = function() {

    return {
        type: "Node_Expr_Identical",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_NotIdentical = function() {

    return {
        type: "Node_Expr_NotIdentical",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_GreaterOrEqual = function() {

    return {
        type: "Node_Expr_GreaterOrEqual",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_SmallerOrEqual = function() {

    return {
        type: "Node_Expr_SmallerOrEqual",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Concat = function() {

    return {
        type: "Node_Expr_Concat",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Smaller = function() {

    return {
        type: "Node_Expr_Smaller",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_PostInc = function() {

    return {
        type: "Node_Expr_PostInc",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PostDec = function() {

    return {
        type: "Node_Expr_PostDec",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PreInc = function() {

    return {
        type: "Node_Expr_PreInc",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PreDec = function() {

    return {
        type: "Node_Expr_PreDec",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Include = function() {
    return {
        expr: arguments[ 0 ],
        type: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };
};

PHP.Parser.prototype.Node_Expr_ArrayDimFetch = function() {

    return {
        type: "Node_Expr_ArrayDimFetch",
        variable: arguments[ 0 ],
        dim: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_StaticPropertyFetch = function() {

    return {
        type: "Node_Expr_StaticPropertyFetch",
        Class: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_ClassConstFetch = function() {

    return {
        type: "Node_Expr_ClassConstFetch",
        Class: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_StaticPropertyFetch = function() {

    return {
        type: "Node_Expr_StaticPropertyFetch",
        Class: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_ConstFetch = function() {

    return {
        type: "Node_Expr_ConstFetch",
        name: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_ArrayItem = function() {

    return {
        type: "Node_Expr_ArrayItem",
        value: arguments[ 0 ],
        key: arguments[ 1 ],
        byRef: arguments[ 2 ],
        attributes: arguments[ 3 ]
    };

};

PHP.Parser.prototype.Node_Expr_Array = function() {

    return {
        type: "Node_Expr_Array",
        items: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_PropertyFetch = function() {

    return {
        type: "Node_Expr_PropertyFetch",
        variable: arguments[ 0 ],
        name: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_New = function() {

    return {
        type: "Node_Expr_New",
        Class: arguments[ 0 ],
        args: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_Print = function() {
    return {
        type: "Node_Expr_Print",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_Exit = function() {
    return {
        type: "Node_Expr_Exit",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_Cast_Bool = function() {
    return {
        type: "Node_Expr_Cast_Bool",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Int = function() {
    return {
        type: "Node_Expr_Cast_Int",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_String = function() {
    return {
        type: "Node_Expr_Cast_String",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Double = function() {
    return {
        type: "Node_Expr_Cast_Double",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Array = function() {
    return {
        type: "Node_Expr_Cast_Array",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Cast_Object = function() {
    return {
        type: "Node_Expr_Cast_Object",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_ErrorSuppress = function() {
    return {
        type: "Node_Expr_ErrorSuppress",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_Isset = function() {
    return {
        type: "Node_Expr_Isset",
        variables: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};




PHP.Parser.prototype.Node_Expr_UnaryMinus = function() {
    return {
        type: "Node_Expr_UnaryMinus",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};


PHP.Parser.prototype.Node_Expr_UnaryPlus = function() {
    return {
        type: "Node_Expr_UnaryPlus",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_Empty = function() {
    return {
        type: "Node_Expr_Empty",
        variable: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_BooleanOr = function() {
    return {
        type: "Node_Expr_BooleanOr",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_LogicalOr = function() {
    return {
        type: "Node_Expr_LogicalOr",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_LogicalAnd = function() {
    return {
        type: "Node_Expr_LogicalAnd",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};


PHP.Parser.prototype.Node_Expr_LogicalXor = function() {
    return {
        type: "Node_Expr_LogicalXor",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseAnd = function() {
    return {
        type: "Node_Expr_BitwiseAnd",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseOr = function() {
    return {
        type: "Node_Expr_BitwiseOr",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseXor = function() {
    return {
        type: "Node_Expr_BitwiseXor",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_BitwiseNot = function() {
    return {
        type: "Node_Expr_BitwiseNot",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_BooleanNot = function() {
    return {
        type: "Node_Expr_BooleanNot",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};

PHP.Parser.prototype.Node_Expr_BooleanAnd = function() {
    return {
        type: "Node_Expr_BooleanAnd",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Instanceof = function() {

    return {
        type: "Node_Expr_Instanceof",
        left: arguments[ 0 ],
        right: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };

};

PHP.Parser.prototype.Node_Expr_Clone = function() {

    return {
        type: "Node_Expr_Clone",
        expr: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };

};



PHP.Parser.prototype.Scalar_LNumber_parse = function( a ) {
   
    return a;  
};

PHP.Parser.prototype.Scalar_DNumber_parse = function( a ) {
   
    return a;  
};

PHP.Parser.prototype.Scalar_String_parseDocString = function() {
    
    return '"' + arguments[ 1 ].replace(/([^"\\]*(?:\\.[^"\\]*)*)"/g, '$1\\"') + '"';
};


PHP.Parser.prototype.Node_Scalar_String = function( ) {
   
    return {
        type: "Node_Scalar_String",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Scalar_String_create = function( ) {
    return {
        type: "Node_Scalar_String",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  

};

PHP.Parser.prototype.Node_Scalar_LNumber = function() {
   
    return {
        type: "Node_Scalar_LNumber",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};


PHP.Parser.prototype.Node_Scalar_DNumber = function() {
   
    return {
        type: "Node_Scalar_DNumber",
        value: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};


PHP.Parser.prototype.Node_Scalar_Encapsed = function() {
   
    return {
        type: "Node_Scalar_Encapsed",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Name = function() {
   
    return {
        type: "Node_Name",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Name_FullyQualified = function() {
   
    return {
        type: "Node_Name_FullyQualified",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Name_Relative = function() {
   
    return {
        type: "Node_Name_Relative",
        parts: arguments[ 0 ],
        attributes: arguments[ 1 ]
    };  
  
};

PHP.Parser.prototype.Node_Param = function() {
   
    return {
        type: "Node_Param",
        name: arguments[ 0 ],
        def: arguments[ 1 ],
        Type: arguments[ 2 ],
        byRef: arguments[ 3 ],
        attributes: arguments[ 4 ]
    };  
  
};

PHP.Parser.prototype.Node_Arg = function() {
   
    return {
        type: "Node_Name",
        value: arguments[ 0 ],
        byRef: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  
  
};

PHP.Parser.prototype.Node_Const = function() {
   
    return {
        type: "Node_Const",
        name: arguments[ 0 ],
        value: arguments[ 1 ],
        attributes: arguments[ 2 ]
    };  
  
};


exports.PHP = PHP;
});

define("ace/mode/php_worker",["require","exports","module","ace/lib/oop","ace/worker/mirror","ace/mode/php/php"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var PHP = require("./php/php").PHP;

var PhpWorker = exports.PhpWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
};

oop.inherits(PhpWorker, Mirror);

(function() {
    this.setOptions = function(opts) {
        this.inlinePhp = opts && opts.inline;
    };
    
    this.onUpdate = function() {
        var value = this.doc.getValue();
        var errors = [];
        if (this.inlinePhp)
            value = "<?" + value + "?>";

        var tokens = PHP.Lexer(value, {short_open_tag: 1});
        try {
            new PHP.Parser(tokens);
        } catch(e) {
            errors.push({
                row: e.line - 1,
                column: null,
                text: e.message.charAt(0).toUpperCase() + e.message.substring(1),
                type: "error"
            });
        }

        this.sender.emit("annotate", errors);
    };

}).call(PhpWorker.prototype);

});

define("ace/lib/es5-shim",["require","exports","module"], function(require, exports, module) {

function Empty() {}

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        var target = this;
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        var args = slice.call(arguments, 1); // for normal call
        var bound = function () {

            if (this instanceof bound) {

                var result = target.apply(
                    this,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        if(target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }
        return bound;
    };
}
var call = Function.prototype.call;
var prototypeOfaray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfaray.slice;
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}
if ([1,2].splice(0).length != 2) {
    if(function() { // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
            var a = new Array(l+2);
            a[0] = a[1] = 0;
            return a;
        }
        var array = [], lengthBefore;
        
        array.splice.apply(array, makeArray(20));
        array.splice.apply(array, makeArray(26));

        lengthBefore = array.length; //46
        array.splice(5, 0, "XXX"); // add one element

        lengthBefore + 1 == array.length

        if (lengthBefore + 1 == array.length) {
            return true;// has right splice implementation without bugs
        }
    }()) {//IE 6/7
        var array_splice = Array.prototype.splice;
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(slice.call(arguments, 2)))
            }
        };
    } else {//IE8
        Array.prototype.splice = function(pos, removeCount){
            var length = this.length;
            if (pos > 0) {
                if (pos > length)
                    pos = length;
            } else if (pos == void 0) {
                pos = 0;
            } else if (pos < 0) {
                pos = Math.max(length + pos, 0);
            }

            if (!(pos+removeCount < length))
                removeCount = length - pos;

            var removed = this.slice(pos, pos+removeCount);
            var insert = slice.call(arguments, 2);
            var add = insert.length;            
            if (pos === length) {
                if (add) {
                    this.push.apply(this, insert);
                }
            } else {
                var remove = Math.min(removeCount, length - pos);
                var tailOldPos = pos + remove;
                var tailNewPos = tailOldPos + add - remove;
                var tailCount = length - tailOldPos;
                var lengthAfterRemove = length - remove;

                if (tailNewPos < tailOldPos) { // case A
                    for (var i = 0; i < tailCount; ++i) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } else if (tailNewPos > tailOldPos) { // case B
                    for (i = tailCount; i--; ) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } // else, add == remove (nothing to do)

                if (add && pos === lengthAfterRemove) {
                    this.length = lengthAfterRemove; // truncate array
                    this.push.apply(this, insert);
                } else {
                    this.length = lengthAfterRemove + add; // reserves space
                    for (i = 0; i < add; ++i) {
                        this[pos+i] = insert[i];
                    }
                }
            }
            return removed;
        };
    }
}
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}
var boxedString = Object("a"),
    splitString = boxedString[0] != "a" || !(0 in boxedString);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                fun.call(thisp, self[i], i, object);
            }
        }
    };
}
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, object);
        }
        return result;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                    object,
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, object)) {
                return false;
            }
        }
        return true;
    };
}
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }
        if (!length && arguments.length == 1) {
            throw new TypeError("reduce of empty array with no initial value");
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }
                if (++i >= length) {
                    throw new TypeError("reduce of empty array with no initial value");
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        }

        return result;
    };
}
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }
        if (!length && arguments.length == 1) {
            throw new TypeError("reduceRight of empty array with no initial value");
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }
                if (--i < 0) {
                    throw new TypeError("reduceRight of empty array with no initial value");
                }
            } while (true);
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        } while (i--);

        return result;
    };
}
if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}
if (!Object.getPrototypeOf) {
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor ?
            object.constructor.prototype :
            prototypeOfObject
        );
    };
}
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        if (!owns(object, property))
            return;

        var descriptor, getter, setter;
        descriptor =  { enumerable: true, configurable: true };
        if (supportsAccessors) {
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;
                return descriptor;
            }
        }
        descriptor.value = object[property];
        return descriptor;
    };
}
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}
if (!Object.create) {
    var createEmpty;
    if (Object.prototype.__proto__ === null) {
        createEmpty = function () {
            return { "__proto__": null };
        };
    } else {
        createEmpty = function () {
            var empty = {};
            for (var i in empty)
                empty[i] = null;
            empty.constructor =
            empty.hasOwnProperty =
            empty.propertyIsEnumerable =
            empty.isPrototypeOf =
            empty.toLocaleString =
            empty.toString =
            empty.valueOf =
            empty.__proto__ = null;
            return empty;
        }
    }

    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = createEmpty();
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            object.__proto__ = prototype;
        }
        if (properties !== void 0)
            Object.defineProperties(object, properties);
        return object;
    };
}

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
    }
}
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
            }
        }
        if (owns(descriptor, "value")) {

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                delete object[property];
                object[property] = descriptor.value;
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}
if (!Object.seal) {
    Object.seal = function seal(object) {
        return object;
    };
}
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        return object;
    };
}
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        return object;
    };
}
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        if (Object(object) === object) {
            throw new TypeError(); // TODO message
        }
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}
if (!Object.keys) {
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if (
            (typeof object != "object" && typeof object != "function") ||
            object === null
        ) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

function toInteger(n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function isPrimitive(input) {
    var type = typeof input;
    return (
        input === null ||
        type === "undefined" ||
        type === "boolean" ||
        type === "number" ||
        type === "string"
    );
}

function toPrimitive(input) {
    var val, valueOf, toString;
    if (isPrimitive(input)) {
        return input;
    }
    valueOf = input.valueOf;
    if (typeof valueOf === "function") {
        val = valueOf.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    toString = input.toString;
    if (typeof toString === "function") {
        val = toString.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    throw new TypeError();
}
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    return Object(o);
};

});

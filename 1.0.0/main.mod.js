import { PolyMod, MixinType } from "https://pml.crjakob.com/cb/PolyTrackMods/PolyModLoader/0.5.2/PolyModLoader.js";

const ElementStack = {
    stack: [],
    
    currentAtDepth(depth = null) {
        if (this.stack.length === 0) {
            console.error("[PUI]: Stack error — no element found at requested depth", {
                requestedDepth: depth,
                stackDepth: this.stack.length
            });
            return null;
        }
        
        if (depth === null) {
            return this.stack[this.stack.length - 1]?.wrapper || null;
        };

        for (let i = this.stack.length - 1; i >= 0; i--) {
            if (this.stack[i].depth <= depth) return this.stack[i].wrapper;
        }
        return null;
    },
    
    push(wrapper, depth) {
        if (this.stack.length > 500) {
            console.warn("[PUI] Stack warning — stack depth exceeded 500 levels. Your stack should not be this deep bro.", {
                currentDepth: depth
            });
        }
        
        this.stack.push({ wrapper, depth });
    },

    popToDepth(depth) {
        if (this.stack.length === 0) {
            console.error("[PUI] Stack error — attempted to pop from an empty ElementStack", {
                depth
            });
        }
                          
        while (this.stack.length > 0 && this.stack[this.stack.length - 1].depth > depth) {
            this.stack.pop();
        }
    },

    clear() {
        this.stack = [];
    }
    
}

class ElementHandler {
    constructor(element, depth = 0) {
        this.el = element;
        this.depth = depth;
    }

    _append(element, depthOffset = 1) {
        const parent = ElementStack.currentAtDepth(this.depth);

        if (!parent) {
            console.error("[PUI] Failed to append — no parent element is available.", {
                depth: this.depth,
                attemptedElement: element
            });
            return this;
        }
        
        
        parent.el.appendChild(element);

        const handler = new ElementHandler(element, this.depth + depthOffset);
        ElementStack.push(handler, handler.depth);

        return handler;
    };
    
    background(color) {
        const target = ElementStack.currentAtDepth(this.depth);
        if (target?.el) {
            target.el.style.background = color;
        }
        return this;
    }
}


// PRESETS
const elementPresets = {
    button: (parent, text) => {
        const button = document.createElement("button");

        if (text) {
            const textEl = document.createTextNode(text);

            button.appendChild(textEl);
        }

        return parent._append(button);
    }
};

class PUI extends PolyMod {
    build(root, fn) {

        if (!root || !root instanceof HTMLElement) {
            console.error("[PUI] Cannot start build — given root is not a valid DOM element", {
                received: root
            });
            return;
        }
        
        const handler = new ElementHandler(root, 0);
        ElementStack.push(handler, 0);
        fn();
        ElementStack.clear();
    };
    
    init = (pml) => {
        pml.registerFuncMixin("polyInitFunction", MixinType.INSERT, "{", `window.PUI = ActivePolyModLoader.getMod("pui");console.log(window.PUI)`);
    };
}

for (const [name, fn] of Object.entries(elementPresets)) {
    ElementHandler.prototype[name] = function(...args) {
        return fn(this, ...args);
    };

    PUI.prototype[name] = function (...args) {
        if (!ElementStack.stack.length) {
            console.error("[PUI] Cannot create UI element — build() has not been called.");
            return;
        }
    
        ElementStack.popToDepth(0);
    
        const rootParent = ElementStack.stack[0].wrapper;
        return fn(rootParent, ...args);
    };



}




export let polyMod = new PUI();

import { PolyMod, MixinType } from "https://pml.crjakob.com/cb/PolyTrackMods/PolyModLoader/0.5.2/PolyModLoader.js";

const ElementStack = {
    stack: [],
    
    currentAtDepth(depth = null) {
        if (depth === null) {
            return this.stack[this.stack.length - 1]?.wrapper || null;
        };

        for (let i = this.stack.length - 1; i >= 0; i--) {
            if (this.stack[i].depth <= depth) return this.stack[i].wrapper;
        }
        return null;
    },
    
    push(wrapper, depth) {
        this.stack.push({ wrapper, depth });
    },

    popToDepth(depth) {
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
        
        parent.el.appendChild(element);

        const handler = new ElementHandler(element, this.depth + depthOffset);
        ElementStack.push(handler, handler.depth);

        return handler;
    };

    button(text) {
        const button = document.createElement("button");

        if (text) {
            const textEl = document.createElement("p");
            textEl.textContent = text;

            button.appendChild(textEl);
        }

        return this._append(button);
    }
    
    background(color) {
        const target = ElementStack.currentAtDepth(this.depth);
        (target?.el)?.style.background = color;
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


for (const [name, fn] of Object.entries(elementPresets)) {

    ElementHandler.prototype[name] = function(...args) {
        return fn(this, ...args);
    };
}

const API = {
    build(root, fn) {
        const handler = new ElementHandler(root, 0);
        ElementStack.push(handler, 0);
        fn();
        ElementStack.clear();
    }
};

for (const [name, fn] of Object.entries(elementPresets)) {
    API[name] = function(...args) {
        const parent = ElementStack.currentAtDepth();
        return fn(parent, ...args);
    };
}

class PUI extends PolyMod {
    init = (pml) => {
        pml.registerFuncMixin("polyInitFunction", MixinType.HEAD, "window.PUI = ActivePolyModLoader.getMod('pui').API");
    }
}


export let polyMod = new PUI();

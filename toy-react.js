const RENDER_TO_DOM = Symbol("render to dom");

class ElementWrapper{
    constructor(type) {
        this.root = document.createElement(type)
    }
    setAttributes(name,value){
        if (name.match(/^on([\s\S]+)$/)){
            this.root.addEventListener(RegExp.$1.replace('/^[\s\S]/',c => c.toLowerCase()),value )
        }else{
            this.root.setAttributes(name,value)
        }
    }
    appendChild(component){
        let range = document.createRange();
        range.setStart(this.root,this.root.childNodes.length);
        range.setEnd(this.root,this.root.childNodes.length)
        component[RENDER_TO_DOM](range);
        // this.root.appendChild(component.root)
    }
    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

class TextWrapper{
    constructor(content) {
        this.root = document.createTextNode(content)
    }
    [RENDER_TO_DOM] (range){
        // this.render()[RENDER_TO_DOM](range);
        range.deleteContents();
        range.insertNode(this.root);
    }
}

export class Component{
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
        this._range = null;
    }
    setAttributes(name, value) {
        this.props[name] = value;
    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM] (range){
        this._range = range
        this.render()[RENDER_TO_DOM](range);
    }
    rerender(){
        this._range.deleteContents();
        this[RENDER_TO_DOM](this._range);
    }
    setState(newState){
        if (this.state === null || typeof this.state !== "object"){
            this.state = newState;
            this.rerender();
            return;
        }
        let merge = (oldState,newState)=>{
            for (let el in newState){
                if (oldState[el] === null || typeof oldState[el] !== "object"){
                    oldState[el] = newState[el];
                }else {
                    merge(oldState[el], newState[el]);
                }
            }
        }

        merge(this.state,newState);
        this.rerender();
    }

    /*get root(){
        if (!this._root){
            this._root = this.render().root;
        }
        return this._root;
    }*/


}




export function createElement(type,attributes,...children){
    let e;
    if (typeof type === "string"){
        e = new ElementWrapper(type);
    }else{
        e = new type;
    }
    if (attributes){
        for (let att in attributes){
            e.setAttributes(att,attributes[att])
        }
    }

    let insertChildren = (children)=>{
        for (let child of children){
            if (typeof child === "string"){
                child = new TextWrapper(child)
            }
            if (typeof child === "object" && child instanceof Array){
                insertChildren(child)
            }else{
                e.appendChild(child);
            }
        }
    }

    insertChildren(children);

    return e;
}


export function render (component,parentElement){

    let range = document.createRange();
    range.setStart(parentElement,0);
    range.setEnd(parentElement,parentElement.childNodes.length)
    range.deleteContents();
    component[RENDER_TO_DOM](range);
    // parentElement.appendChild(component.root)
}
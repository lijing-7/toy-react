import  {createElement,Component,render} from "./toy-react";


class Myconponent extends Component{
    constructor() {
        super();
        this.state = {
            a:'1',
            b:'456798412'
        }
    }

    render(){
        return <div>
            <h1>这是组件</h1>
            <div>{this.state.b}</div>
            {this.children}
        </div>
    }

}

render(
    <Myconponent  id="haha" class="divbox">
        <div>123</div>
        <div>123456</div>
    </Myconponent>,document.body)

// document.body.appendChild(<Myconponent  id="haha" class="divbox">
//             <div>123</div>
//             <div>123456</div>
//            </Myconponent>)

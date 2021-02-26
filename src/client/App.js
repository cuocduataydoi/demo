import React, {Component} from 'react';
import InputNumber from 'react-input-number';
import ReCAPTCHA from "react-google-recaptcha";
import axios from 'axios';

const recaptchaRef = React.createRef(null);


export default class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this)
        this.submit = this.submit.bind(this)
        this.onChangeInputNum = this.onChangeInputNum.bind(this);
    }

    onChangeInputNum(value) {
        this.setState({result:value})
    }

    onChange(value) {
        this.setState({valueCaptcha: value})
    }

    submit() {
        const data = {result:this.state.result,valueCaptcha:this.state.valueCaptcha};
        axios.post('/api/sendResult',{data})
            .then(res => {
               res.data.check ? alert("SUCCESS") : alert("FAIL")
            })
            .catch(error => console.log(error));

    }

    state = {a: null, b: null, result: null, num: null, valueCaptcha: null};

    componentDidMount() {
        fetch('/api/getRandomAandB')
            .then(res => res.json())
            .then(result => this.setState({a: result.a, b: result.b}));

    }

    render() {
        const {username, a, b} = this.state;
        return (
            <div>
                <div>
                    <div>A = {a}</div>
                    <div>B = {b}</div>
                    <div>
                    <div>A+B =</div>
                    <InputNumber  min={10} max={100} step={1} onChange={this.onChangeInputNum}/>
                    </div>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LcofWgaAAAAAFWWPIuULlFJPh4oEpMw34-OGmKq"
                        onChange={this.onChange}
                    />
                    <button onClick={this.submit}>
                        SUBMIT
                    </button>
                </div>
            </div>
        );
    }
}

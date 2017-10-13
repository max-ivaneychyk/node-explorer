import React from 'react';
import Event from './Event';

class PathField extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            path: this.props.path,
            focus: false
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
    }

    onTextChanged(e){
        let text = e.target.value.trim();   // удаляем пробелы
        this.setState({path: text});
    }
    onBlur () {
        this.setState({focus: false});
    }
    onFocus () {
        this.setState({focus: true});
    }
    render() {
        return (
            <div className={[this.state.focus ? "active" : "disable", "explorer-path" ].join(' ')}>
                <input value={this.props.path}
                       onChange={this.onTextChanged}
                       onBlur={this.onBlur}
                       onFocus={this.onFocus}/>
            </div>
        );
    }
}

export default PathField;
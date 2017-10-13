import React from 'react';

class PathField extends React.Component{

    constructor(props){
        super(props);
        this.states = {path: this.props.path};
        this.onTextChanged = this.onTextChanged.bind(this);
    }

    onTextChanged(e){
        var text = e.target.value.trim();   // удаляем пробелы
        this.setState({path: text});
    }

    render() {
        return (
            <div className="explorer-path">
                <input value={this.states.path} onChange={this.onTextChanged} />
            </div>
        );
    }
}

export default PathField;
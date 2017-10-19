import React from 'react';

class SearchPlugin extends React.Component{

    constructor(props){
        super(props);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.state = {
            text: '',
            focus: false
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
        this.componentWillUpdate = this.componentWillUpdate.bind(this);

        props.filter('');
    }
    onTextChanged(e){
        let text = e.target.value.trim();   // удаляем пробелы
        this.setState({text: text});
        this.props.filter(text);
    }
    onBlur () {
        this.setState({focus: false});
    }
    onFocus () {
        this.setState({focus: true});
    }
    componentWillUpdate (nextProps) {
        if (nextProps.path !== this.props.path) {
            this.setState({text: ''});
        }
    }
    render() {
        return (
            <div className={[this.state.focus ? "active" : "disable", "search" ].join(' ')}>
                <input value={this.state.text}
                       placeholder="Поиск по папке"
                       onChange={this.onTextChanged}
                       onBlur={this.onBlur}
                       onFocus={this.onFocus}/>
            </div>
        );
    }
}

export default SearchPlugin;
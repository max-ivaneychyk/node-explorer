let React = require('react');
import PathField from './PathField';

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    render() {
        return(
            <header>
                <menu>
                    <li><p id='open-modal'> Новая папка </p></li>
                    <li><p> Вверх </p></li>
                    <li><p> Обновить</p></li>
                </menu>
                <PathField path={this.props.path}/>
            </header>
        );
    }
}


module.exports = Header;
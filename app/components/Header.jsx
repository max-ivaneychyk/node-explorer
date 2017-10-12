let React = require('react');

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    render() {
        return(
            <header>
                <menu>
                    <li><p data-command="add-folder"> Новая папка </p></li>
                    <li><p> Вверх </p></li>
                    <li><p> Обновить</p></li>
                </menu>
            </header>
        );
    }
}


module.exports = Header;
import React from 'react';
import PathField from './PathField';
import SearchPlugin from './SearchPlugin';
import '../css/header.css';

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
                <SearchPlugin filter={this.filterList} />
            </header>
        );
    }
}


export default Header;
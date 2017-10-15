import React from 'react';
import PathField from './PathField';
import SearchPlugin from './SearchPlugin';
import '../css/header.css';

class Header extends React.Component {
    constructor(props){
        super(props);
        this.state = {chooseFlag: false}

    }
    newFolder () {

    }
    onUp () {

    }
    onReload () {

    }
    onRename () {

    }
    onDelete () {

    }
    render() {
        return(
            <header>
                <menu>
                    <li onClick={this.newFolder}><p id='open-modal'> Новая папка </p></li>
                    <li onClick={this.onUp}><p> Вверх </p></li>
                    <li onClick={this.onReload}><p> Обновить</p></li>
                    <li onClick={this.onRename}><p> Переименовать</p></li>
                    <li onClick={this.onDelete}><p> Удалить</p></li>
                </menu>
                <PathField path={this.props.path}/>
                <SearchPlugin filter={this.filterList} />
            </header>
        );
    }
}


export default Header;
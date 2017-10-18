import React from 'react';
import PathField from './PathField';
import SearchPlugin from './SearchPlugin';
import '../css/header.css';

class Header extends React.Component {
    constructor(props){
        super(props);

        this.onUp = this.onUp.bind(this);
        this.onRename = this.onRename.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onCreateFolder = this.onCreateFolder.bind(this);
    }

    onCreateFolder () {

    }

    onUp () {

    }

    onReload () {

    }

    onRename () {
        this.props.focusFile.onRename();
    }

    onDelete () {
        this.props.focusFile.onDelete();
    }

    render() {
        return(
            <header>
                <menu>
                    <li onClick={this.onCreateFolder}><p id='open-modal'> Новая папка </p></li>
                    <li onClick={this.onUp}><p> Вверх </p></li>
                    <li onClick={this.onReload}><p> Обновить</p></li>
                    <li className={this.props.focusFile ? 'show' : 'hide'} onClick={this.onRename}><p> Переименовать</p></li>
                    <li className={this.props.focusFile ? 'show' : 'hide'} onClick={this.onDelete}><p> Удалить</p></li>
                </menu>
                <PathField path={this.props.path}/>
                <SearchPlugin filter={this.filterList} />
            </header>
        );
    }
}


export default Header;
let React = require('react');

class ContextMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    render() {
        return(
            <nav id="context-menu" className="context-menu">
                <ul className="context-menu__items">
                    <li className="context-menu__item">
                        <a href="#" className="context-menu__link" data-action="context-menu-item-open"><i className="fa fa-eye"></i> Open</a>
                    </li>
                    <li className="context-menu__item">
                        <a href="#" className="context-menu__link" data-action="context-menu-item-rename"><i className="fa fa-eye"></i> Rename</a>
                    </li>
                    <li className="context-menu__item">
                        <a href="#" className="context-menu__link" data-action="context-menu-item-copy"><i className="fa fa-edit"></i> Copy</a>
                    </li>
                    <li className="context-menu__item">
                        <a href="#" className="context-menu__link" data-action="context-menu-item-delete"><i className="fa fa-times"></i> Delete </a>
                    </li>
                </ul>
            </nav>
        );
    }
}

module.exports = ContextMenu;

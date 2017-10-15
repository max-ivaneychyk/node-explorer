import React from 'react';

import ContextMenu from './ContextMenu';
import Header from './Header';
import File from './File';
import Modal from './Modal';
import Event from './Event';
import ajax from './ajax';

import '../css/main.css';
import '../css/contextMenu.css';



class Explorer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            files: props.data.files,
            currentPath: 'D://'
        };

        this.refresh = this.refresh.bind(this);
        this.filterList = this.filterList.bind(this);
        this.renderComponentsFiles = this.renderComponentsFiles.bind(this);
    }

    refresh (path) {
        let newPath = this.state.currentPath.concat(path || '');

        ajax('ls/', {'url': newPath})
            .then(list => {
                this.setState({files: list, currentPath: newPath});
            })
            .catch(error => {
                console.log((error));
            });

    }
    componentDidMount () {
       Event.on('explorer-update', this.refresh);
       Event.on('explorer-search', this.filterList);

       Event.emit('explorer-update');
    }
    filterList(text){
        let filteredList = this.props.data.files.filter(function(file){
            return file.name.toLowerCase().search(text.toLowerCase())!== -1;
        });

        this.setState({files: filteredList});
    }
    renderComponentsFiles () {
        return this.state.files.map(function(data, key){
            return <File key={key} info={data} />
        })
    }
    render() {
        return(
            <div className="explorer">
                <Header path={this.state.currentPath}/>
                <Modal/>
                <ContextMenu/>
                <div>
                    { this.renderComponentsFiles() }
                </div>
            </div>
        );
    }
}

export default Explorer;

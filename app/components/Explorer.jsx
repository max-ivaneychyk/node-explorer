import React from 'react';

import SearchPlugin from './SearchPlugin';
import ContextMenu from './ContextMenu';
import Header from './Header';
import File from './File';
import Modal from './Modal';
import Event from './Event';


let ajax = require('./ajax');



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
        ajax('ls/', {'url': newPath}, function (list) {
            if(list.error) {
                console.log(list.error);
                return;
            }

            this.setState({files: list, currentPath: newPath});
        }.bind(this));
    }
    componentDidMount () {
       Event.on('explorer-update', this.refresh);
       Event.emit('explorer-update');
    }
    filterList(text){
        var filteredList = this.props.data.files.filter(function(file){
            return file.name.toLowerCase().search(text.toLowerCase())!== -1;
        });
        console.log(filteredList);
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
                <SearchPlugin filter={this.filterList} />
                <div>
                    { this.renderComponentsFiles() }
                </div>
            </div>
        );
    }
}

module.exports = Explorer;

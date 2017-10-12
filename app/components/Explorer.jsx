let React = require('react');
let SearchPlugin = require('./SearchPlugin');
let ContextMenu = require('./ContextMenu');
let Header = require('./Header');
let File = require('./File');
let ajax = require('./ajax');

class Explorer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            files: props.data.files,
            currentPath: 'D://'
        };

        this.refresh = this.refresh.bind(this);
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
        this.refresh()
    }
    filterList(text){
    //    var filteredList = this.props.data.items.filter(function(item){
    //        return item.toLowerCase().search(text.toLowerCase())!== -1;
    //    });
    //    this.setState({items: filteredList});
    }

    render() {
        let refresh = this.refresh;

        return(
            <div className="explorer">
                <Header/>
                <ContextMenu/>
                <SearchPlugin filter={this.filterList} />
                <div>
                    {
                        this.state.files.map(function(data, key){
                            return <File key={key} info={data} refresh={refresh}/>
                        })
                    }
                </div>
            </div>
        );
    }
}

module.exports = Explorer;

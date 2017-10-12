let React = require('react');


class File extends React.Component {
    constructor(props) {
        super(props);
        this.state = {info: props.info, refresh: props.refresh};
        this.onOpen = this.onOpen.bind(this);
        this.onRename = this.onRename.bind(this);
    }
    onOpen (e) {
      let elem = e.target;
      let path = elem.getAttribute('data-path');

      this.state.refresh(path);
    }
    onRename (e) {
    //    console.log('rename');
    //    this.setState({info: {name: 'Some' , format: 'file'}})
    }
    isDrive () {
        return !!this.state.info.mounted;
    }
    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
        console.log(88888, nextProps);
        console.log("componentWillReceiveProps()");
    }
    componentWillMount(){
        console.log("componentWillMount()");
    }
    componentDidMount(){
        console.log("componentDidMount()");
    }
    componentWillUnmount(){
        console.log("componentWillUnmount()");
    }
    shouldComponentUpdate(){
        console.log("shouldComponentUpdate()");
        return true;
    }
    componentWillUpdate(nextProps, nextState){
        console.log(nextProps, nextState);
        console.log("componentWillUpdate()");
    }
    componentDidUpdate(){
        console.log("componentDidUpdate()");
    }
    render() {
        let info = this.state.info;
        let driveFlag = this.isDrive();
        let name = driveFlag ? info.mounted : info.name;

        let format;
        let path;

        if (info.format === 'directory') {
            path = name + '/';
            format = 'folder';
        } else if (info.format === 'file') {
            path = name;
            format = 'file-';
        } else if (driveFlag) {
            path = name + '//';
            format = 'drive';
        }

        return (
            <div className="file" >
                <div className={[format, 'icon'].join(' ')}> </div>
                <h3 className="title"> {name} </h3>
                <div onDoubleClick={this.onOpen} onClick={this.onRename} className="event-layer" data-path={path}> </div>
            </div>
        );
    }
}

module.exports = File;

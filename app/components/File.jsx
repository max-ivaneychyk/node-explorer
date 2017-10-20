import React from "react";

class File extends React.Component {
	constructor(props) {
		super(props);
		this.state = { renameFlag: false, changedName: props.data.name };
		this.onOpen = this.onOpen.bind(this);
		this.onSelect = this.onSelect.bind(this);
		this.onStartRename = this.onStartRename.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onEndRename = this.onEndRename.bind(this);
		this.onTypeNewName = this.onTypeNewName.bind(this);
		this.editNameRender = this.editNameRender.bind(this);
		this.componentDidUpdate = this.componentDidUpdate.bind(this);
	}

	onOpen(e) {
		let elem = e.target;
		let path = elem.getAttribute("data-path");
		this.props.changeCurrentPath(this.props.currentPath.concat(path));
	}

	onSelect(e) {
		e.target.classList.add("selected-file");
		this.props.onFocus(this);
	}

	onStartRename() {
		this.setState({ renameFlag: true });
	}

	onTypeNewName(e) {
		let text = e.target.value.trim(); // удаляем пробелы
		let hasBadSymbols = /[\/:*?"<>|]/.test(text);
		if (!hasBadSymbols) {
			this.setState({ changedName: text });
		}
	}
	onEndRename() {
		this.setState({ renameFlag: false });
		this.props.onRenameFile(this.props.data.name, this.state.changedName);
	}
	onDelete() {
		this.props.onDeleteFile(this.props.data.name);
	}
	editNameRender(name) {
		let inputStyle = {
			zIndex: 100,
			width: "100%",
			marginLeft: 0,
			textAlign: "left"
		};

		return (
			<input
				className="title"
				ref="inputChangeName"
				value={this.state.changedName}
				onChange={this.onTypeNewName}
				onBlur={this.onEndRename}
				type="text"
				style={inputStyle}
			/>
		);
	}

	normalNameRender(name) {
		return <h3 className="title"> {name} </h3>;
	}

	render() {
		let data = this.props.data;

		return (
			<div className="one-file">
				<div className={[data.format, "icon"].join(" ")}> </div>
				{this.state.renameFlag
					? this.editNameRender(data.name)
					: this.normalNameRender(data.name)}
				<div
					onDoubleClick={this.onOpen}
					onClick={this.onSelect}
					className="event-layer"
					data-path={data.path}
				>
					{" "}
				</div>
			</div>
		);
	}

	componentDidUpdate() {
		if (this.refs.inputChangeName) {
			this.refs.inputChangeName.focus();
		}
	}
}

export default File;

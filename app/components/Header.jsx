import React from "react";
import PathField from "./PathField";
import SearchPlugin from "./SearchPlugin";

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.onExitUp = this.onExitUp.bind(this);
		this.onRename = this.onRename.bind(this);
		this.onReload = this.onReload.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onCreateFolder = this.onCreateFolder.bind(this);
	}

	onCreateFolder() {
		this.props.onCreateFolder();
	}

	onExitUp() {
		this.props.onExitUp();
	}

	onReload() {
		this.props.onReload();
	}

	onRename() {
		this.props.focusFile.onStartRename();
	}

	onDelete() {
		this.props.focusFile.onDelete();
	}

	render() {
		return (
			<header>
				<menu className={this.props.currentPath ? "show" : "hide"}>
					<li onClick={this.onCreateFolder}>
						<p id="open-modal"> Новая папка </p>
					</li>
					<li onClick={this.onExitUp}>
						<p> Вверх </p>
					</li>
					<li onClick={this.onReload}>
						<p> Обновить</p>
					</li>
					<li
						className={this.props.focusFile ? "show" : "hide"}
						onClick={this.onRename}
					>
						<p> Переименовать</p>
					</li>
					<li
						className={this.props.focusFile ? "show" : "hide"}
						onClick={this.onDelete}
					>
						<p> Удалить</p>
					</li>
				</menu>
				<PathField path={this.props.path} />
				<SearchPlugin filter={this.props.filterList} path={this.props.path} />
			</header>
		);
	}
}

export default Header;

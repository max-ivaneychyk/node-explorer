import Rest from "../rest";

import React from "react";
import Header from "./Header";
import File from "./File";

class Explorer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			files: props.data.files,
			focusFile: null,
			currentPath: ""
		};

		this.onFocus = this.onFocus.bind(this);
		this.onExitUp = this.onExitUp.bind(this);
		this.onReload = this.onReload.bind(this);
		this.onDeleteFile = this.onDeleteFile.bind(this);
		this.onRenameFile = this.onRenameFile.bind(this);
		this.filterList = this.filterList.bind(this);
		this.updateFiles = this.updateFiles.bind(this);
		this.onCreateFolder = this.onCreateFolder.bind(this);
		this.deleteSelected = this.deleteSelected.bind(this);
		this.changeCurrentPath = this.changeCurrentPath.bind(this);
		this.renderComponentsFiles = this.renderComponentsFiles.bind(this);
	}

	onCreateFolder() {
		let nameNewFolder = "New Folder ";
		let names = this.state.files.map(({ name }) => {
			return name;
		});

		for (let i = 1; i <= names.length; i++) {
			if (!names.includes(nameNewFolder.concat(i))) {
				nameNewFolder += i;
				break;
			}
		}

		let dir = this.state.currentPath + nameNewFolder + "/";
		Rest.post("file", { dir })
			.then(list => {
                this.props.data.files.push({
                    format: 'directory',
                    name: nameNewFolder,
                    renameFlag: true,
                    path: nameNewFolder + '/'
                });

                this.setState({files: this.props.data.files});
            })
			.catch(error => {
				console.log(error);
			});
	}

	onExitUp() {
		let path = this.state.currentPath.replace(/[^\/]*\/$/, "");
		if (!path.includes("//")) {
			path = "";
		}
		this.changeCurrentPath(path);
	}

	onRenameFile(oldName, newName) {
		let path = this.state.currentPath;
		if (oldName === newName) {
			return false;
		}

		Rest.put("file", {
			path: path + oldName,
			newPath: path + newName
		})
			.then( () => {
                this.props.data.files.forEach((file) => {
                	if (file.name === oldName) {
                		file.name = newName;
					}
                });
                this.setState({files: this.props.data.files});
            })
			.catch(error => {
				console.log(error);
			});
	}

	onDeleteFile(name) {
		let path = this.state.currentPath;

		Rest.del("file", { dir: path + name })
			.then( () => {
                let updatenFiles = this.props.data.files.filter((file) => {
                    return file.name !== name;
				});
                this.setState({files: updatenFiles});
            })
			.catch(error => {
				console.log(error);
			});
	}
	onReload(newPath = this.state.currentPath) {
		Rest.get("files", { path: newPath })
			.then(list => {
				this.updateFiles(list);
				localStorage.setItem("current-path", newPath);
			})
			.catch(e => console.log(e));
	}

	updateFiles(list) {
		this.props.data.files = list;
		this.setState({ files: list });
	}

	changeCurrentPath(fullPath) {
		this.setState({ currentPath: fullPath });
		this.onReload(fullPath);
		this.deleteSelected();
	}

	onFocus(file) {
		this.setState({ focusFile: file });
	}

	deleteSelected() {
		let selected = document.body.getElementsByClassName("selected-file");
		for (let el of selected) {
			el.classList.remove("selected-file");
		}
		this.setState({ focusFile: null });
	}

	componentDidMount() {
		this.changeCurrentPath(localStorage.getItem("current-path"));
	}

	filterList(text) {
		let filteredList = this.props.data.files.filter(function(file) {
			return file.name.toLowerCase().search(text.toLowerCase()) !== -1;
		});

		this.setState({ files: filteredList });
	}

	renderComponentsFiles() {
		let pathFix = {
			drive: "//",
			directory: "/"
		};

		return this.state.files.map((data, key) => {
			data.name = data.mounted || data.name;
			data.path = data.name + (pathFix[data.format] || "");

			return (
				<File
					key={key}
					data={data}
					onFocus={this.onFocus}
					onRenameFile={this.onRenameFile}
					onDeleteFile={this.onDeleteFile}
					currentPath={this.state.currentPath}
					changeCurrentPath={this.changeCurrentPath}
				/>
			);
		});
	}

	render() {
		return (
			<div className="explorer">
				<Header
					{...this.state}
					onExitUp={this.onExitUp}
					onReload={this.onReload}
					filterList={this.filterList}
					onCreateFolder={this.onCreateFolder}
					path={this.state.currentPath}
				/>

				<div className="wrap" onMouseDown={this.deleteSelected}>
					{this.renderComponentsFiles()}
				</div>
			</div>
		);
	}
}

export default Explorer;

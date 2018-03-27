import "../css/options.css";
import * as ReactDOM from "react-dom";
import React from "react";
import {addEntry, entries, removeEntry} from "./keyword_access";
import PropTypes from "prop-types";

export class OptionsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {items: null};
        this.fetchItems();
        this.bindFunctions();
    }

    bindFunctions() {
        this.removeItem = this.removeItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.changeItem = this.changeItem.bind(this);
    }

    fetchItems() {
        return entries().then((items) => this.setState({items: items}));
    }

    removeItem(item) {
        removeEntry(item).then(() => this.fetchItems());
    }

    changeItem(key, data) {
        removeEntry(key).then(() => this.addItem(data)).then(() => this.fetchItems());
    }

    addItem(item) {
        return addEntry(item.url, item.id, item.key).then(() => this.fetchItems());
    }

    render() {
        let items = this.state.items;
        let listItems = [];

        for (let key in items) {
            listItems.push(<OptionsListItem
                removeItem={this.removeItem}
                changeItem={this.changeItem}
                key={key}
                accessKey={key}
                selector={items[key]["id"]}
                url={items[key]["url"]}/>)
        }

        return (<table className="table table-striped" id="entries-table">
            <thead>
            <tr>
                <th>Keyword</th>
                <th>Url</th>
                <th>Selector</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody id="entries-table-body">{listItems}</tbody>

        </table>);
    }

    static propTypes = {}
}

export class OptionsListItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.onChangeClick = this.onChangeClick.bind(this);
    }

    initialState() {
        return  {
            id: this.props.selector,
            key: this.props.accessKey,
            url: this.props.url
        };
    }

    onRemoveClick() {
        this.props.removeItem(this.state.key);
    }

    onChangeClick() {
        this.props.changeItem(this.props.accessKey, this.state);
    }

    render() {

        return <tr>
            <td><input type="text" name="key" value={this.state.key} onChange={(e) => this.setState({key:e.target.value})}/></td>
            <td><input type="text" name="url" value={this.state.url} onChange={(e) => this.setState({url:e.target.value})}/></td>
            <td><input type="text" name="selector" value={this.props.selector} disabled/></td>
            <td>
                <button className="btn btn-success btn-xs" onClick={this.onChangeClick}>update</button>&nbsp;
                <button className="btn btn-danger btn-xs" onClick={this.onRemoveClick}>delete</button>
            </td>
        </tr>;
    }

    static propTypes = {
        accessKey: PropTypes.string,
        url: PropTypes.string,
        selector: PropTypes.string,
        removeItem: PropTypes.func,
        changeItem: PropTypes.func
    }

}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<OptionsList/>, document.getElementById("content"));
});

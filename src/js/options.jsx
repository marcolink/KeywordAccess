import "../css/options.css";
import * as ReactDOM from "react-dom";
import React from "react";
import {entries, removeEntry} from "./keyword_access";
import PropTypes from "prop-types";

export class OptionsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {items: null};
        this.fetchItems();
    }

    fetchItems() {
        entries().then((items) => this.setState({items: items}));
    }

    render() {
        let items = this.state.items;
        let listItems = [];

        for (let key in items) {
            listItems.push(<OptionsListItem key={key} accessKey={key} url={items[key]["url"]}/>)
        }

        console.info(`${listItems.length} items to add`);

        return (<table className="table table-striped" id="entries-table">
            <thead>
            <tr>
                <th>Keyword</th>
                <th>Url</th>
                <th>Delete</th>
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
        this.onRemoveClick = this.onRemoveClick.bind(this);
    }

    onRemoveClick() {
        console.debug(`remove ${this.props.accessKey}|${this.props.url}`);
        removeEntry(this.props.accessKey);
    }

    render() {
        return <tr>
            <td>{this.props.accessKey}</td>
            <td>{this.props.url}</td>
            <td>
                <button className="btn btn-danger btn-xs" onClick={this.onRemoveClick}>x</button>
            </td>
        </tr>;
    }

    static propTypes = {
        accessKey: PropTypes.string,
        url: PropTypes.string,
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<OptionsList/>, document.getElementById("content"));
});

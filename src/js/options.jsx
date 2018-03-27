import "../css/options.css";
import * as ReactDOM from "react-dom";
import React from "react";
import {entries, removeEntry} from "./keyword_access";
import PropTypes from "prop-types";

export class OptionsList extends React.Component {

    render() {
        let listItems = [];

        entries().then((items) => {
            for (let key in items) {
                listItems.push(<OptionsListItem accessKey={key} url={items[key]["url"] || "no url set"}/>)
            }
        }).catch(error => console.error(error));

        return <table className="table table-striped" id="entries-table">{listItems}</table>;
    }

    static propTypes = {
        accessKey: PropTypes.instanceOf(String),
        url: PropTypes.instanceOf(String)
    }
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
        accessKey: PropTypes.instanceOf(String),
        url: PropTypes.instanceOf(String)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(React.createElement(OptionsList, {}, null), document.body.appendChild(document.createElement('div')))
});

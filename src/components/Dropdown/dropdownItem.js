/**
 * Created by KosiakMD on 09.01.17.
 */
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

export default class DropdownItem extends Component {
	constructor (props) {
		super (props)

	}

	select(value, text){
		this.props.onClick(value, text)
		!this.props.isSelected && this.props.onChange(value, text);
	}

	render(){
		const {text, value, isSelected} = this.props;

		const classNames = isSelected ? ' dropdown--item-is-selected ' : '';

		return <div onClick={()=>this.select(value, text)}
						className={'dropdown--item ' + classNames}>
				{text}
			</div>
	}

}
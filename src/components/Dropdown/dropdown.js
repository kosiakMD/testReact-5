/**
 * Created by KosiakMD on 09.01.17.
 */
import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';

import DropdownItem from './dropdownItem';

export default class Dropdown extends Component {

	constructor (props) {
		super (props)

		this.state = {
			dropdownClassName: 'dropdown',
			selectedValue: props.selectedValue || null,
			options: props.options || [],
			title: props.title || 'Select Item',
			closeOnSelect: true,
			open: false,
		}
		this.mounted = false;
		this.onBlur();
	}

	componentWillReceiveProps(newProps){
		this.setState({title: newProps.title})
	}

	componentDidMount(){
		this.mounted = true;
	}

	onBlur(){
		document.addEventListener('click',(event)=>{
			if(!this.state.open) return;
			let close = true;
			// console.log(event.path)
			event.path.map((el)=>{
				if(el.classList && el.classList.contains(this.state.dropdownClassName.trim()))
					close = false;
			})
			close && this.setState({open: false})
		})
	}

	closeDropdown(){
		this.setState({open: false})
	}

	toggleDropdown(){
		// console.log('toggle',this.state.open)
		this.setState({open: !this.state.open})
	}

	onChange(value, text){
		// console.log('Changed to: ' + value);
		this.props.onSelectedValueChanged && this.props.onSelectedValueChanged(value, text);
	}

	onSelect(value, text) {
		// console.log('Selected: ' + value);
		this.setState({
			selectedValue: value,
		});
		this.state.closeOnSelect && this.closeDropdown()
	}

	dropOptions() {
		let options = this.state.options.map((obj, index)=>{
			// let optionData = ['value','text'];
			let selected, value, text;
			for(let key in obj){
				selected = (this.state.selectedValue == key) ? true : false;
				value = key;
				text = obj[key];
			}
			return <DropdownItem
					onClick = {this.onSelect.bind(this)}
					onChange = {this.onChange.bind(this)}
					key = {index}
					text = {text}
					value = {value}
					isSelected = {selected}
				/>
		})
		return options;
	}

	render (){

		const {selectedValue,} = this.props;

		return (
			<div className={this.state.dropdownClassName + (this.state.open ? ' dropdown-is-opened' : ' ')}>
				<div className={'dropdown-title ' + ( !selectedValue && !this.state.selectedValue ? ' dropdown-is-selected ' : null )}
						onClick={()=>this.toggleDropdown()}>
					{this.state.title}
				</div>
				<div className='dropdown-carret'></div>

				{this.state.open ?
					<div className='dropdown--list '>
						{this.dropOptions()}
					</div>
					: null}
			</div>
		)

	}

}
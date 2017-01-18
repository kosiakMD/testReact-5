import React, { Component } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Dropdown from '../../components/Dropdown/dropdown';

//Actions
import * as mainActions from '../../actions/MainActions'

const data = {
	title: 'Select country',
	selectedCountryId: '2',
	countries: [
		{
			id: '1',
			name: 'Ukraine'
		},
		{
			id: '2',
			name: 'USA'
		},
		{
			id: '3',
			name: 'England'
		},
		{
			id: '4',
			name: 'Spain'
		},
		{
			id: '5',
			name: 'Poland'
		}
	]
}

class App extends Component {

	dataFormated(){
		let array = data.countries.map((obj)=>{
			let tempObj = {};
			return {...tempObj, [obj.id]: obj.name};
		})
		return array;
	}

	render() {
		const { main,} = this.props;
		const { onSelectedValueChanged, } = this.props.mainActions;

		return(
			<div>
				<Dropdown
					selectedValue = {data.selectedCountryId}
					options = {this.dataFormated()}
					title = {data.title}
					//title = {main.title||data.title}
					//onSelectedValueChanged = {onSelectedValueChanged}
				/>

			</div>
		)
	}
}

function mapStateToProps (state) {
	return {
		main: state.main,
	}
}

function mapDispatchToProps(dispatch, state) {
	return {
		mainActions: bindActionCreators(mainActions, dispatch, state),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
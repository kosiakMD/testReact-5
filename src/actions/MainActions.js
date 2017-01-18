import {
	ON_SELECTED_VALUE_CHANGED,
} from '../constants/Main'


export function onSelectedValueChanged(value, text) {

	return function(dispatch) {

		dispatch({
			type: ON_SELECTED_VALUE_CHANGED,
			value: value,
			title: text,
		})

	}

}
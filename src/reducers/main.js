import {
	ON_SELECTED_VALUE_CHANGED,
} from '../constants/Main'


const initialState = {
	title: '',
	value: '',
}


export default function user(state = initialState, action) {

	switch(action.type) {

		case ON_SELECTED_VALUE_CHANGED:
			return { ...state, title: action.title, value: action.value }

		default:
			return state
	}

}
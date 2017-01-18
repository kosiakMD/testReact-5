// import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
// import { createStore } from 'redux'
import { Provider } from 'react-redux'

//Containers
import App from './containers/App/App';
// import {App} from 'containers';

//Configuration
import configureStore from './store/configureStore'

const store = configureStore()
// createStore( () => {}, {}) //WAT ;)

render(
	<Provider store={store}>
		<div className='app'>
			<App />
		</div>
	</Provider>,
	document.getElementById('root')
)


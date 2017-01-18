/*eslint-disable */
export const ping = store => next => action => {
	// console.log(`${action.type} | `)
	return next(action)
}
/*eslint-enable */
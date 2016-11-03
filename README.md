# react-classname-prefix-loader
A Webpack loader that prefixes classes with custom prefix in React components

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

MyComponent.js

```jsx
class MyComponent extends React.Component {
  render () {
    return <div className='myclass'></div>
  }
}

export default MyComponent
```

Output:

```jsx
class MyComponent extends React.Component {
  render () {
    return <div className='your_prefix-myclass'></div>
  }
}

export default MyComponent
```

Also works with [classnames](https://github.com/JedWatson/classnames) module!

## Installation
```
$ npm install react-classname-prefix-loader --save-dev 
```

## Usage

```javascript
module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['react-hot', 'babel-loader', 'react-classname-prefix-loader?prefix=your_prefix'],
			},
		],
	},
```

## Recommendation
* Use it with [postcss-class-prefix](https://github.com/thompsongl/postcss-class-prefix) for css files
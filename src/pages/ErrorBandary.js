import React from 'react'
import Maintenance from '../pages/Maintenance'
import PropTypes from 'prop-types'
// import {Loading} from '../components'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hasError: false, error: null}
  }

  // static getDerivedStateFromError(error) {
  //   // Update state so the next render will show the fallback UI.
  //   return {hasError: true, error}
  // }

  componentDidCatch(error) {
    // Catch errors in any components below and re-render with error message
    console.log(error)
    this.setState({
      error: error,
      hasError: true,
    })
    // You can also log error messages to an error reporting service here
  }

  render() {
    console.log(this.state)
    if (this.state.hasError) {
      // Error path
      return <Maintenance />
    }
    // Normally, just render children
    else {
      return this.props.children
    }
    // return (
    //   <Suspense
    //     fallback={
    //       this.state.error?.status === 502 ? (
    //         <Maintenance />
    //       ) : (
    //         <div className="w-full h-full flex items-center justify-center">
    //           <Loading />
    //         </div>
    //       )
    //     }
    //   >
    //     {this.props.children}
    //   </Suspense>
    // )
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default ErrorBoundary

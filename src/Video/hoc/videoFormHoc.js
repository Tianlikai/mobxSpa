import AuthComponent from 'libs/AuthComponent'

const videoFormHoc = config => WrappedComponent => {
  return class extends AuthComponent {
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

export default videoFormHoc

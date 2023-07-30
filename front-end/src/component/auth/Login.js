import React, { Component } from 'react'
import axios from 'axios'
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/actions/authActions';
import classNames from 'classnames'; //for the validations

class Login extends Component {
  constructor() {
    super();
    this.state = {

      email: '',
      password: '',
      errors: {}

    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    //want to check to see if the user is authenticated
    if (nextProps.auth.isAuthenticated){
      this.props.navigate('/dashboard')
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault();

    const UserData = {

      email: this.state.email,
      password: this.state.password,

    };
    this.props.loginUser(UserData); //CALL THE ACTION OF REDUX

   // console.log(User); //i can use it to check my react is working befor axios
   //axios.post('/api/users/login',User)
 //.then(res=>console.log(res.data))
 //.catch(err=>console.log(err.response.data))// to see the exact value of the input ,but i can also use err.data 
   //instead of diplay the error in console i just want to see it in erro {} 
   //.catch(err => this.setState({ errors: err.response.data }))  
}
  render() {
    const { errors } = this.state //which is equal to const errors = this.state.errors
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevConnector account</p>
              <form   onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input type="email"
                    //className="form-control form-control-lg"
                    //adding validation on our login
                   className={classnames("form-control form-control-lg", {
                    'is-invalid': errors.email
                  })}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />

{errors.email && (<div className='invalid-feedback'>{errors.email}</div>)}
                </div>
                <div className="form-group">
                  <input type="password"
                   // className="form-control form-control-lg"
                   //adding validation on our login
                   className={classnames("form-control form-control-lg", {
                    'is-invalid': errors.password
                  })}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  {errors.password && (<div className='invalid-feedback'>{errors.password}</div>)}
                </div>
                <input type="submit"
                  className="btn btn-info btn-block mt-4" />

              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

//export default Login;

export default connect(mapStateToProps, { loginUser })(props => {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
});
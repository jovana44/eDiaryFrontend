import React, { Component } from 'react';
import '../../style/common/login.css';

class Login extends Component{
    constructor(props){
        super(props);
        this.state ={
            username:'', password:'', errorMessage:''
        };
    }

    handleInputChange = (event) => {      
        const target = event.target;
        const name = target.name;
      
        this.setState({
            [name]: target.value
        });      
    }    
    
    handleSubmit = (event) => {

        const requestOptions = {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
               //'Authorization': 'Basic ' //+ btoa('user1:pass')
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        };

        fetch('http://localhost:8080/users/login', requestOptions)
        .then(response => {
            if(response.ok){
                response.json().then(data =>{ 
                    this.setState({errorMessage: ''})
                    localStorage.setItem("user", btoa(data.username+":"+data.password));
                    localStorage.setItem("ID",  data.id);
                    localStorage.setItem("role",  data.role);
                    this.props.history.push("/");
                });
            }else{
                response.text().then(message => this.setState({errorMessage:message}))
            }
        })
        .catch(error => console.log(error))
        event.preventDefault();
    };

    render(){
        return(
            <div className="back">
            <div className="login_form">
            <form  onSubmit={this.handleSubmit}>
             <input 
                    type="text" 
                    name="username"
                    placeholder="Enter username"
                    onChange={this.handleInputChange} />

               <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter password"
                    onChange={this.handleInputChange} />
                                    
                <input type="submit" value="Submit" className="submit" />
                <label className="error">{this.state.errorMessage}</label>
            </form>
        </div>
        </div>
        )
    };
}
export default Login;
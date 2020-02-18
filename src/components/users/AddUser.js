import React, { Component } from 'react';

class AddUser extends Component{
    constructor(props) {
        super(props);
        this.state ={username:'', 
                    password:'', 
                    repeatedPassword:'',
                    code:'',
                    firstName:'',
                    lastName: '',
                    role: '',
                    errorMessage:'', 
                    disable: false
                };
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser) {
            this.props.history.push("/users/login");
        }else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        }          
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        
        this.setState({
            [name]: target.value
        });
    }    
    
    handlePassword = (event) => {
        const target = event.target;
        const name = target.name;
 
        if(this.state.repeatedPassword!=='' && target.value!==this.state.repeatedPassword) {      
            this.setState({errorMessage:"Passwords do not match!", disable: true})
        }else {
            this.setState({errorMessage:"", disable:false, [name]: target.value})
        }
    }

    handleRepeatedPassword = (event) => {
        const target = event.target;
        const name = target.name;
 
        if(this.state.password!==target.value) {      
            this.setState({errorMessage:"Passwords do not match!", disable: true})
        }else {
            this.setState({errorMessage:"", disable:false, [name]: target.value})
        }
    }
    
    handleSubmit = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem("user")
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                personDto:{  
                        code: this.state.code,
                        firstName: this.state.firstName,
                        lastName: this.state.lastName
                },
                uRoleDto:{
                        name: this.state.role
                }
            })
        };
        
        fetch('http://localhost:8080/users/createuser' , requestOptions)
        .then(response => 
            {
                if(response.ok) {
                    response.json().then(data => {
                        this.setState({errorMessage: ''})
                        this.props.history.push("/users");
                    });
                }else {
                    response.text().then(message => this.setState({errorMessage: message}))
                }
            })
        .catch(error => console.log(error))
        event.preventDefault();
    };

    render() {
        return (
            <div className="login_form">
                <form onSubmit={this.handleSubmit}>
                <label> Username: 
                <input 
                    type="text" 
                    name="username"
                    placeholder="Enter username"
                    onChange={this.handleInputChange} />
                </label>
                <label> Password: 
                <input 
                    type="password" 
                    name="password"
                    placeholder="Enter password"
                    onChange={this.handlePassword} />
                </label>
                <label> Repeated password:
                <input 
                        type="password" 
                        name="repeatedPassword" 
                        placeholder="Enter password again"
                        onChange={this.handleRepeatedPassword} />
                </label>  
                <label> Code: 
                <input 
                    type="text" 
                    name="code"
                    placeholder="Enter code"
                    onChange={this.handleInputChange} />
                </label>
                <label> First name: 
                <input 
                    type="text" 
                    name="firstName"
                    placeholder="Enter first name"
                    onChange={this.handleInputChange} />
                </label>
                <label> Last name: 
                <input 
                    type="text" 
                    name="lastName"
                    placeholder="Enter last name"
                    onChange={this.handleInputChange} />
                </label>
                <label> Role: 
                <input 
                    type="text" 
                    name="role"
                    placeholder="Enter role"
                    onChange={this.handleInputChange} />
                </label>              
                <input type="submit" value="Add" disabled={this.state.disable} className="submit"/>
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/users")} />
                <label className="error">{this.state.errorMessage}</label>
            </form> 
            </div>
           
        )
    }
};

export default AddUser;

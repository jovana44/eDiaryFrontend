import React, { Component } from 'react';
import '../../style/common/login.css'

class UpdateUser extends Component{
    constructor(props){
        super(props);
        this.state = { id:'', 
                    username: '',
                    password:'', 
                    repeatedPassword:'',
                    personDto:null, 
                    uRoleDto:null, 
                    disable: false, 
                    errorMessage:''  };
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser){
            this.props.history.push("/users/login");
        } else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        }else{
        const path = 'http://localhost:8080/users/'+this.props.match.params.id;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch(path, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({ id: data.id,
                                username: data.username,
                                personDto: data.personDto,
                                uRoleDto: data.uRoleDto })
            });
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;

        if(name==='name'){
          this.setState({
              uRoleDto: {...this.state.uRoleDto, name: target.value}
             } );
        }else if(name==='username'||name==='password'){
            this.setState({
                [name]: target.value
               } );
        }else{
            this.setState({
                personDto: {...this.state.personDto, [name]: target.value}
               } );
        }
    
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
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem("user")
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                personDto:{  
                        code: this.state.personDto.code,
                        firstName: this.state.personDto.firstName,
                        lastName: this.state.personDto.lastName
                },
                uRoleDto:{
                        name: this.state.uRoleDto.name
                }
            })
        };
        
        const path = 'http://localhost:8080/users/update/' + this.state.id;
        fetch( path, requestOptions)
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
           {
               this.state.username && 
               <form onSubmit={this.handleSubmit}>
               <input 
                   type="text" 
                   name="username"
                   placeholder="Change username"
                   value={this.state.username}
                   onChange={this.handleInputChange} />

               <input 
                   type="password" 
                   name="password" 
                   placeholder="Change password"
                   value={this.state.password}
                   onChange={this.handlePassword} />

                <input 
                        type="password" 
                        name="repeatedPassword" 
                        placeholder="Enter password again"
                        onChange={this.handleRepeatedPassword} />
               
                <input 
                    type="text" 
                    name="code"
                    placeholder="Enter code"
                    value={this.state.personDto.code}
                    onChange={this.handleInputChange} />
              
                <input 
                    type="text" 
                    name="firstName"
                    placeholder="Change first name"
                    value={this.state.personDto.firstName}
                    onChange={this.handleInputChange} />
             
                <input 
                    type="text" 
                    name="lastName"
                    placeholder="Change last name"
                    value={this.state.personDto.lastName}
                    onChange={this.handleInputChange} />
             
                <input 
                    type="text" 
                    name="name"
                    placeholder="Change role"
                    value={this.state.uRoleDto.name}
                    onChange={this.handleInputChange} />
                                   
               <input type="submit" value="Change" className="submit" />
               <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/users")} />
               <label className="error">{this.state.errorMessage}</label>
           </form>
           }
              
           </div>
        )
    }
}

export default UpdateUser;
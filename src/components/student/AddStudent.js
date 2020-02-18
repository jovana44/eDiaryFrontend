import React, { Component } from 'react';
import '../../style/common/login.css';

class AddStudent extends Component{
    constructor(props) {
        super(props);
        this.state = {code: '', firstName:'', lastName:'',parents:[], email:'', errorMessage:''};
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser) {
            this.props.history.push("/users/login");
        }else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        } else{
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch('http://localhost:8080/parents', requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({parents: data })    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }
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
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem("user")
            },
            body: JSON.stringify({
                code: this.state.code,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                parentDto:{ email: this.state.email },
                classDto:{ id: this.props.match.params.id }
            })
        };
        
        fetch('http://localhost:8080/students' , requestOptions)
        .then(response => 
            {
                if(response.ok) {
                    response.json().then(data => {
                        this.setState({errorMessage: ''})
                        this.props.history.push("/classes/"+this.props.match.params.id+"/students");
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
                <input 
                    type="text" 
                    name="code"
                    placeholder="Enter code"
                    onChange={this.handleInputChange} />

                <input 
                    type="text" 
                    name="firstName" 
                    placeholder="Enter first name"
                    onChange={this.handleInputChange} />

                <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Enter last name"
                    onChange={this.handleInputChange} />

                <label className="activity">Parent's email is:</label>
                <select onChange={this.handleInputChange} name="email" value={this.state.email} >
                    {
                        this.state.parents &&
                        this.state.parents.map(p =>
                            <option key={p.id} value={p.email}>{p.email}</option>

                        )
                    }
                </select>  
                                    
                <input type="submit" value="Add" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/classes/"+this.props.match.params.id+"/students")} />
                <label className="error">{this.state.errorMessage}</label>
            </form> 
            </div>
           
        )
    }
};

export default AddStudent;

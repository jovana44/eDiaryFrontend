import React, { Component } from 'react';
import '../../style/common/login.css'



class AddSubject extends Component{
    constructor(props) {
        super(props);
        this.state = {code: '', name:'', errorMessage:''};
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
    
    handleSubmit = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem("user")
            },
            body: JSON.stringify({
                code: this.state.code,
                name: this.state.name
            })
        };
        
        fetch('http://localhost:8080/subjects' , requestOptions)
        .then(response => 
            {
                if(response.ok) {
                    response.json().then(data => {
                        this.setState({errorMessage: ''})
                        this.props.history.push("/subjects");
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
                    name="name" 
                    placeholder="Enter name"
                    onChange={this.handleInputChange} />
                                    
                <input type="submit" value="Add" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/subjects")} />
                <label className="error">{this.state.errorMessage}</label>
            </form> 
            </div>
           
        )
    }
};

export default AddSubject;

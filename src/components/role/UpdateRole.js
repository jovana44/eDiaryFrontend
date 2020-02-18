import React, { Component } from 'react';
import '../../style/common/login.css'


class UpdateRole extends Component {
    constructor(props) {
        super(props);
        this.state = { role: null };
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser){
            this.props.history.push("/users/login");
        } else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        } else{
        const path = 'http://localhost:8080/roles/'+this.props.match.params.id;
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+localStorage.getItem("user")
                }
            };
            fetch(path, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({role: data})
            });
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        
        this.setState({
            role: {...this.state.role, [name]: target.value}
        });
    }    
    
    handleSubmit = (event) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ localStorage.getItem("user")
            },
            body: JSON.stringify({
                code: this.state.role.code,
                name: this.state.role.name
            })
        };
        
        const path = 'http://localhost:8080/roles/' + this.state.role.id;
        fetch( path, requestOptions)
        .then(response => 
            {
                if(response.ok) {
                    response.json().then(data => {
                        this.setState({errorMessage: ''})
                        this.props.history.push("/roles");
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
                this.state.role && 
                <form onSubmit={this.handleSubmit}>
                <input 
                    type="text" 
                    name="code"
                    placeholder="Change code"
                    value={this.state.role.code}
                    onChange={this.handleInputChange} />

                <input 
                    type="text" 
                    name="name" 
                    placeholder="Change name"
                    value={this.state.role.name}
                    onChange={this.handleInputChange} />
                                    
                <input type="submit" value="Change" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/roles")} />
                <label className="error">{this.state.errorMessage}</label>
            </form>
            }
               
            </div>
           
        )
    }
};

export default UpdateRole;
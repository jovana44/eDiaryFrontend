import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from '../common/Table';
import '../../style/user/users.css'

class Roles extends Component{
    constructor(props) {
        super(props);
        this.state = { roles: [] };
    }

    componentDidMount(){

        if(localStorage.getItem('user') === null) {
            this.props.history.push('/users/login');
        } else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        } else{
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch('http://localhost:8080/roles', requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({roles: data})    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    updateRole = (id) => {
        this.props.history.push("/roles/updateRole/"+id);
    }

    deleteRole = (id) => {
        const path = 'http://localhost:8080/roles/' + id;
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ localStorage.getItem("user")
            }
        };
        fetch(path, requestOptions)
        .then(response => {
            if (response.ok) {
                response.json().then(data => 
                    this.setState({roles: this.state.roles.filter(role => role.id!==data.id)})
                );
            }else {
                response.text().then(message => alert(message))
            }
        })
        .catch(error => console.log(error))
    }

    render() {

        const heading=["ID", "Code", "Name", "", ""];
        const buttons=[
            {name: "Update", action: this.updateRole, class: "btn-update"}, 
            {name: "Delete", action: this.deleteRole, class: "btn-update"}];
        
        return (
            <div className="user_wrapper">
                {
                    this.state.roles && 
                    <Table heading={heading} data={this.state.roles} buttons={buttons}></Table>
                    
                } 
                <Link to="/roles/addRole">Add new role</Link>
            </div>
           
        )
    }
};

export default Roles;

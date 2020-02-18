import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Table from '../common/Table';
import '../../style/user/users.css'

class Activities extends Component{
    constructor(props) {
        super(props);
        this.state = { activities: [] };
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
            fetch('http://localhost:8080/activities', requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({activities: data})    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    updateActivity = (id) => {
        this.props.history.push("/activities/update/"+id);
    }

    deleteActivity = (id) => {
        const path = 'http://localhost:8080/activities/' + id;
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
                    this.setState({activities: this.state.activities.filter(activity => activity.id!==data.id)})
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
            {name: "Update", action: this.updateActivity, class: "btn-update"}, 
            {name: "Delete", action: this.deleteActivity, class: "btn-update"}];
        
        return (
            <div className="user_wrapper">
                {
                    this.state.activities && 
                    <Table heading={heading} data={this.state.activities} buttons={buttons}></Table>
                    
                } 
                <Link to="/activities/addActivity">Add new activity</Link>
            </div>
           
        )
    }
};

export default Activities;

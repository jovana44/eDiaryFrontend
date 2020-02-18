import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import '../../style/user/users.css'

class Users extends Component{
    
    constructor(props){
        super(props);
        this.state = { users : [] };
    }

    componentDidMount() {

    if(localStorage.getItem('user') === null) {
          this.props.history.push('/users/login');
    }else if(!(localStorage.getItem('role') === "admin")){
        this.props.history.push('/');
    }else{
          const requestOptions = {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic '+localStorage.getItem("user")
              }
          };

          fetch('http://localhost:8080/users', requestOptions)
          .then(response => {
              if(response.ok) {
                  response.json().then(data =>
                      this.setState({users: data})    
                  )
              }else {
                  response.text().then(message => alert(message))
              }
          })
          .catch(error => console.log(error))
      }    
    }

    updateUser = (id) => {
      this.props.history.push("/users/updateUser/"+id);
    }

    deleteUser = (id)=>{

      const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+localStorage.getItem("user")
        }
    };
    fetch('http://localhost:8080/users/'+ id, requestOptions)
    .then(response => {
        if (response.ok) {
            response.json().then(data => 
                this.setState({users: this.state.users.filter(user => user.id!==data.id)})
            );
        }else {
            response.text().then(message => alert(message))
        }
    })
    .catch(error => console.log(error))
    }

    render() {
        const heading=["ID", "Username", "Firstname", "Lastname","Role", '', ''];
        
        return (  
            <div className="user_wrapper">
            <table>
              <thead>
                  <tr>
                  {
                      heading.map((item, index) => 
                          <th key={index}>{item}</th>
                      )
                  }
                  </tr>
              </thead>
              <tbody>
              {
                this.state.users.map(user => 
                  <tr key={user.id}>
                   <td>{user.id}</td>

                    <td>{user.username}</td>
                    <td>{user.personDto.firstName}</td>
                    <td>{user.personDto.lastName}</td>
                    <td>{user.uRoleDto.name}</td>
                    <td><button onClick={()=>this.updateUser(user.id)}>Update</button></td>
                    <td><button onClick={()=>this.deleteUser(user.id)}>Delete</button></td>
                  </tr>
                )
              }
              </tbody>
            </table>
            
            <Link  to="/users/addUser">Add new user</Link>
            <div>or</div>
            <Link  to="/roles">Add new role</Link>
          
            </div>
          );
    }
}

export default withRouter(Users);
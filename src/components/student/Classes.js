import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import '../../style/user/users.css'

class Classes extends Component{
    
    constructor(props){
        super(props);
        this.state = { classes : [] };
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

          fetch('http://localhost:8080/classes', requestOptions)
          .then(response => {
              if(response.ok) {
                  response.json().then(data =>
                      this.setState({classes: data})    
                  )
              }else {
                  response.text().then(message => alert(message))
              }
          })
          .catch(error => console.log(error))
      }    
    }

    updateClass = (id) => {
      this.props.history.push("/classes/update/"+id);
    }

    getStudents = (id) =>{
        this.props.history.push("/classes/"+id+"/students");
    }
    deleteClass = (id)=>{

      const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+localStorage.getItem("user")
        }
    };
    fetch('http://localhost:8080/classes/'+ id, requestOptions)
    .then(response => {
        if (response.ok) {
            response.json().then(data => 
                this.setState({classes: this.state.classes.filter(c => c.id!==data.id)})
            );
        }else {
            response.text().then(message => alert(message))
        }
    })
    .catch(error => console.log(error))
    }

    render() {
        
        return (  
            <div className="user_wrapper">
            <table>
              <thead>
                  <tr>
                  <th>ID</th>
                 <th>Classes</th>
                 <th>School year</th>
                 <th></th>
                 <th> <button><Link to="/semesters">Add new semester </Link></button></th>
                 <th></th>
                  </tr>
              </thead>
              <tbody>
              {
                this.state.classes.map(c => 
                  <tr key={c.id}>
                   <td>{c.id}</td>

                    <td>{c.year}-{c.numberOfClass}</td>
                    <td>{c.schYearDto.name}</td>
                    <td><button onClick={()=>this.updateClass(c.id)}>Update</button></td>
                    <td><button onClick={()=>this.deleteClass(c.id)}>Delete</button></td>
                    <td><button onClick={()=>this.getStudents(c.id)}>Students</button></td>
                  </tr>
                )
              }
              </tbody>
            </table>
            <Link to="/classes/addClass">Add new class</Link>
           

            </div>
          );
    }
}

export default withRouter(Classes);
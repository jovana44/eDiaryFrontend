import React, { Component } from 'react';
import '../../style/user/users.css'

class Students extends Component{
    
    constructor(props){
        super(props);
        this.state = { students : [] };
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

          fetch('http://localhost:8080/classes/getStudents/'+ this.props.match.params.id , requestOptions)
          .then(response => {
              if(response.ok) {
                  response.json().then(data =>
                      this.setState({students: data})    
                  )
              }else {
                  response.text().then(message => alert(message))
              }
          })
          .catch(error => console.log(error))
      }    
    }

    updateStudent = (id) => {
      this.props.history.push("/classes/update/"+id);
    }

    getMarks = (studentId) =>{
        this.props.history.push("/classes/"+this.props.match.params.id+"/students/"+studentId);
    }

    deleteStudent = (id)=>{

      const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+localStorage.getItem("user")
        }
    };
    fetch('http://localhost:8080/students/'+ id, requestOptions)
    .then(response => {
        if (response.ok) {
            response.json().then(data => 
                this.setState({students: this.state.students.filter(s => s.id!==data.id)})
            );
        }else {
            response.text().then(message => alert(message))
        }
    })
    .catch(error => console.log(error))
    }

    addStudent=()=>{
        this.props.history.push("/classes/"+this.props.match.params.id+"/addstudent");
    }

    render() {

        return (  
            <div className="user_wrapper">
            <table>
              <thead>
                  <tr>
                 <th>ID</th>
                 <th>Student</th>
                 <th></th>
                 <th><button onClick={()=>this.addStudent()}>Add new student</button></th>
                 <th></th>
                  </tr>
              </thead>
              <tbody>
              {
                this.state.students.map(s => 
                  <tr key={s.id}>
                   <td>{s.id}</td>
                    <td>{s.firstName} {s.lastName}</td>
                    <td><button onClick={()=>this.updateStudent(s.id)}>Update</button></td>
                    <td><button onClick={()=>this.deleteStudent(s.id)}>Delete</button></td>
                    <td><button onClick={()=>this.getMarks(s.id)}>Marks</button></td>
                  </tr>
                )
              }
              </tbody>
            </table>
            </div>
          );
    }
}

export default Students;
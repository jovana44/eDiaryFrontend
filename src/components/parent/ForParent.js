import React, { Component } from 'react';
import '../../style/parent/parent.css';

class ForParent extends Component{

    constructor(props){
        super(props);
        this.state={ students:[], parent:null };
    }

    componentDidMount(){

        if(localStorage.getItem('user') === null) {
            this.props.history.push('/users/login');
        } else if(!(localStorage.getItem('role') === "parent")){
            this.props.history.push("/");
        } else{
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch('http://localhost:8080/parents/'+ localStorage.getItem("ID"), requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({students: data.studentsDto,
                                         parent: data})    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    getMarks=(studentId)=>{
        this.props.history.push("/parentgrading/" + studentId  );

    }
    render(){

        return(
            <div className="parent">
            {
                this.state.parent &&
                <h4>{this.state.parent.firstName} {this.state.parent.lastName}<br/>email: {this.state.parent.email}</h4>
            }
            <div>
            <h5> Your children:</h5>
            <div>
               
                {
                    this.state.students &&
                    this.state.students.map(student =>
                       
                        <div key={student.id}> <button className="children" onClick={()=>this.getMarks(student.id)} >{student.firstName} {student.lastName}</button></div>
                      )
                }
              
            </div>
            </div>            
            </div>
        )
    }
};

export default ForParent;


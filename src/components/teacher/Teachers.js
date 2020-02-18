import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../style/user/users.css'
import Modal from '../common/Modal';

class Teachers extends Component{
    constructor(props) {
        super(props);
        this.state = { teachers: [], teacher:null, openDialog:false };
    }

    componentDidMount(){

        if(localStorage.getItem('user') === null) {
            this.props.history.push('/users/login');
        } else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        } else  {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch('http://localhost:8080/teachers', requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({teachers: data})    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    openDetails = (id) => {
        let teacher = this.state.teachers.find(t => t.id === id);
        this.setState({openDialog: true, teacher: teacher});
    }

    closeDetails = () => {
        this.setState({teacher:null, openDialog:false})
    }

    updateTeacher = (id) => {
        this.props.history.push("/teachers/update/"+id);
    }

    deleteTeacher = (id) => {
        const path = 'http://localhost:8080/teachers/' + id;
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
                    this.setState({teachers: this.state.teachers.filter(teacher => teacher.id!==data.id)})
                );
            }else {
                response.text().then(message => alert(message))
            }
        })
        .catch(error => console.log(error))
    }

    render() {

        const heading=["ID", "Teacher","", "", ""];
        const buttons=[
            {name: "Subjects", action: this.openDetails, class: "btn-update"},
            {name: "Update", action: this.updateTeacher, class: "btn-update"}, 
            {name: "Delete", action: this.deleteTeacher, class: "btn-update"}
              ];
        
        return (
            <div className="user_wrapper">
            <Modal show={this.state.openDialog} onClose={this.closeDetails}>
                    <ol>
                            {
                               this.state.teacher && this.state.teacher.subjectsDto.map(item=>
                                    <li key={item.id}>
                                      {item.name}
                                    </li>
                                )
                            }
                    </ol>
                </Modal>
                {
                    this.state.teachers && 
                    <table>
                <thead>
                    <tr>
                        {heading.map((head, index) => 
                            <th key={index}>{head}</th>    
                        )}
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.teachers.map(teacher=>
                            <tr key={teacher.id}>
                                <td>{teacher.id}</td>
                                <td>{teacher.firstName} {teacher.lastName} </td>
                               
                                {
                                    buttons.map(btn => (
                                        <td key={btn.name}><button className={btn.class} onClick={()=>btn.action(teacher.id)}>{btn.name}</button></td>
                                    ))
                                }   
                            </tr>  
                             
                        )
                    }
                </tbody>
            </table>
                } 
                <Link to="/teachers/addTeacher">Add new teacher</Link>
            </div>
           
        )
    }
};

export default Teachers;

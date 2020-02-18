import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../style/user/users.css'

class Semesters extends Component{
    constructor(props) {
        super(props);
        this.state = { semesters: [] };
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
            fetch('http://localhost:8080/semesters', requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({semesters: data})    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    updateSemester = (id) => {
        this.props.history.push("/semesters/update/"+id);
    }

    deleteSemester = (id) => {
        const path = 'http://localhost:8080/semesters/' + id;
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
                    this.setState({semesters: this.state.semesters.filter(semester => semester.id!==data.id)})
                );
            }else {
                response.text().then(message => alert(message))
            }
        })
        .catch(error => console.log(error))
    }

    render() {

        const heading=["ID", "Code", "Number", "Semester start", "Semester End", "School year",  "", ""];
        const buttons=[
            {name: "Update", action: this.updateSemester, class: "btn-update"}, 
            {name: "Delete", action: this.deleteSemester, class: "btn-update"}];
        
        return (
            <div className="user_wrapper">
                {
                    this.state.semesters && 
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
                        this.state.semesters.map(sem=>
                            <tr key={sem.id}>
                                <td>{sem.id}</td>
                                <td>{sem.code}</td>
                                <td>{sem.numberOfSem}</td>
                                <td>{sem.semesterStart}</td>
                                <td>{sem.semesterEnd}</td>
                                <td>{sem.schYearDto.name}</td>
                                {
                                    buttons.map(btn => (
                                        <td key={btn.name}><button className={btn.class} onClick={()=>btn.action(sem.id)}>{btn.name}</button></td>
                                    ))
                                }   
                            </tr>  
                             
                        )
                    }
                </tbody>
            </table>
                    
                } 
                <Link to="/semesters/addSemester">Add new semester</Link>
            </div>
           
        )
    }
};

export default Semesters;

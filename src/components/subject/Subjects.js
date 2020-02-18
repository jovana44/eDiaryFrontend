import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../style/user/users.css'
import Modal from '../common/Modal';

class Subjects extends Component{
    constructor(props) {
        super(props);
        this.state = { subjects: [],show: false, subject:null };
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
            fetch('http://localhost:8080/subjects', requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({subjects: data})    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    openDetails = (id) => {
        let subject = this.state.subjects.find(s => s.id === id);
        this.setState({show: true, subject: subject});
    }

    closeDetails = () => {
        this.setState({subject:null, show:false})
    }

    updateSubject = (id) => {
        this.props.history.push("/subjects/update/"+id);
    }

    deleteSubject = (id) => {
        const path = 'http://localhost:8080/subjects/' + id;
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
                    this.setState({subjects: this.state.subjects.filter(subject => subject.id!==data.id)})
                );
            }else {
                response.text().then(message => alert(message))
            }
        })
        .catch(error => console.log(error))
    }

    render() {

        const heading=["ID", "Code", "Name", "", "", ""];
        const buttons=[
            {name: "Teachers", action: this.openDetails, class: "btn-update"},
            {name: "Update", action: this.updateSubject, class: "btn-update"}, 
            {name: "Delete", action: this.deleteSubject, class: "btn-update"}
            ];
        
        return (
            <div className="user_wrapper">
            <Modal show={this.state.show} onClose={this.closeDetails}>
                    <ol>
                            {
                               this.state.subject && this.state.subject.teachersDto.map((item, ind)=>
                                    <li key={item.id}>
                                        {item.firstName} {item.lastName}
                                    </li>
                                )
                            }
                      </ol>  
                </Modal>
                {
                    this.state.subjects && 
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
                        this.state.subjects.map(subject=>
                            <tr key={subject.id}>
                                <td>{subject.id}</td>
                                <td>{subject.code}</td>
                                <td>{subject.name}</td>
                                {
                                    buttons.map(btn => (
                                        <td key={btn.name}><button className={btn.class} onClick={()=>btn.action(subject.id)}>{btn.name}</button></td>
                                    ))
                                }   
                            </tr>  
                             
                        )
                    }
                </tbody>
            </table>
                } 
                <Link to="/subjects/addSubject">Add new subject</Link>
            </div>
          
        )
    }
};

export default Subjects;

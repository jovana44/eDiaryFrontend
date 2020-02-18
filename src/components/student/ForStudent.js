import React, { Component } from 'react';
import '../../style/student/forstudent.css';
import Modal from '../common/Modal';

class ForStudent extends Component{

    constructor(props){
        super(props);
        this.state={ subjects:[], show: false, mark:null,  errorMessage:''};
    }

    componentDidMount(){

        if(localStorage.getItem('user') === null) {
            this.props.history.push('/users/login');
        } else if(!(localStorage.getItem('role') === "student")){
            this.props.history.push("/");
        }else{
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch('http://localhost:8080/gradings/'+ localStorage.getItem("ID")+'/student', requestOptions)
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
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ localStorage.getItem("user")
            }
        };
        fetch('http://localhost:8080/gradings/' + id, requestOptions)
        .then(response => {
            if(response.ok) {
                response.json().then(data =>
                    this.setState({ mark: data, show:true})    
                )
            }else {
                response.text().then(message => alert(message))
            }
        })
        .catch(error => console.log(error));
    }

    closeDetails = () => {
        this.setState({mark: null, show: false});
    }

    render(){
        const heading=["ID", "Subject","Teacher", "I", "II"];

        return(
            <div className="table_wrapper">
            <Modal show={this.state.show} onClose={this.closeDetails}>
                    {
                        this.state.mark && 
                        <div className="modal_content">
                        <ul>
                            <li> Mark:   {this.state.mark.mark}</li>
                            <li> Activity:  {this.state.mark.activityDto.name}</li>
                            <li> Date:  {this.state.mark.date}</li>
                            </ul>
                        </div>
                    }
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
                            <tr key={subject.subjectDto.id}>
                                <td>{subject.subjectDto.id}</td>
                                <td>{subject.subjectDto.name}</td>
                                <td>
                                    {
                                        subject.subjectDto.teachersDto.map(teacher=>
                                            <span key={teacher.id}>{teacher.firstName} {teacher.lastName}</span>
                                        )
                                    }
                                </td>
                                <td className="marks">
                                {
                                    subject.marksFirstSem &&
                                    subject.marksFirstSem.map(mark=>
                                        <div key={mark.id} className="mark">
                                    <button onClick={()=>this.openDetails(mark.id)}>{mark.mark}</button> </div>
                                )
                                }
                                </td>
                                <td className="marks" >
                                {
                                    subject.marksSecondSem &&
                                  subject.marksSecondSem.map(mark=>
                                    <div key={mark.id} className="mark">
                                    <button  onClick={()=>this.openDetails(mark.id)}>{mark.mark}</button></div>
                                )
                                }
                                </td>
                            </tr>  
                             
                        )
                    }
                </tbody>
            </table>
                }
            </div>
        )
    }
};

export default ForStudent;


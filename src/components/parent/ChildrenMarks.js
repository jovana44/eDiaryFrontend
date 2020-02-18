import React, { Component } from 'react';
import '../../style/student/forstudent.css';
import Modal from '../common/Modal';
import '../../style/common/modal.css'

class ChildrenMarks extends Component{

    constructor(props){
        super(props);
        this.state={ subjects:[], student:null, show: false, mark:null,errorMessage:''};
    }

    componentDidMount(){

        if(localStorage.getItem('user') === null) {
            this.props.history.push('/users/login');
        } else if(!(localStorage.getItem('role') === "parent")){
            this.props.history.push("/");
        }else{
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch('http://localhost:8080/gradings/'+ this.props.match.params.studentId +'/student', requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({subjects: data})    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error));

            fetch('http://localhost:8080/students/'+ this.props.match.params.studentId, requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({student: data})    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error));

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
                        <caption>{
                            this.state.student &&
                            <h4>{this.state.student.firstName} {this.state.student.lastName} ,   
                            <label>  odeljenje: {this.state.student.classDto.year}-{this.state.student.classDto.numberOfClass}</label></h4>
                        }</caption>
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

export default ChildrenMarks;


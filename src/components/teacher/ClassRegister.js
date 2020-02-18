import React, { Component } from 'react';
import '../../style/teacher/classRegister.css';

class ClassRegister extends Component{

    constructor(props){
        super(props);
        this.state={ students:[] };

    }

    componentDidMount(){

        if(localStorage.getItem('user') === null) {
            this.props.history.push('/users/login');
        } else if(!(localStorage.getItem('role') === "teacher")){
            this.props.history.push('/');
        } else  {
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+ localStorage.getItem("user")
                }
            };
            fetch('http://localhost:8080/gradings/'+localStorage.getItem("ID")+'/teacher/'+
            this.props.match.params.currentSubjectId+'/subject/'+this.props.match.params.id+'/class' , requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({students: data })    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    addMark = (studentId) => {
        this.props.history.push("/student/" + studentId + "/subject/"+ this.props.match.params.currentSubjectId+
                                "/class/"+this.props.match.params.id);
    }

    details = (markId) => {
        this.props.history.push("/grading/" + markId +"/subject/"+ this.props.match.params.currentSubjectId+
                            "/class/"+this.props.match.params.id );
    }

    render(){
        const heading=["ID", "Student","I", "II", ""];

        return(
            <div className="table_wrapper">
                {
                    this.state.students && 
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
                        this.state.students.map(student=>
                            <tr key={student.studentDto.id}>
                                <td>{student.studentDto.id}</td>
                                <td className="student_name">{student.studentDto.firstName} {student.studentDto.lastName}</td>
                                <td className="marks">
                                {
                                    student.marksFirstSem &&
                                    student.marksFirstSem.map(mark=>
                                        <div key={mark.id} className="mark">
                                    <button onClick={(e)=>this.details(mark.id)}>{mark.mark}</button> </div>
                                )
                                }
                                </td>
                                <td className="marks" >
                                {
                                    student.marksSecondSem &&
                                  student.marksSecondSem.map(mark=>
                                    <div key={mark.id} className="mark">
                                    <button  onClick={(e)=>this.details(mark.id)}>{mark.mark}</button></div>
                                )
                                }
                                </td>
                                <td> <button onClick={()=>this.addMark(student.studentDto.id)}>Add mark</button></td>
                            </tr>  
                             
                        )
                    }
                </tbody>
            </table>
                }
            </div>
        )
    }

}

export default ClassRegister;
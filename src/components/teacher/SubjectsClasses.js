import React, { Component } from 'react';
import '../../style/user/users.css';
import '../../style/common/table.css'

class SubjectsClasses extends Component{

    constructor(props){
        super(props);
        this.state={ subjects:[], currentSubjectId:'',  classes:[], errorMessage:''};
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
            fetch('http://localhost:8080/teachers/'+ localStorage.getItem("ID"), requestOptions)
            .then(response => {
                if(response.ok) {
                    response.json().then(data =>
                        this.setState({subjects: data.subjectsDto})    
                    )
                }else {
                    response.text().then(message => alert(message))
                }
            })
            .catch(error => console.log(error))
        }    
    }

    students = (id) => {
        this.props.history.push("/class/"+id+"/subject/"+ this.state.currentSubjectId);

    }

    handleClick=(id)=>{
        this.setState({classes:[]});
        this.setState({errorMessage:''});
        this.setState({currentSubjectId:id});
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ localStorage.getItem("user")
            }
        };
        fetch('http://localhost:8080/gradings/'+localStorage.getItem("ID") +'/teacher/'+id+'/subject', requestOptions)
        .then(response => {
            if(response.ok) {
                response.json().then(data =>
                    this.setState({classes: data})    
                )
            }else {
                response.text().then(message => this.setState({errorMessage: message}))
            }
        })
        .catch(error => console.log(error))
    }

    render(){

        return(
            <div >
            <div className="subjects_wrapper">
                <div>
                {
                    this.state.subjects &&
                    this.state.subjects.map(subject=>
                       <div className="subject" key={subject.id}><span>{subject.name}</span> <button  className="button_classes" onClick={()=>this.handleClick(subject.id)}>Classes</button> 
                       {
                        subject.id === this.state.currentSubjectId &&
                        <table>
                            <tbody>
                                {
                                    this.state.classes.length > 0 ?
                                     this.state.classes.map((item, ind)=>
                                     <tr key={item.id}>
                                       <td>{ind+1}.</td>
                                    <td>{item.year}-{item.numberOfClass}</td>
                                    <td>{item.schYearDto.name}</td>
                                     <td><button  onClick={()=>this.students(item.id)}>Students</button></td>
                                       </tr>) : (<tr><td>{this.state.errorMessage}</td></tr>)
                                }
                            </tbody>
                        </table>
                    }
                    </div>
                     )
                }
                </div>
               
            </div>
            </div>
        )
    }


};

export default SubjectsClasses;
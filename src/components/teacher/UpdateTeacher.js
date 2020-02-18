import React, { Component } from 'react';
import '../../style/teacher/teacher.css'


class UpdateTeacher extends Component {
    constructor(props) {
        super(props);
        this.state = { teacher: null, subjects:[], subjectsDto:[], subjectNames:[], errorMessage:'' };
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser){
            this.props.history.push("/users/login");
        }else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        } else {
        const path = 'http://localhost:8080/teachers/'+this.props.match.params.id;
        const path1 = 'http://localhost:8080/subjects';

        const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic '+localStorage.getItem("user")
                }
            };
        fetch(path, requestOptions)
        .then(response => response.json())
        .then(data => {
                this.setState({teacher: data,
                            subjectsDto: data.subjectsDto,
                        subjectNames:data.subjectsDto.map(s=>s.name)});

         });
         fetch(path1, requestOptions)
         .then(response => response.json())
         .then(data => {
                 this.setState({ subjects: data})
          });
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        
        this.setState({
            teacher: {...this.state.teacher, [name]: target.value}
        });
    }    
    
    onToggle = (event, subject) => {
        const subjectsDto=[...this.state.subjectsDto];
      if(event.target.checked){
            subjectsDto.push(subject);
      }else{
        const index= subjectsDto.findIndex((item)=> item.id===subject.id);
        subjectsDto.splice(index, 1);
      }
      this.setState({subjectsDto: subjectsDto});
    }
    
    handleSubmit = (event) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ localStorage.getItem("user")
            },
            body: JSON.stringify({
                code: this.state.teacher.code,
                firstName: this.state.teacher.firstName,
                lastName:this.state.teacher.lastName,
                subjectsDto: this.state.subjectsDto
            })
        };
        
        const path = 'http://localhost:8080/teachers/' + this.state.teacher.id;
        fetch( path, requestOptions)
        .then(response => 
            {
                if(response.ok) {
                    response.json().then(data => {
                        this.setState({errorMessage: ''})
                        this.props.history.push("/teachers");
                    });
                }else {
                    response.text().then(message => this.setState({errorMessage: message}))
                }
            })
        .catch(error => console.log(error))
        event.preventDefault();
    };

    render() {
        return (
            <div className="teacher">
            {
                this.state.teacher && 
                <form className="teacher_form" onSubmit={this.handleSubmit}>
                <label>Change code:  <input 
                    type="text" 
                    name="code"
                    value={this.state.teacher.code}
                    onChange={this.handleInputChange} /></label>

                <label>Change first name:  <input 
                    type="text" 
                    name="firstName" 
                    placeholder="Change first name"
                    value={this.state.teacher.firstName}
                    onChange={this.handleInputChange} /></label>

                <label>Change last name:  <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Change last name"
                    value={this.state.teacher.lastName}
                    onChange={this.handleInputChange} /> </label>
                <label>Current subjects are: {
                    this.state.subjectNames&&
                    this.state.subjectNames.map((sub,ind)=>
                        <span key={ind}>{ind+1}. {sub} </span>)
                }</label>

                <label className="pick">Please pick subjects again:</label>
                <div className="subjects">
                    {
                        this.state.subjects &&
                        this.state.subjects.map(subject =>
                            <div key={subject.id}>
                            <input 
                            type="checkbox" 
                            id={subject.id}
                            value={subject.name}
                            onChange={e => this.onToggle(e, subject)}/><span htmlFor={subject.id}>{subject.name}</span></div>
                        )
                    }
               </div>        
                                    
                <input type="submit" value="Change" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/teachers")} />
                <label className="error">{this.state.errorMessage}</label>
            </form>
            }
               
            </div>
           
        )
    }
};

export default UpdateTeacher;
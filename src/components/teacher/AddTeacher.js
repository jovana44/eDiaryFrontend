import React, { Component } from 'react';
import '../../style/teacher/teacher.css';

class AddTeacher extends Component{
    constructor(props) {
        super(props);
        this.state = {code: '', firstName:'', lastName:'', subjects:[], subjectsDto:[], errorMessage:''};
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser) {
            this.props.history.push("/users/login");
        }else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        } else   {
            const path = 'http://localhost:8080/subjects';
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
                this.setState({subjects: data})
            });
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        
        this.setState({
            [name]: target.value
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
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem("user")
            },
            body: JSON.stringify({
                code: this.state.code,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                subjectsDto: this.state.subjectsDto
            })
        };
        
        fetch('http://localhost:8080/teachers' , requestOptions)
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
                <form className="teacher_form" onSubmit={this.handleSubmit}>
                <input 
                    type="text" 
                    name="code"
                    placeholder="Enter code"
                    onChange={this.handleInputChange} />

                <input 
                    type="text" 
                    name="firstName"
                    placeholder="Enter first name"
                    onChange={this.handleInputChange} />

                <input 
                    type="text" 
                    name="lastName"
                    placeholder="Enter last name"
                    onChange={this.handleInputChange} />            

                <label className="pick">Pick subjects:</label>
                <div className="pick_sub">
                    {
                        this.state.subjects &&
                        this.state.subjects.map(subject =>
                            <div  key={subject.id}>
                            <input 
                            type="checkbox" 
                            value={subject.name}
                            //checked={this.state.subjectsDto.find(item => item.id ===subject.id)}
                            onChange={e => this.onToggle(e, subject)}/><span>{subject.name}</span></div>
                        )
                    }
               </div>
                
                <input type="submit" value="Add" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/teachers")} />
                <label className="error">{this.state.errorMessage}</label>
            </form> 
            </div>
           
        )
    }
};

export default AddTeacher;

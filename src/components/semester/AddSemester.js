import React, { Component } from 'react';
import '../../style/common/login.css';

class AddSemester extends Component{
    constructor(props) {
        super(props);
        this.state = {code: '', numberOfSem:'1', semesterStart:'', semesterEnd:'', name:'',  schoolYears:[],  errorMessage:''};
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser) {
            this.props.history.push("/users/login");
        }else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        } else {
            const path = 'http://localhost:8080/schoolyears';
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
                this.setState({schoolYears: data})
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

    
    
    handleSubmit = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + localStorage.getItem("user")
            },
            body: JSON.stringify({
                code: this.state.code,
                numberOfSem: this.state.numberOfSem,
                semesterStart: this.state.semesterStart,
                semesterEnd: this.state.semesterEnd,
                schYearDto:{
                    name:this.state.name
                }
            })
        };
        
        fetch('http://localhost:8080/semesters' , requestOptions)
        .then(response => 
            {
                if(response.ok) {
                    response.json().then(data => {
                        this.setState({errorMessage: ''})
                        this.props.history.push("/semesters");
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
            <div className="login_form">
                <form onSubmit={this.handleSubmit}>
                <label>Enter code:</label>
                <input 
                    type="text" 
                    name="code"
                    placeholder="Enter code"
                    onChange={this.handleInputChange} />

                <label>Pick semester:</label>
                 
                <input 
                    type="number" 
                    name="numberOfSem" 
                    max="2"
                    min="1"
                    onChange={this.handleInputChange} />

                <label>Semester start: </label><input 
                    type="date" 
                    name="semesterStart" 
                    onChange={this.handleInputChange} />

                <label>Semester end: </label><input 
                    type="date" 
                    name="semesterEnd" 
                    onChange={this.handleInputChange} />

                <label>Pick school year:</label>
                <select onChange={this.handleInputChange} name="name" value={this.state.name}>
                    {
                        this.state.schoolYears.map(year =>
                    <option key={year.id} value={year.name}>{year.name}</option>)
                    }
                </select> 
               
                
                <input type="submit" value="Add" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/semesters")} />
                <label className="error">{this.state.errorMessage}</label>
            </form> 
            </div>
           
        )
    }
};

export default AddSemester;

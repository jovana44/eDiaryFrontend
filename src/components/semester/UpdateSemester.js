import React, { Component } from 'react';
import '../../style/common/login.css'


class UpdateSemester extends Component {
    constructor(props) {
        super(props);
        this.state = { semester: null, schYearDto:null };
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser){
            this.props.history.push("/users/login");
        }else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        } else  {
        const path = 'http://localhost:8080/semesters/'+this.props.match.params.id;
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
                this.setState({semester: data,
                               schYearDto: data.schYearDto})
            });
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        
        this.setState({
            semester: {...this.state.semester, [name]: target.value},
            schYearDto:{...this.state.schYearDto, [name]: target.value}
        });
    }    
    
    handleSubmit = (event) => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ localStorage.getItem("user")
            },
            body: JSON.stringify({
                code: this.state.semester.code,
                numberOfSem:this.state.semester.numberOfSem,
                semesterStart: this.state.semester.semesterStart,
                semesterEnd: this.state.semester.semesterEnd,
                schYearDto:{
                    name:this.state.schYearDto.name,
                    yearStart: this.state.schYearDto.yearStart,
                    yearEnd: this.state.schYearDto.yearEnd
                }
            })
        };
        
        const path = 'http://localhost:8080/semesters/' + this.state.semester.id;
        fetch( path, requestOptions)
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
            {
                this.state.semester && 
                <form onSubmit={this.handleSubmit}>
                <input 
                    type="text" 
                    name="code"
                    placeholder="Change code"
                    value={this.state.semester.code}
                    onChange={this.handleInputChange} />
                 
                 <input 
                    type="number" 
                    name="numberOfSem"
                    max="2"
                    min="1"
                    value={this.state.semester.numberOfSem}
                    onChange={this.handleInputChange} />
 

                <input 
                    type="date" 
                    name="semesterStart" 
                    placeholder="Change name"
                    value={this.state.semester.semesterStart}
                    onChange={this.handleInputChange} />

                <input 
                    type="date" 
                    name="semesterEnd" 
                    placeholder="Change name"
                    value={this.state.semester.semesterEnd}
                    onChange={this.handleInputChange} />

                <input 
                    type="text" 
                    name="name"
                    placeholder="Change school year name"
                    value={this.state.schYearDto.name}
                    onChange={this.handleInputChange} />

                <input 
                    type="date" 
                    name="yearStart" 
                    placeholder="Change name"
                    value={this.state.schYearDto.yearStart}
                    onChange={this.handleInputChange} />

                <input 
                    type="date" 
                    name="yearEnd" 
                    placeholder="Change name"
                    value={this.state.schYearDto.yearEnd}
                    onChange={this.handleInputChange} />
                
                                    
                <input type="submit" value="Change" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/semesters")} />
                <label className="error">{this.state.errorMessage}</label>
            </form>
            }
               
            </div>
           
        )
    }
};

export default UpdateSemester;
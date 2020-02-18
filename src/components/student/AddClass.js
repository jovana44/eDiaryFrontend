import React, { Component } from 'react';
import '../../style/common/login.css';

class AddClass extends Component{
    constructor(props) {
        super(props);
        this.state = {code: '', year:'', numberOfClass:'', schoolyears:[], name:'2017/2018',errorMessage:''};
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser) {
            this.props.history.push("/users/login");
        }else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        }else{
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic '+ localStorage.getItem("user")
            }
        };
        fetch('http://localhost:8080/schoolyears' , requestOptions)
        .then(response => {
            if(response.ok) {
                response.json().then(data =>
                    this.setState({schoolyears: data })    
                )
            }else {
                response.text().then(message => alert(message))
            }
        })
        .catch(error => console.log(error))
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
                year: this.state.year,
                numberOfClass: this.state.numberOfClass,
                schYearDto:{ name:this.state.name}
            })
        };
        
        fetch('http://localhost:8080/classes' , requestOptions)
        .then(response => 
            {
                if(response.ok) {
                    response.json().then(data => {
                        this.setState({errorMessage: ''})
                        this.props.history.push("/classes");
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
                <input 
                    type="text" 
                    name="code"
                    placeholder="Enter code"
                    onChange={this.handleInputChange} />

                <input 
                    type="number" 
                    name="year" 
                    placeholder="Enter class year"
                    onChange={this.handleInputChange} 
                    min="1"
                    max="8"/>

               <input 
                    type="number" 
                    name="numberOfClass" 
                    placeholder="Enter number of class"
                    onChange={this.handleInputChange}
                    min="1"
                    max="8" />

                <label className="activity">Pick school year:</label>
                <select onChange={this.handleInputChange} name="name" value={this.state.name} >
                    {
                        this.state.schoolyears &&
                        this.state.schoolyears.map(sy =>
                            <option key={sy.id} value={sy.name}>{sy.name}</option>
                        )
                    }
                </select>  
                                    
                <input type="submit" value="Add" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/subjects")} />
                <label className="error">{this.state.errorMessage}</label>
            </form> 
            </div>
           
        )
    }
};

export default AddClass;

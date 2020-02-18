import React, { Component } from 'react';
import '../../style/teacher/updateMark.css'

class UpdateClass extends Component {
    constructor(props) {
        super(props);
        this.state = { classs: null, schoolyears:[], activity:null, name:'', errorMessage:''};
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser){
            this.props.history.push("/users/login");
        }else if(!(localStorage.getItem('role') === "admin")){
            this.props.history.push('/');
        } else   {
        const path = 'http://localhost:8080/classes/'+ this.props.match.params.id ;
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
                this.setState({classs: data,
                               name: data.schYearDto.name })
            });

            const path1 = 'http://localhost:8080/schoolyears';
            fetch(path1, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({ schoolyears: data})
            });
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        
        if(name==="name"){
            this.setState({name:target.value});
        }
        this.setState({
            classs: {...this.state.classs, [name]: target.value}
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
                code: this.state.classs.code,
                year: this.state.classs.year,
                numberOfClass: this.state.classs.numberOfClass,
                schYearDto: { name: this.state.name }
            })
        };
        
        const path = 'http://localhost:8080/classes/' + this.props.match.params.id;
        fetch( path, requestOptions)
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
            {
                this.state.classs &&
             <form onSubmit={this.handleSubmit}>
                 <div>
                <label>Change code:</label>
                  <input 
                    type="text" 
                    name="code"
                    value={this.state.classs.code}
                    onChange={this.handleInputChange} />
                 </div>
                 <div>
                <label>Change class year:</label>
                  <input 
                    type="number" 
                    name="year"
                    value={this.state.classs.year}
                    onChange={this.handleInputChange} 
                    min="1"
                    max="8"/>
                 </div>
                 <div>
                <label>Change number of class:</label>
                  <input 
                    type="number" 
                    name="numberOfClass"
                    value={this.state.classs.numberOfClass}
                    onChange={this.handleInputChange} 
                    min="1"
                    max="8"/>
                 </div>
                <div>
                    <label>Change school year:</label>
                <select onChange={this.handleInputChange} name="name" value={this.state.name}>
                    {
                        this.state.schoolyears &&
                        this.state.schoolyears.map(sy =>
                            <option key={sy.id} value={sy.name} >{sy.name}</option>

                        )
                    }
                </select>
                </div>
                               
                <input type="submit" value="Change" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/classes")} />
               
                <label className="error">{this.state.errorMessage}</label>
            </form>
            }
            </div>
           
        )
    }
};

export default UpdateClass;
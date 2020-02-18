import React, { Component } from 'react';
import '../../style/teacher/updateMark.css'


class UpdateMark extends Component {
    constructor(props) {
        super(props);
        this.state = { mark: null, activities:[], activity:null, name:'', errorMessage:''};
    }

    componentDidMount() {
        const currentUser = localStorage.getItem("user");
        if(!currentUser){
            this.props.history.push("/users/login");
        }else if(!(localStorage.getItem('role') === "teacher")){
            this.props.history.push('/');
        } else   {
        const path = 'http://localhost:8080/gradings/'+ this.props.match.params.markId ;
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
                this.setState({mark: data,
                               name: data.activityDto.name })
            });

            const path1 = 'http://localhost:8080/activities';
            fetch(path1, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({ activities: data})
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
            mark: {...this.state.mark, [name]: target.value}
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
                mark: this.state.mark.mark,
                activityDto: { name: this.state.name }
            })
        };
        
        const path = 'http://localhost:8080/gradings/' + this.props.match.params.markId;
        fetch( path, requestOptions)
        .then(response => 
            {
                if(response.ok) {
                    response.json().then(data => {
                        this.setState({errorMessage: ''})
                        this.props.history.push("/class/"+this.props.match.params.id+"/subject/"+ 
                                                this.props.match.params.currentSubjectId);
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
                this.state.mark &&
             <form onSubmit={this.handleSubmit}>
                 <div>
                <label>Change mark:</label>
                  <input 
                    type="number" 
                    name="mark"
                    placeholder="Change mark"
                    value={this.state.mark.mark}
                    onChange={this.handleInputChange} 
                    min="1"
                    max="5"/>
                 </div>
                <div>
                    <label>Change activity:</label>
                <select onChange={this.handleInputChange} name="name" value={this.state.name}>
                    {
                        this.state.activities &&
                        this.state.activities.map(activity =>
                            <option key={activity.id} value={activity.name} >{activity.name}</option>

                        )
                    }
                </select>
                </div>
                               
                <input type="submit" value="Change" className="submit" />
                <input type="button" value="Cancel" className="cancel" onClick={()=>this.props.history.push("/class/"+this.props.match.params.id+"/subject/"+ 
                                                this.props.match.params.currentSubjectId)} />
               
                <label className="error">{this.state.errorMessage}</label>
            </form>
            }
            </div>
           
        )
    }
};

export default UpdateMark;
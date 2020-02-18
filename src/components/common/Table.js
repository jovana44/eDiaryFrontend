import React, { Component } from 'react';
import '../../style/common/table.css'

class Table extends Component {
  
    render() {
        return (
            <div className="table_wrapper">
            {
                this.props.data && 
                <table>
                    <thead>
                        <tr>
                        {
                            this.props.heading.map((item, index)=>{
                                return (
                                    <th key={index}>{item}</th>
                                )
                            })
                        }
                        </tr>     
                    </thead>
                    <tbody>
                        {
                            this.props.data.map(item => {
                                return (
                                    <tr key={item.id}>
                                    {
                                        Object.entries(item).map(entry => (
                                            <td key={entry[1]}>{entry[1]}</td>
                                        ))
                                    }
                                    {
                                        this.props.buttons.map(btn => (
                                            <td key={btn.name}><button className={btn.class} onClick={()=>btn.action(item.id)}>{btn.name}</button></td>
                                        ))
                                    }    
                                    </tr>
                                )
                            })
                        }

                    </tbody>
              </table>
            }                    
        </div>
        )
    }
};

export default Table;
import React, {Component} from 'react';

class RegexTester extends Component {

    state = {
        factors: {
            regExp: '',
            testvalue: '',
            resultvalue: ''
        }
    };

    handleChange = (e) => {
        const { name, value } = e.currentTarget;
        let factors = {...this.state.factors};

        factors[name] = value;

        this.setState({ factors });

        if(factors.testvalue.trim() !== '')
        {
            const regex = /\b\w+\b/i;
            const str = factors.testvalue.trim();
            let m;

            if ((m = regex.exec(str)) !== null) {
                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    console.log(`Found match, group ${groupIndex}: ${match}`);
                });
            }
            
        }
    }

    render () {
        return (
            <table style={{width: "100%"}}>
                <tr>
                    <td>Regex:</td>
                    <td><input type="text" name="regExp" style={{width: "100%"}} onChange={this.handleChange} /></td>
                </tr>
                <tr>
                    <td>Test Val:</td>
                    <td><textarea style={{width: "100%"}} name="testvalue" onChange={this.handleChange} ></textarea></td>
                </tr>
                <tr>
                    <td>Result Val:</td>
                    <td><textarea style={{width: "100%"}} name="resultvalue" onChange={this.handleChange} ></textarea></td>
                </tr>
            </table>
        );
    }
};

export default RegexTester;
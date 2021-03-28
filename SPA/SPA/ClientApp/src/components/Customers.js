import React, { Component } from 'react';
export class Customers extends Component {

    constructor(props) {
        super(props);
        this.state = { current: '', customers: [], loading: true, editing: false, new:false};

        fetch('api/Customer/Customers')
            .then(response => response.json())
            .then(data => {
                this.setState({ customers: data, loading: false });

            });
        this.NewCustomer = this.NewCustomer.bind(this);
    }


    NewCustomer() {
        this.setState({
            new: true,
            current: {
                customerId: 0,
                name: '',
                city: '',
                state: '',
                country: '',
                email: ''
            } });
    }

    UpdateData(customer) {

        console.log(customer);
        this.setState({ loading: true });

        fetch('api/Customer/SaveCustomer', {

            method: 'post',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(customer)
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ loading: false });
            });
    }

    EditCustomer(customer) {
        this.setState({ current: customer, editing: true });
    }

    static renderCustomersTable(customers, ctrl) {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Addres</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Country</th>
                        <th>Email</th>

                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) =>

                        <tr key={customer.customerId}>
                            <td>{customer.name}</td>
                            <td>{customer.address}</td>
                            <td>{customer.city}</td>
                            <td>{customer.state}</td>
                            <td>{customer.country}</td>
                            <td>{customer.email}</td>
                            <td><input type="button" onClick={() => ctrl.EditCustomer(customer)} value ="Edit" /></td>

                        </tr>
                    )}

                </tbody>

            </table>
        );
    }

    static renderCurrentCustomer(customer, ctrl) {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Customer Details {customer.name}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr key={customer.customerId}>
                        <td>
                            <p>
                                <input type="hidden" value={customer.customerId} name="customerId" />
                            </p>

                            <p>
                                <input type="text" defaultValue={customer.name} name="name"
                                    onChange={(event) =>
                                    { customer.name = event.target.value; }}/>
                            </p>

                            <p>
                                <input type="text" defaultValue={customer.address} name="address"
                                    onChange={(event) => { customer.address = event.target.value; }} />
                            </p>

                            <p>
                                <input type="text" defaultValue={customer.city} name="city"
                                    onChange={(event) =>
                                    { customer.city = event.target.value; }} />
                            </p>

                            <p>
                                <input type="text" defaultValue={customer.state} name="state"
                                    onChange={(event) =>
                                    { customer.state = event.target.value; }} />
                            </p>

                            <p>
                                <input type="text" defaultValue={customer.country} name="country"
                                    onChange={(event) =>
                                    { customer.country = event.target.value; }} />
                            </p>

                            <p>
                                <input type="text" defaultValue={customer.email} name="email"
                                    onChange={(event) =>
                                    { customer.email = event.target.value; }} />
                            </p>
                            <p>
                                <button onClick={()=> ctrl.UpdateData(customer)}>Save Customer</button>
                            </p>
                        </td>

                    </tr>
                </tbody>
            </table>
            )
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading</em></p>
            : Customers.renderCustomersTable(this.state.customers, this);

        contents = this.state.editing
            ? Customers.renderCurrentCustomer(this.state.current, this)
            : Customers.renderCustomersTable(this.state.customers, this);
            
        if (this.state.new) {
            console.log(this.state.current);
            contents = Customers.renderCurrentCustomer(this.state.current, this);
        }

        return (
            <div>
                <h1> Customer List </h1>
                {contents}
                <button onClick={this.NewCustomer}>NewCustomer</button>
            </div>

        );
    }
}
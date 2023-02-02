import React, {useEffect, useState} from 'react';
import axiosClient from "../../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {PencilSquare, Trash} from "react-bootstrap-icons";
import Pagination from "react-js-pagination";
import Table from 'react-bootstrap/Table';


const Users = () => {

    const [users, setUsers] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false)
    const {setNotification} = useStateContext()

    useEffect(() => {
        getUsers();
    }, [])


    const getUsers = (pageNumber = 1) => {
        setLoading(true)
        axiosClient.get('/users?page=' + pageNumber)
            .then(({data}) => {
                setLoading(false)
                setUsers(data.data)
                setMeta(data.meta)
                console.log(data)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const onDelete = (user) => {
        if(!window.confirm("Are you sure?")) {
            return
        }

        axiosClient.delete(`/users/${user.id}`)
            .then(() => {
                setNotification("User was successfully deleted")
                getUsers()
            })
    }

    return (
        <div>
            <div style={{padding: '0 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add new</Link>
            </div>
            <div className='card animated fadeInDown'>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Create Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    {loading && <tbody>
                    <tr>
                        <td colSpan='5' className="text-center">
                            Loading...
                        </td>
                    </tr>
                    </tbody>}
                    {!loading && <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={{marginTop: '5%'}}>
                            <th style={{paddingLeft: '0.5rem'}}>{user.id}</th>
                            <th>{user.name}</th>
                            <th>{user.email}</th>
                            <th>{user.created_at}</th>
                            <th>
                                <Link to={'/users/'+user.id}><PencilSquare color="royalblue" size={20} style={{verticalAlign: 'middle'}}/></Link>
                                &nbsp;
                                <button onClick={event => onDelete(user)} className="btn-delete"><Trash color="red" size={20} style={{verticalAlign: 'middle'}}/></button>
                            </th>
                        </tr>
                    ))}
                    </tbody>}
                </Table>
                <Pagination
                    activePage={meta.current_page}
                    itemsCountPerPage={meta.per_page}
                    totalItemsCount={meta.total}
                    pageRangeDisplayed={3}
                    onChange={getUsers}
                    itemClass='page-number'
                    linkClass='pagination-link'
                />
            </div>
        </div>
    );
};

export default Users;

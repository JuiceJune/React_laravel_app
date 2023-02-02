import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, Link} from "react-router-dom";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {ArrowLeft, ArrowLeftCircle, PencilSquare} from "react-bootstrap-icons";

const UserForm = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null);
    const {setNotification} = useStateContext()
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    if(id) {
        useEffect(() => {
            setLoading(true);
            axiosClient.get(`/users/${id}`)
                .then( ({data}) => {
                    setLoading(false)
                    setUser(data.data)
                })
                .catch(() => {
                    setLoading(false)

                })
        }, [])
    }

    const onSubmit = (event) => {
        event.preventDefault()
        if(user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification("User was successfully updated")
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if(response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                })
        } else {
            axiosClient.post(`/users`, user)
                .then(() => {
                    setNotification("User was successfully created")
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if(response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                })
        }
    }

    return (
        <div>
            <div style={{padding: '0 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                {user.id && <h1>Update User: {user.name}</h1>}
                {!user.id && <h1>New User</h1>}
                <Link to={'/users'}><ArrowLeftCircle color="#5b08a7" size={28} style={{cursor: 'pointer'}}/></Link>
            </div>
            <div className='card animated faidInDown'>
                {loading && (
                    <div className="text-center">Loading...</div>
                )}
                {errors && <div className="alert">
                    {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>}
                {!loading &&
                    <form onSubmit={onSubmit}>
                        <input type="text" value={user.name} onChange={event => setUser({...user, name: event.target.value})} placeholder="Name"/>
                        <input type="email" value={user.email} onChange={event => setUser({...user, email: event.target.value})} placeholder="Email"/>
                        <input type="password" onChange={event => setUser({...user, password: event.target.value})} placeholder="Password"/>
                        <input type="password" onChange={event => setUser({...user, password_confirmation: event.target.value})} placeholder="Password confirmation"/>
                        <button className="btn">Save</button>
                    </form>
                }
            </div>
        </div>
    );
};

export default UserForm;

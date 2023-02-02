import React from 'react';
import Form from "react-bootstrap/Form";
import {XCircle} from "react-bootstrap-icons";
import {CirclePicker} from "react-color";
import DatetimeRangePicker from "react-datetime-range-picker";
import Button from "react-bootstrap/Button";
import Popup from "./Popup.jsx";

const CreateEventPopup = ({activePopup, setActivePopup, addEvent, errors, event, setEvent, colors, handleColorChange, handleDateChange}) => {
    return (
        <Popup active={activePopup} setActive={setActivePopup}>
            <Form onSubmit={addEvent} className="popupForm">
                <div className="closePopupDiv">
                    <h2>Add New Event</h2>
                    <div className="closePopupElement" onClick={() => setActivePopup(false)}>
                        <XCircle color="#5b08a7" size={24}/>
                    </div>
                </div>

                {errors && <div className="alert">
                    {Object.keys(errors).map(key => (
                        <p key={key}>{errors[key][0]}</p>
                    ))}
                </div>}

                <Form.Group className="mb-3">
                    <Form.Control type="text"
                                  placeholder="Enter title"
                                  value={event.title} onChange={e => setEvent({...event, title: e.target.value})} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="text"
                                  placeholder="Enter url"
                                  value={event.url} onChange={e => setEvent({...event, url: e.target.value})} />
                </Form.Group>

                <Form.Group className='colorPicker'>
                    <CirclePicker
                        width='100%'
                        colors={colors}
                        color={ event.backgroundColor }
                        onChange={ handleColorChange }
                    />
                </Form.Group>

                <Form.Group className='dateTimePickerBlock'>
                    <DatetimeRangePicker timeFormat="H:mm:ss"
                                         dateFormat="MM/DD/yyyy"
                                         className="dateTimePicker"
                                         startDate={event.start}
                                         endDate={event.end}
                                         onChange={handleDateChange}/>
                </Form.Group>

                <Button variant="primary" type='submit' style={{marginTop: '15px'}}>
                    Add Event
                </Button>
            </Form>
        </Popup>
    );
};

export default CreateEventPopup;

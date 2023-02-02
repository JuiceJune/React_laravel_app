import React, {useEffect, useRef, useState} from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from '@fullcalendar/list';
import axiosClient from "../../axios-client.js";
import moment from "moment";
import CreateEventPopup from "../../components/Popups/CreateEventPopup.jsx";
import EditEventPopup from "../../components/Popups/EditEventPopup.jsx";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {OverlayTrigger, Popover} from "react-bootstrap";

const Calendar = () => {

    const [currentEvents, setCurrentEvents] = useState([]);
    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [createEventPopup, setCreateEventPopup] = useState(false);
    const [editEventPopup, setEditEventPopup] = useState(false);
    const [eventInfo, setEventInfo] = useState(null)
    const [errors, setErrors] = useState(null);
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true)
    const {setNotification} = useStateContext()
    const colors = [
        "#ef6f63", "#d95b85", "#a565af", "#906ecb", "#3f51b5", "#2196f3",
        "#295e7e", "#67afb9", "#6bb2ad", "#72af75", "#8bc34a", "#adbe07",
        "#b0a646", "#d29f1b", "#c4954d", "#e7704e", "#795548", "#607d8b"
    ]
    const [event, setEvent] = useState({
        title: '',
        backgroundColor: colors[0],
        textColor: '#fff',
        url: '',
        start: '',
        end: '',
        allDay: 1,
    })


    useEffect(() => {
        getEvents();
    }, [])

    const getEvents = () => {
        setLoading(true)
        axiosClient.get('/events')
            .then(({data}) => {
                setLoading(false)
                setCurrentEvents(data.data)
            })
            .catch((e) => {
                //TODO Add error notification
            })
    }

    const addEvent = (e) => {
        e.preventDefault()
        let calendarApi = eventInfo.view.calendar

        calendarApi.unselect()

        let data = {
            title: event.title,
            start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
            end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
            all_day: event.allDay ? eventInfo.allDay : event.allDay,
            background_color: event.backgroundColor,
            text_color: event.textColor,
            url: event.url
        }

        axiosClient.post(`/events`, data)
            .then((response) => {
                calendarApi.addEvent({
                    id: response.data.id,
                    title: response.data.title,
                    start: response.data.start,
                    end: response.data.end,
                    allDay: response.data.allDay,
                    backgroundColor: response.data.backgroundColor,
                    borderColor: response.data.backgroundColor,
                    textColor: response.data.textColor,
                    url: response.data.url,
                })
                setCreateEventPopup(false)
                setNotification("Event was successfully created")
            })
            .catch(err => {
                const response = err.response;
                if(response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            })
    }

    const changeEvent = (e) => {
        e.preventDefault()
        let calendarApi = eventInfo.view.calendar
        calendarApi.unselect()

        let data = {
            title: event.title,
            start: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
            end: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
            all_day: event.allDay,
            background_color: event.backgroundColor,
            text_color: event.textColor,
            url: event.url
        }

        axiosClient.put(`/events/${eventInfo.event.id}`, data)
            .then(({data}) => {
                calendarApi.getEventById(data.data.id).setProp('title', data.data.title)
                calendarApi.getEventById(data.data.id).setProp('backgroundColor', data.data.backgroundColor)
                calendarApi.getEventById(data.data.id).setProp('borderColor', data.data.backgroundColor)
                calendarApi.getEventById(data.data.id).setProp('textColor', data.data.textColor)
                calendarApi.getEventById(data.data.id).setProp('url', data.data.url)
                calendarApi.getEventById(data.data.id).setDates(data.data.start, data.data.end, {'allDay': data.data.allDay})
                setEditEventPopup(false)
                setNotification("Event was successfully created")
            })
            .then(() => {
                setEdit(false)
            })
            .catch(err => {
                const response = err.response;
                if(response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            })
        setEvent({
            title: '',
            backgroundColor: colors[0],
            textColor: '#fff',
            url: '',
            start: '',
            end: '',
            allDay: 1,
        })
    }

    const removeEvent = () => {
        let calendarApi = eventInfo.view.calendar
        axiosClient.delete(`/events/${eventInfo.event.id}`)
            .then((response) => {
                calendarApi.getEventById(eventInfo.event.id).remove()
                setEvent({
                    title: '',
                    backgroundColor: colors[0],
                    textColor: '#fff',
                    url: '',
                })
                setNotification("Event was successfully deleted")
                setEditEventPopup(false)
            })
            .catch(err => {

            })
    }

    const handleDateSelect = (selectInfo) => {
        setEvent({
            title: '',
            backgroundColor: colors[0],
            textColor: '#fff',
            url: '',
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: 1,
        })
        setCreateEventPopup(true);
        setEventInfo(selectInfo)
        setErrors(null)
    }

    const handleEventClick = (clickInfo) => {
        clickInfo.jsEvent.preventDefault()
        setErrors(null)
        // setEditEventPopup(true)
        setEvent({
            title: clickInfo.event.title,
            backgroundColor: clickInfo.event.backgroundColor,
            textColor: '#fff',
            url: clickInfo.event.url,
            start: clickInfo.event.start,
            end: clickInfo.event.end,
            allDay: clickInfo.event.allDay,
        })
        setEventInfo(clickInfo)
        setEdit(true);
    }

    const handleEventChange = (e) => {
        if(edit) {
            return;
        }
        let data = {
            title: e.event.title,
            start: e.event.startStr,
            end: e.event.endStr,
            all_day: e.event.allDay,
            background_color: e.event.backgroundColor,
            text_color: e.event.textColor,
            url: e.event.url
        }
        axiosClient.put(`/events/${e.event.id}`, data)
            .then((response) => {
                if(response.status === 200) {
                    setNotification("Event was successfully updated")
                }
            })
            .catch(err => {
            })
    }

    function renderEventContent(eventInfo){
        const popover = (
            <Popover id="popover-trigger-focus" className="popover">
                <Popover.Header as="h3" className="popover-header" style={{backgroundColor: eventInfo.event.backgroundColor}}>
                    {eventInfo.event.title}
                </Popover.Header>
                <div className='popover-time'>
                    {eventInfo.timeText ? eventInfo.timeText : 'All day' }
                </div>
                <Popover.Body className="popover-body">
                    And here's some <strong>amazing</strong> content. It's very engaging.
                    right?
                    <div className="popover-body-buttons">
                        <button className="popover-btn popover-edit-btn" onClick={() => setEditEventPopup(true)}>Edit</button>
                        <button className="popover-btn popover-delete-btn" onClick={() => removeEvent()}>Delete</button>
                    </div>
                </Popover.Body>
            </Popover>
        );

        return (
            <OverlayTrigger trigger='click' rootClose={true} style={{display: 'flex'}} overlay={popover}>
                <p className="event" id={eventInfo.event.id}>{eventInfo.timeText ?
                    <span>
                        <span style={{  height: '8px',
                                        width: '8px',
                                        backgroundColor: `${eventInfo.backgroundColor}`,
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        marginBottom: '1px',
                                        marginRight: '2px'
                        }}></span>
                        {moment(eventInfo.event.start).format('HH:mm')}
                    </span> : ""}
                    {' '}
                    <span>
                        {eventInfo.event.title}
                    </span>
                </p>
            </OverlayTrigger>
        )
    }

    const getDate = () => {
        return Date.now()
    }

    const handleDateChange = (e) => {
        if(moment(e.start).format('HH:mm:ss') !== "00:00:00" || moment(e.end).format('HH:mm:ss') !== "00:00:00") {
            setEvent({...event, start: e.start.toJSON(), end: e.end.toJSON(), allDay: 0})
        } else {
            setEvent({...event, start: e.start.toJSON(), end: e.end.toJSON(), allDay: 1})
        }
    }

    const handleColorChange = (color) => {
        setEvent({...event, backgroundColor: color.hex})
    }

    return (
        <div>
            {loading &&
            <div>Loading...</div>
            }
            {!loading && <FullCalendar
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ]}
                headerToolbar={{
                    center: 'prev,next,today',
                    left: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay,listWeek,listMonth,listYear'
                }}
                buttonText={{
                    today: 'Today',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                    listMonth: 'List Month',
                    listWeek: 'List Week',
                    listDay: 'List Day',
                    listYear: 'List Year',
                }}
                dayHeaderFormat={{
                    weekday: 'long'
                }}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                }}
                dayHeaderClassNames="fc-dayHeader-format"
                navLinks={true}
                initialView='dayGridMonth'
                displayEventTime={true}
                displayEventEnd={true}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                dayMaxEventRows={2}
                weekends={weekendsVisible}
                events={currentEvents}
                select={handleDateSelect}
                eventContent={renderEventContent}
                eventClick={handleEventClick}
                eventChange={handleEventChange}
                nowIndicator={getDate}
            />}
            <CreateEventPopup activePopup={createEventPopup} setActivePopup={setCreateEventPopup} addEvent={addEvent}
                              errors={errors} event={event} setEvent={setEvent} colors={colors} handleColorChange={handleColorChange}
                              handleDateChange={handleDateChange}
            />
            <EditEventPopup activePopup={editEventPopup} setActivePopup={setEditEventPopup} changeEvent={changeEvent}
                            removeEvent={removeEvent} errors={errors} event={event} setEvent={setEvent} colors={colors}
                            handleColorChange={handleColorChange} handleDateChange={handleDateChange}
            />
        </div>
    );
};

export default Calendar;

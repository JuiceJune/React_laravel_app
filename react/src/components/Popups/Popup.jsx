import React from 'react';

const Popup = ({active, setActive, children}) => {
    return (
        <div className={active ? 'popup active' : 'popup'} onClick={() => setActive(false)}>
            <div className={active ? 'popupContent active' : 'popupContent'} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Popup;

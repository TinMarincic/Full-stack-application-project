import React, {ReactNode, SyntheticEvent} from 'react';
import ApiCalendar from 'react-google-calendar-api';

const config = {
  clientId: "577623087637-f4q17fb39pmaiuou2n0smnhcfh6b8l7u.apps.googleusercontent.com" as string,
  apiKey: "AIzaSyBvFzjEmqu7-_bKHy_GNAKYuTrOTMMlXtc" as string,
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
}

const apiCalendar = new ApiCalendar(config)
    /**
     * List all events in the calendar
     * @param {number} maxResults to see
     * @param {string} calendarId to see by default use the calendar attribute
     * @returns {any} Promise with the result.
     *//*public listUpcomingEvents(maxResults: number, calendarId: string = this.calendar): any*/
/*
export const Calendar = () => {


    const listEvents = () => {
    apiCalendar.listEvents({
        timeMin: new Date().toISOString(),
        timeMax: new Date(2024, 8, 31).toISOString(),
        showDeleted: false,
        maxResults: 100,
        orderBy: 'updated'
    },"primary").then(({ result }: any) => {
    console.log(result.items);
    });
    }

    const getSingleEvent = () => {

        apiCalendar.getEvent("24nhbo4sk2o879krc2vf5f4b6m").then(console.log);
    }


    const handleItemClick = (event: SyntheticEvent<any>, name: string): void => {
        if (name === 'sign-in') {
          apiCalendar.handleAuthClick()
        } else if (name === 'sign-out') {
          apiCalendar.handleSignoutClick();
        }
      }

    return (
        <div>
        <button className='m-3 inline-block bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition-colors'
            onClick={(e) => listEvents()}
        >
          list events
        </button>
        <button className='m-3 inline-block bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition-colors'
            onClick={(e) => handleItemClick(e, 'sign-in')}
        >
          sign-in
        </button>
        <button className='m-3 inline-block bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition-colors'
            onClick={(e) => handleItemClick(e, 'sign-out')}
        >
          sign-out
        </button>
        
        <button className='m-3 inline-block bg-yellow-500 text-white py-2 px-4 rounded-xl hover:bg-yellow-600 transition-colors'
            onClick={(e) => getSingleEvent()}
        >
        get event
        </button>
        
        </div>
    );
}

*/
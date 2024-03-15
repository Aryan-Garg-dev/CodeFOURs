import { useSession, useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react"
import DateTimePicker from 'react-datetime-picker'
import { useState } from "react";
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

export default function CreateEvent() {
  const [ start, setStart ] = useState(new Date());
  const [ end, setEnd ] = useState(new Date());
  const [ eventName, setEventName ] = useState("");
  const [ eventDescription, setEventDescription ]= useState("");

  const session = useSession(); //tokens, when session exist we habe a user
  const supabase = useSupabaseClient();
  const { isLoading } =  useSessionContext();

  if (isLoading){
    return <></>;
  }

  async function googleSignIn(){
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if (error){
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  async function signOut(){
    await supabase.auth.signOut();
  }

  async function createCalendarEvent(){
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      'end': {
        'dateTime': end.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      }
    }
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + session.provider_token,
      },
      body: JSON.stringify(event),
    })

    if (response.ok){
      const data = await response.json();
      console.log(data);
      alert("Event Created, check your google calendar");
    }  else {
      console.error('Failed to create event:', response.statusText);
    }

  }
  
  return (
    <div className="App">
      <div style={{width: "400px", margin: "30px auto"}}>
        {session ? 
        <>
          <h2>Hey there {session.user.email}</h2>
          <p>Start of Your Event</p>
          <DateTimePicker onChange={setStart} value={start} />
          <p>End of your Event</p>
          <DateTimePicker onChange={setEnd} value={end} />
          <p>Event Name</p>
          <input type="text" placeholder="name: " onChange={e => setEventName(e.target.value)} />
          <p>Event Description</p>
          <input type="text" placeholder="description: " onChange={e => setEventDescription(e.target.value)} />
          <hr />
          <button onClick={()=>createCalendarEvent()}>Create Calendar Event</button>
          <p></p>
          <button onClick={()=>signOut()}>Sign out</button>
        </> :
        <>
          <button onClick={()=>googleSignIn()}>Sign in with Google</button>
        </>
        }
      </div>
    </div>
  )
}



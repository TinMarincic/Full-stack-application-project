'use server';
import {google} from "googleapis";
import {GoogleAuth} from "google-auth-library";

/*
const acl = calendar.acl.get()
console.log("acl ",acl);
*/
export async function book_appointment(formdata: { email: string; date: Date; service_type: string; time: Date}) {
  try {
    
const auth = new GoogleAuth({
    apiKey: "AIzaSyBvFzjEmqu7-_bKHy_GNAKYuTrOTMMlXtc"
})
const auth2 = new google.auth.GoogleAuth({apiKey: "AIzaSyBvFzjEmqu7-_bKHy_GNAKYuTrOTMMlXtc"})
console.log("Auth je ", auth2);
const authclient = await auth2.getClient();
const calendar = google.calendar({
    version: "v3",
    auth: authclient.apiKey
})
    const response = await calendar.calendarList.list()
     console.log("ovo je za kalendar", response);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error while booking:", error.message);
      return { success: false, error: error.message };
    } else {
      console.error("Unknown error occurred:", error);
      return { success: false, error: "An unknown error occurred." };
    }
  }
}


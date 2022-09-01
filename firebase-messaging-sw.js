importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js");

const FCMconfig = {
  apiKey: "AIzaSyDtVBDL69QRPyXXWS06Xa0LWF9PHr_j1GU",
  authDomain: "ar-remoteassist.firebaseapp.com",
  databaseURL: "https://ar-remoteassist.firebaseio.com",
  projectId: "ar-remoteassist",
  storageBucket: "ar-remoteassist.appspot.com",
  messagingSenderId: "755753050872",
  appId: "1:755753050872:web:9876491e1995d92ce9910d",
  measurementId: "G-XJBZLQMLEF",
};
firebase.initializeApp(FCMconfig);
const messaging = firebase.messaging();

// Background Message Handler
messaging.setBackgroundMessageHandler(function(payload) {
  console.log("Handling background message ", payload);
  if (payload.data.callName) {
    const notificationTitle = "call from " + payload.data.callName;

    const notificationOptions = {
      body: payload.data.body,
      icon: "/img/icons/favicon-32x32.png",
      data: payload.data,
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  }
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  let data = event.notification.data;
  if (data && data.callName) {
    // event.waitUntil(self.clients.openWindow("call?" + jsonToQueryString(params)));
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: false }).then((windowClients) => {
        console.log("opening window", windowClients.length, "windows");
        // Check if there is already a window/tab open with the target URL

        let url = "ra/call?" + jsonToQueryString(data);
        for (let i = 0; i < windowClients.length; i++) {
          let client = windowClients[i];
          console.log(client.url);
          client.navigate(url);
          client.focus();
          return;
        }
        // If not, then open the target URL in a new window/tab.
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
    );
  }
  return;
  // else
  //     event.waitUntil(self.clients.openWindow('contact?' + jsonToQueryString(data)));
});

function jsonToQueryString(json) {
  return (
    "?" +
    Object.keys(json)
      .map(function(key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
      })
      .join("&")
  );
}

console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "Alert!Please make way for Ambulance, ambulance is near you please keep the left most lane empty",
    icon: "http://image.ibb.co/frYOFd/tmlogo.png"
  });
});

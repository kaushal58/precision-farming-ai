# ESP32 IoT Sensor Integration

Simulated sensors run via Socket.io on the backend. To connect real ESP32 hardware:

## Wiring

- Soil moisture → GPIO 34 (ADC)
- DHT22 (temp/humidity) → GPIO 4
- Optional pH sensor → GPIO 35

## Firmware sketch (Arduino)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI";
const char* serverUrl = "http://YOUR_SERVER:5000/api/sensors";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, "PASSWORD");
  while (WiFi.status() != WL_CONNECTED) delay(500);
}

void loop() {
  int moisture = analogRead(34);
  // POST to server or use MQTT bridge
  delay(5000);
}
```

## Production

Use MQTT (Mosquitto) + server subscriber for scale. Update `server/src/utils/socket.js` to accept MQTT payloads.

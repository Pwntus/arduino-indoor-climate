#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>
#include "DHT.h"
#include "arduino_secrets.h"

#define DHTPIN 0
#define DHTTYPE DHT22

WiFiSSLClient wifi;

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int status = WL_IDLE_STATUS;

DHT dht(DHTPIN, DHTTYPE);
HttpClient client = HttpClient(wifi, "arduino-indoor-climate.vercel.app", 443);

void setup() {
  Serial.begin(9600);
  // while (!Serial);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  
  while (status != WL_CONNECTED) {
    Serial.print(F("Attempting to connect to network: "));
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(5000);
  }

  digitalWrite(LED_BUILTIN, LOW);
  Serial.println(F("We're connected!"));
  printWiFiStatus();

  dht.begin();
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  // Compute heat index in Celsius (isFahreheit = false)
  float hic = dht.computeHeatIndex(t, h, false);

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%, temperature: "));
  Serial.print(t);
  Serial.print(F("°C, heat index: "));
  Serial.print(hic);
  Serial.println(F("°C"));

  String postData = "{\"temperature\":" + String(t) + ",\"humidity\":\"" + String(h) + "\",\"heat_index\":" + String(hic) + "}";
  Serial.print(F("Sending JSON data to cloud: "));
  Serial.println(postData);
  client.post("/api/telemetry", "application/json", postData);

  int statusCode = client.responseStatusCode();
  String response = client.responseBody();
  Serial.print(F("Status code: "));
  Serial.print(statusCode);
  Serial.print(F(", response: "));
  Serial.println(response);

  delay(60000);
}

void printWiFiStatus() {
  IPAddress ip = WiFi.localIP();
  long rssi = WiFi.RSSI();

  Serial.println(F("----------------------------------------"));
  Serial.print(F("IP Address: "));
  Serial.println(ip);
  Serial.print(F("SSID: "));
  Serial.println(WiFi.SSID());
  Serial.print(F("Signal strength (RSSI): "));
  Serial.println(rssi);
  Serial.println(F("----------------------------------------"));
}

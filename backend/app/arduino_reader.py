import serial
import requests
import time

# Configure Arduino serial port
SERIAL_PORT = "/dev/tty.usbmodem1101"  # Replace with your actual port
BAUD_RATE = 9600
API_URL = "http://127.0.0.1:8000"  # Backend API URL


def read_from_arduino():
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Connected to Arduino on {SERIAL_PORT} at {BAUD_RATE} baud.")

        while True:
            line = ser.readline().decode("utf-8").strip()
            if line:
                print(f"Received: {line}")
                try:
                    # Parse the data from the Arduino
                    steps, calories = map(float, line.split(","))

                    # Send data to the backend
                    step_response = requests.post(
                        f"{API_URL}/api/v1/arduino/data",
                        json={"steps": int(steps), "calories": calories},
                    )

                    # Log responses
                    print("Backend Response:", step_response.json())
                except ValueError:
                    print(f"Invalid data format: {line}")
            time.sleep(0.5)
    except serial.SerialException as e:
        print(f"Error connecting to Arduino: {e}")
    finally:
        if "ser" in locals() and ser.is_open:
            ser.close()
            print("Closed serial connection.")


if __name__ == "__main__":
    read_from_arduino()

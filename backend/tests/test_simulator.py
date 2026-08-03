import unittest

from app.simulator.engine import TelemetrySimulator


class TelemetrySimulatorTests(unittest.TestCase):
    def test_generate_reading_returns_expected_fields(self) -> None:
        simulator = TelemetrySimulator()

        reading = simulator.generate_reading()

        self.assertIn("temperature", reading)
        self.assertIn("pressure", reading)
        self.assertIn("rpm", reading)
        self.assertIn("vibration", reading)
        self.assertIn("fuel_flow", reading)
        self.assertIn("exhaust_temperature", reading)
        self.assertIn("power_output", reading)
        self.assertIn("efficiency", reading)
        self.assertIn("timestamp", reading)
        self.assertIn("health_status", reading)

    def test_history_tracks_multiple_readings(self) -> None:
        simulator = TelemetrySimulator()

        simulator.generate_reading()
        simulator.generate_reading()

        history = simulator.get_history(limit=5)

        self.assertGreaterEqual(len(history), 2)
        self.assertEqual(history[0]["timestamp"], history[0]["timestamp"])


if __name__ == "__main__":
    unittest.main()

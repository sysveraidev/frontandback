import { useEffect, useMemo, useState } from 'react';

const defaultBackendUrl = 'http://127.0.0.1:4000';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [time, setTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState('pending');
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

  const backendUrl = useMemo(() => {
    const fromEnv = import.meta.env.VITE_BACKEND_URL;
    return typeof fromEnv === 'string' && fromEnv.trim() !== '' ? fromEnv : defaultBackendUrl;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus('ready');
      },
      () => {
        setLocationStatus('denied');
      }
    );
  }, []);

  const timeDisplay = useMemo(
    () => time.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    [time]
  );

  const submitDisabled = submitting || name.trim() === '' || age.trim() === '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitDisabled) {
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${backendUrl}/api/greet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age: Number(age) }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to fetch greeting.');
      }

      const payload = await response.json();
      setMessage(payload.message);
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Front and Back Greeting</h1>
        <p data-testid="time-display">Current time: {timeDisplay}</p>
      </header>

      <section className="location" data-testid="location-display">
        {locationStatus === 'pending' && <span>Detecting location…</span>}
        {locationStatus === 'ready' && (
          <span>
            You are at latitude {coordinates.latitude?.toFixed(4)}, longitude {coordinates.longitude?.toFixed(4)}.
          </span>
        )}
        {locationStatus === 'denied' && <span>Location access denied.</span>}
        {locationStatus === 'unsupported' && <span>Geolocation is not supported in this browser.</span>}
      </section>

      <form className="greeting-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="age">Age</label>
        <input
          id="age"
          data-testid="age-input"
          value={age}
          onChange={(event) => setAge(event.target.value)}
          type="number"
          min="0"
          placeholder="Enter your age"
          required
        />

        <button type="submit" disabled={submitDisabled} data-testid="submit-button">
          {submitting ? 'Sending…' : 'Submit'}
        </button>
      </form>

      {message && (
        <div className="result" data-testid="result-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error" role="alert" data-testid="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;

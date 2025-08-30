import React, { useState, useEffect } from 'react';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole && allowedRoles.includes(savedRole)) {
      setAuthenticated(true);
      setRole(savedRole);
    }
  }, [allowedRoles]);

  const passwordMap = {
    cbkaree2025: 'admin',
    cborg2025: 'org',
    cbguests2025: 'guest',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredRole = passwordMap[passwordInput];
    if (enteredRole && allowedRoles.includes(enteredRole)) {
      localStorage.setItem('role', enteredRole);
      setRole(enteredRole);
      setAuthenticated(true);
      setError('');
    } else {
      setError('Access denied or wrong password!');
    }
  };

  if (authenticated && allowedRoles.includes(role)) {
    return element;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#fff',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#000',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#000',
          padding: '30px 40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          width: '320px',
          textAlign: 'center',
          color: '#fff',
        }}
        aria-label="Password protected route authentication"
      >
        <h2 style={{ marginBottom: '20px' }}>Enter Password</h2>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Password"
          style={{
            width: '100%',
            padding: '12px 15px',
            fontSize: '16px',
            borderRadius: '6px',
            border: error ? '2px solid #f44336' : '2px solid #fff',
            backgroundColor: '#000',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.3s ease',
          }}
          aria-invalid={!!error}
          aria-describedby={error ? 'password-error' : undefined}
          autoFocus
        />
        <button
          type="submit"
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#fff',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}  
        >
          Submit
        </button>
        {error && (
          <p
            id="password-error"
            style={{
              color: '#f44336',
              marginTop: '15px',
              fontWeight: '600',
              fontSize: '14px',
            }}
            role="alert"
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default ProtectedRoute;

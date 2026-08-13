import { useState } from 'react';
import type { FC, FormEvent, CSSProperties } from 'react';
import GoogleRegisterButton from '../GoogleRegisterButton';

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}

const Field: FC<FieldProps> = ({ label, type = 'text', value, placeholder, onChange, autoComplete }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
      <label
        style={{
          fontFamily: 'var(--ws-font)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--ws-text)',
          letterSpacing: '0.04em'
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--ws-radius-input)',
          border: focused
            ? '1.5px solid var(--ws-accent)'
            : '1px solid rgba(44,33,24,0.12)',
          background: 'rgba(255,255,255,0.6)',
          color: 'var(--ws-text)',
          fontFamily: 'var(--ws-font)',
          fontSize: '0.95rem',
          outline: 'none',
          boxShadow: focused ? '0 0 0 4px rgba(200,169,106,0.12)' : 'none',
          transition: 'border-color 250ms ease, box-shadow 250ms ease'
        }}
      />
    </div>
  );
};

const RegisterForm: FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('[RegisterForm] Registro visual pendiente de Firebase.', { name, email });
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.9rem'
      }}
    >
      <Field label="Nombre" value={name} placeholder="Tu nombre" onChange={setName} autoComplete="name" />
      <Field label="Correo electrónico" type="email" value={email} placeholder="correo@ejemplo.com" onChange={setEmail} autoComplete="email" />
      <Field label="Contraseña" type="password" value={password} placeholder="••••••••" onChange={setPassword} autoComplete="new-password" />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.95rem 1.1rem',
          borderRadius: 'var(--ws-radius-btn)',
          border: 'none',
          background: loading
            ? 'rgba(200,169,106,0.6)'
            : 'linear-gradient(135deg, #d6c3a5, #c8a96a)',
          color: '#2c2118',
          fontFamily: 'var(--ws-font)',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: 'var(--ws-shadow-btn)',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          opacity: loading ? 0.8 : 1
        }}
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '0.25rem' }}>
        <GoogleRegisterButton onRegister={() => console.log('[Registro] Google pendiente de Firebase.')} />
      </div>
    </form>
  );
};

export default RegisterForm;

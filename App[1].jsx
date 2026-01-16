import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = 'http://localhost:5000/api'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      setCurrentUser(JSON.parse(user))
      fetchTodos(token)
    }
  }, [])

  const fetchTodos = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      }
    } catch (err) {
      console.error('Error fetching todos:', err)
    }
  }

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setAuthError('Please fill all fields')
      return
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setCurrentUser(data.user)
        setTodos([])
        setAuthError('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      } else {
        setAuthError(data.error)
      }
    } catch (err) {
      setAuthError('Server error')
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setAuthError('Please fill all fields')
      return
    }
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setCurrentUser(data.user)
        await fetchTodos(data.token)
        setAuthError('')
        setEmail('')
        setPassword('')
      } else {
        setAuthError(data.error)
      }
    } catch (err) {
      setAuthError('Server error')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
    setTodos([])
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newTodo.trim() })
      })
      if (response.ok) {
        const newTodoItem = await response.json()
        setTodos([newTodoItem, ...todos])
        setNewTodo('')
      }
    } catch (err) {
      console.error('Error adding todo:', err)
    }
  }

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: todo.text, completed: !todo.completed })
      })
      if (response.ok) {
        setTodos(todos.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        ))
      }
    } catch (err) {
      console.error('Error updating todo:', err)
    }
  }

  const startEdit = (id, text) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = async () => {
    if (!editText.trim()) return
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_BASE}/todos/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: editText.trim(), completed: todos.find(t => t.id === editingId).completed })
      })
      if (response.ok) {
        setTodos(todos.map(t => 
          t.id === editingId ? { ...t, text: editText.trim() } : t
        ))
        setEditingId(null)
        setEditText('')
      }
    } catch (err) {
      console.error('Error updating todo:', err)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const deleteTodo = async (id) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        setTodos(todos.filter(t => t.id !== id))
      }
    } catch (err) {
      console.error('Error deleting todo:', err)
    }
  }

  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h1>{isLogin ? 'Sign In' : 'Sign Up'}</h1>
          {authError && <p className="error">{authError}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <button onClick={isLogin ? handleLogin : handleSignup} disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
          <p onClick={() => { setIsLogin(!isLogin); setAuthError(''); setEmail(''); setPassword(''); setConfirmPassword(''); }}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Simple Todo App</h1>
        <div className="user-info">
          <span>Welcome, {currentUser.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {editingId === todo.id ? (
              <div className="edit-section">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                />
                <button onClick={saveEdit}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <span className="todo-text">{todo.text}</span>
            )}
            {editingId !== todo.id && (
              <div className="actions">
                <button onClick={() => startEdit(todo.id, todo.text)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App

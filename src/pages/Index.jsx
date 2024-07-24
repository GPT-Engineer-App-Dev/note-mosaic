import React, { useState, useEffect } from 'react';
import { Plus, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import NotesList from './NotesList';
import NoteDetail from './NoteDetail';

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      color: '#ffffff',
      tags: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    setSelectedNote(updatedNote);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
    setSelectedNote(null);
  };

  const handleLogin = () => {
    if (username === 'user' && password === 'pass') {
      setIsLoggedIn(true);
      setShowLoginDialog(false);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  const getNotesPerDay = () => {
    const counts = {};
    notes.forEach(note => {
      const date = new Date(note.createdAt).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notes App</h1>
        {isLoggedIn ? (
          <Button onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
        ) : (
          <Button onClick={() => setShowLoginDialog(true)}><LogIn className="mr-2 h-4 w-4" /> Login</Button>
        )}
      </header>

      {isLoggedIn ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <Button onClick={handleAddNote} className="mb-4"><Plus className="mr-2 h-4 w-4" /> Add Note</Button>
            <NotesList 
              notes={notes} 
              onSelectNote={setSelectedNote} 
              selectedNoteId={selectedNote?.id}
            />
          </div>
          <div className="w-full md:w-2/3">
            {selectedNote && (
              <NoteDetail 
                note={selectedNote} 
                onUpdateNote={handleUpdateNote} 
                onDeleteNote={handleDeleteNote}
              />
            )}
          </div>
        </div>
      ) : (
        <Alert>
          <AlertDescription>Please log in to view and manage your notes.</AlertDescription>
        </Alert>
      )}

      {isLoggedIn && (
        <Card className="mt-8">
          <CardHeader>Notes Created Per Day</CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getNotesPerDay()}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <DialogFooter>
            <Button onClick={handleLogin}>Log in</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
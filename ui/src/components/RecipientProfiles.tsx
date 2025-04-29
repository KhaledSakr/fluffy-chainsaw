import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RecipientProfile } from '../types/types';
import RecipientForm from './RecipientForm';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2, Edit } from 'lucide-react';

const RECIPIENT_PROFILES_KEY = 'recipientProfiles';

const RecipientProfilesComponent: React.FC = () => {
  const [profiles, setProfiles] = useState<RecipientProfile[]>([]);
  const [editingProfile, setEditingProfile] = useState<Partial<RecipientProfile> | null>(null);

  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem(RECIPIENT_PROFILES_KEY);
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      }
    } catch (error) {
      console.error('Error loading recipient profiles from localStorage:', error);
      localStorage.removeItem(RECIPIENT_PROFILES_KEY); // Clear corrupted data
      setProfiles([]); // Reset state
    }
  }, []);

  const saveProfiles = (updatedProfiles: RecipientProfile[]) => {
    try {
      setProfiles(updatedProfiles);
      localStorage.setItem(RECIPIENT_PROFILES_KEY, JSON.stringify(updatedProfiles));
    } catch (error) {
      console.error('Error saving recipient profiles to localStorage:', error);
      alert('Failed to save recipient profiles. Please try again.');
    }
  };

  const handleAddRecipient = () => {
    setEditingProfile({}); // Start with an empty object for a new profile
  };

  const handleEditRecipient = (profile: RecipientProfile) => {
    setEditingProfile(profile);
  };

  const handleDeleteRecipient = (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipient?')) {
      const updatedProfiles = profiles.filter((p) => p.id !== id);
      saveProfiles(updatedProfiles);
    }
  };

  const handleSaveRecipient = (recipient: RecipientProfile) => {
    let updatedProfiles;
    if (recipient.id) {
      // Editing existing profile
      updatedProfiles = profiles.map((p) => (p.id === recipient.id ? recipient : p));
    } else {
      // Adding new profile
      const newProfile = { ...recipient, id: uuidv4() };
      updatedProfiles = [...profiles, newProfile];
    }
    saveProfiles(updatedProfiles);
    setEditingProfile(null); // Close the form
  };

  const handleCancelEdit = () => {
    setEditingProfile(null);
  };

  if (editingProfile) {
    return (
      <RecipientForm
        recipient={editingProfile}
        onSave={handleSaveRecipient}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recipient Profiles</CardTitle>
          <CardDescription>Manage your invoice recipients.</CardDescription>
        </div>
        <Button onClick={handleAddRecipient}>Add New Recipient</Button>
      </CardHeader>
      <CardContent>
        {profiles.length === 0 ? (
          <p className="text-center text-gray-500">No recipients added yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.address}</TableCell>
                  <TableCell>{profile.email || '-'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditRecipient(profile)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteRecipient(profile.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecipientProfilesComponent;


import React, { useState, useEffect } from 'react';
import { CompanyProfile } from '../types/types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';

const COMPANY_PROFILE_KEY = 'companyProfile';

const defaultProfile: CompanyProfile = {
  name: '',
  address: '',
  email: '',
  telephone: '',
  companyLongName: '',
  companyAddressLine1: '',
  companyAddressLine2: '',
  companyCountry: '',
  companyShortName: '',
};

const CompanyProfileComponent: React.FC = () => {
  const [profile, setProfile] = useState<CompanyProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(COMPANY_PROFILE_KEY);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setIsEditing(true); // Start in edit mode if no profile saved
      }
    } catch (error) {
      console.error('Error loading company profile from localStorage:', error);
      localStorage.removeItem(COMPANY_PROFILE_KEY); // Clear corrupted data
      setProfile(defaultProfile); // Reset state to default
      setIsEditing(true); // Go to edit mode if loading failed
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(COMPANY_PROFILE_KEY, JSON.stringify(profile));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving company profile to localStorage:', error);
      alert('Failed to save company profile. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" name="name" value={profile.name} onChange={handleInputChange} placeholder="Your Full Name" />
            </div>
            <div>
              <Label htmlFor="address">Your Address</Label>
              <Input id="address" name="address" value={profile.address} onChange={handleInputChange} placeholder="Your Street Address, City, ZIP" />
            </div>
            <div>
              <Label htmlFor="email">Your Email</Label>
              <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} placeholder="your.email@example.com" />
            </div>
            <div>
              <Label htmlFor="telephone">Your Telephone</Label>
              <Input id="telephone" name="telephone" value={profile.telephone} onChange={handleInputChange} placeholder="+1234567890" />
            </div>
            <div>
              <Label htmlFor="companyLongName">Company Full Name</Label>
              <Input id="companyLongName" name="companyLongName" value={profile.companyLongName} onChange={handleInputChange} placeholder="Your Company Inc." />
            </div>
             <div>
              <Label htmlFor="companyShortName">Company Short Name (for folders)</Label>
              <Input id="companyShortName" name="companyShortName" value={profile.companyShortName} onChange={handleInputChange} placeholder="YourCompany" />
            </div>
            <div>
              <Label htmlFor="companyAddressLine1">Company Address Line 1</Label>
              <Input id="companyAddressLine1" name="companyAddressLine1" value={profile.companyAddressLine1} onChange={handleInputChange} placeholder="Company Street Address" />
            </div>
            <div>
              <Label htmlFor="companyAddressLine2">Company Address Line 2</Label>
              <Input id="companyAddressLine2" name="companyAddressLine2" value={profile.companyAddressLine2} onChange={handleInputChange} placeholder="City, State, ZIP" />
            </div>
            <div>
              <Label htmlFor="companyCountry">Company Country</Label>
              <Input id="companyCountry" name="companyCountry" value={profile.companyCountry} onChange={handleInputChange} placeholder="Country" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p><strong>Your Name:</strong> {profile.name}</p>
            <p><strong>Your Address:</strong> {profile.address}</p>
            <p><strong>Your Email:</strong> {profile.email}</p>
            <p><strong>Your Telephone:</strong> {profile.telephone}</p>
            <p><strong>Company Name:</strong> {profile.companyLongName}</p>
            <p><strong>Company Short Name:</strong> {profile.companyShortName}</p>
            <p><strong>Company Address:</strong> {profile.companyAddressLine1}, {profile.companyAddressLine2}, {profile.companyCountry}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {isEditing ? (
          <Button onClick={handleSave}>Save Profile</Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CompanyProfileComponent;


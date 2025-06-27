import React, { useState, useEffect } from 'react';
import { Settings, Key, MapPin, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NOVA_CONFIG, getAPIKey } from '../config/novaConfig';

interface SettingsPanelProps {
  onBack: () => void;
}

const SettingsPanel = ({ onBack }: SettingsPanelProps) => {
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [yelpApiKey, setYelpApiKey] = useState('');
  const [liveVenueData, setLiveVenueData] = useState(NOVA_CONFIG.enableRealVenueData);
  const [locationServices, setLocationServices] = useState(NOVA_CONFIG.enableLocationServices);
  const [notifications, setNotifications] = useState(true);
  const [searchRadius, setSearchRadius] = useState(NOVA_CONFIG.defaultSearchRadius / 1000); // Convert to km
  const [maxResults, setMaxResults] = useState(NOVA_CONFIG.maxVenueResults);

  useEffect(() => {
    // Load existing API keys
    const existingGoogleKey = getAPIKey('google');
    if (existingGoogleKey) {
      setGoogleApiKey('••••••••••••••••'); // Mask the key for display
    }
    
    const existingYelpKey = getAPIKey('yelp');
    if (existingYelpKey) {
      setYelpApiKey('••••••••••••••••'); // Mask the key for display
    }
  }, []);

  const handleSaveGoogleApiKey = () => {
    if (googleApiKey && googleApiKey !== '••••••••••••••••') {
      localStorage.setItem('google_maps_api_key', googleApiKey);
      setGoogleApiKey('••••••••••••••••'); // Mask after saving
      console.log('Google Maps API key saved successfully');
    }
  };

  const handleRemoveGoogleApiKey = () => {
    localStorage.removeItem('google_maps_api_key');
    setGoogleApiKey('');
    console.log('Google Maps API key removed');
  };

  const handleSaveYelpApiKey = () => {
    if (yelpApiKey && yelpApiKey !== '••••••••••••••••') {
      localStorage.setItem('yelp_api_key', yelpApiKey);
      setYelpApiKey('••••••••••••••••'); // Mask after saving
      console.log('Yelp API key saved successfully');
    }
  };

  const handleRemoveYelpApiKey = () => {
    localStorage.removeItem('yelp_api_key');
    setYelpApiKey('');
    console.log('Yelp API key removed');
  };

  const handleLiveDataToggle = (enabled: boolean) => {
    setLiveVenueData(enabled);
    localStorage.setItem('nova_live_venue_data', enabled.toString());
    console.log('Live venue data:', enabled ? 'enabled' : 'disabled');
  };

  const handleLocationToggle = (enabled: boolean) => {
    setLocationServices(enabled);
    localStorage.setItem('nova_location_services', enabled.toString());
    console.log('Location services:', enabled ? 'enabled' : 'disabled');
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('nova_notifications', enabled.toString());
  };

  const handleSearchRadiusChange = (value: string) => {
    const radius = parseInt(value);
    if (radius > 0 && radius <= 50) {
      setSearchRadius(radius);
      localStorage.setItem('nova_search_radius', (radius * 1000).toString());
    }
  };

  const handleMaxResultsChange = (value: string) => {
    const max = parseInt(value);
    if (max > 0 && max <= 50) {
      setMaxResults(max);
      localStorage.setItem('nova_max_results', max.toString());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-card border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" onClick={onBack}>
            ←
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="pt-16 pb-20 px-4 space-y-6">
        {/* API Keys Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key size={20} />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure API keys for live venue data from Google Maps, Yelp, and other providers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Maps API Key */}
            <div className="space-y-2">
              <Label htmlFor="google-key">Google Maps API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="google-key"
                  type="password"
                  value={googleApiKey}
                  onChange={(e) => setGoogleApiKey(e.target.value)}
                  placeholder="Enter your Google Maps API key"
                  className="flex-1"
                />
                <Button onClick={handleSaveGoogleApiKey} size="sm">
                  Save
                </Button>
                {googleApiKey && (
                  <Button onClick={handleRemoveGoogleApiKey} variant="outline" size="sm">
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Get your API key from{' '}
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" className="text-primary hover:underline">
                  Google Cloud Console
                </a>
              </p>
            </div>

            <Separator />

            {/* Yelp API Key */}
            <div className="space-y-2">
              <Label htmlFor="yelp-key">Yelp Fusion API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="yelp-key"
                  type="password"
                  value={yelpApiKey}
                  onChange={(e) => setYelpApiKey(e.target.value)}
                  placeholder="Enter your Yelp API key"
                  className="flex-1"
                />
                <Button onClick={handleSaveYelpApiKey} size="sm">
                  Save
                </Button>
                {yelpApiKey && (
                  <Button onClick={handleRemoveYelpApiKey} variant="outline" size="sm">
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Get your free API key from{' '}
                <a href="https://www.yelp.com/developers" target="_blank" rel="noopener" className="text-primary hover:underline">
                  Yelp Developers
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin size={20} />
              Data & Privacy
            </CardTitle>
            <CardDescription>
              Control how Nova accesses and uses your location and venue data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="live-data">Live Venue Data</Label>
                <p className="text-sm text-muted-foreground">
                  Use real-time venue information from APIs
                </p>
              </div>
              <Switch
                id="live-data"
                checked={liveVenueData}
                onCheckedChange={handleLiveDataToggle}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="location-services">Location Services</Label>
                <p className="text-sm text-muted-foreground">
                  Allow Nova to access your location for nearby recommendations
                </p>
              </div>
              <Switch
                id="location-services"
                checked={locationServices}
                onCheckedChange={handleLocationToggle}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="notifications">Smart Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get alerts about venue updates and friend activity
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={handleNotificationsToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Search Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Search Preferences
            </CardTitle>
            <CardDescription>
              Customize how Nova searches for venues in your area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-radius">Search Radius (km)</Label>
              <Input
                id="search-radius"
                type="number"
                min="1"
                max="50"
                value={searchRadius}
                onChange={(e) => handleSearchRadiusChange(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                How far Nova should look for venues (1-50 km)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-results">Max Results</Label>
              <Input
                id="max-results"
                type="number"
                min="3"
                max="50"
                value={maxResults}
                onChange={(e) => handleMaxResultsChange(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Maximum number of venues to show at once (3-50)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Google Maps API</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  googleApiKey ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {googleApiKey ? 'Connected' : 'Not Configured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Yelp API</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  yelpApiKey ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {yelpApiKey ? 'Connected' : 'Not Configured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Location Services</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  locationServices ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {locationServices ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Live Data</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  liveVenueData ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {liveVenueData ? 'Active' : 'Fallback Mode'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPanel;

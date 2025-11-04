import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Phone, Star, Navigation } from "lucide-react";
import { toast } from "sonner";

const FindDoctors = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const mockDoctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "General Physician",
      distance: "0.8 km",
      rating: 4.8,
      phone: "(555) 123-4567",
      address: "123 Health Street, Medical District",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Cardiologist",
      distance: "1.2 km",
      rating: 4.9,
      phone: "(555) 234-5678",
      address: "456 Heart Avenue, Medical Center",
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Endocrinologist",
      distance: "1.5 km",
      rating: 4.7,
      phone: "(555) 345-6789",
      address: "789 Wellness Boulevard, Health Plaza",
    },
    {
      name: "Dr. James Wilson",
      specialty: "Family Medicine",
      distance: "2.0 km",
      rating: 4.6,
      phone: "(555) 456-7890",
      address: "321 Care Lane, Community Health",
    },
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMapLoaded(true);
        },
        () => {
          toast.error("Unable to get your location");
          setMapLoaded(true);
        }
      );
    }
  }, []);

  const openInGoogleMaps = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const getDirections = (address: string) => {
    if (userLocation) {
      const destination = encodeURIComponent(address);
      window.open(
        `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination}`,
        "_blank"
      );
    } else {
      toast.error("Unable to get your current location");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <Card className="shadow-elevated animate-scale-in">
            <CardHeader>
              <CardTitle className="text-3xl">Find Nearby Doctors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Enter location or specialty..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-14 text-lg"
                />
                <Button className="h-14 px-8" onClick={() => toast.info("Searching nearby...")}>
                  Search
                </Button>
              </div>

              {mapLoaded && userLocation && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>Your current location detected</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open("https://www.google.com/maps/search/doctors+near+me", "_blank")}
                    className="w-full"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Open Full Map View
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {mockDoctors.map((doctor, index) => (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-elevated transition-all animate-slide-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-2xl font-bold">{doctor.name}</h3>
                      <p className="text-lg text-primary font-medium">{doctor.specialty}</p>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-warning text-warning" />
                          <span className="text-base font-semibold">{doctor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-5 h-5" />
                          <span className="text-base">{doctor.distance} away</span>
                        </div>
                      </div>
                      <p className="text-base text-muted-foreground">{doctor.address}</p>
                      <div className="flex items-center gap-2 text-base">
                        <Phone className="w-5 h-5" />
                        <a href={`tel:${doctor.phone}`} className="text-primary hover:underline">
                          {doctor.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 md:w-48">
                      <Button
                        onClick={() => getDirections(doctor.address)}
                        className="w-full"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => openInGoogleMaps(doctor.address)}
                        className="w-full"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Map
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDoctors;
